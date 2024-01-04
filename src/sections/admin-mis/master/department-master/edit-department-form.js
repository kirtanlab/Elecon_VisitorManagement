/* eslint-disable */
import PropTypes from 'prop-types';
import { useMemo, React, useState, useEffect } from 'react';
import { useForm, useController, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// @mui
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import axios from 'axios';
import Typography from '@mui/material/Typography';
// import { DatePicker } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// assets
import { roles } from 'src/assets/data/roles';
// components
import { Alert, AlertTitle, Grid, TextareaAutosize } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { RHFTextField, RHFEditor, RHFAutocomplete } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';
import { useAuthContext } from 'src/auth/hooks';
import { useAdminMISContext } from 'src/context/admin_mis_context';
import DepartmentForm from './department-form';

export default function EditDepartmentForm({ currentUser }) {
  const settings = useSettingsContext();

  const { toggleAddDepartmentFlag, itemMasterId } = useAdminMISContext();

  const { user } = useAuthContext();

  const [done, setDone] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const DepartmentSchema = Yup.object().shape({
    companyName: Yup.string().required('Company name is required'),
    divisionName: Yup.string().required('Division name is required'),
    departmentName: Yup.string().required('Department name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      companyName: currentUser?.companyName || '',
      divisionName: currentUser?.divisionName || '',
      departmentName: currentUser?.departmentName || '',
      // dateOfOccurrence: currentUser?.dateOfOccurrence || dayjs(Date.now())
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(DepartmentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting, isDirty },
  } = methods;

  const watchCompanyName = watch('companyName');
  // const companies = [
  //     { label: "Admin" },
  //     { label: "Civil" },
  //     { label: "Security" },
  // ]

  const getCompanies = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/company/getAll`;
      const res = await axios.get(URL);
      const generetedData = res?.data?.data.map((el) => {
        return { label: el.company_name, value: el._id };
      });

      setCompanies(generetedData);
    } catch (err) {
      alert('something went wrong');
      console.log(err);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  // const divisions = [
  //     { label: "Admin" },
  //     { label: "Civil" },
  //     { label: "Security" },
  // ]

  const getDivisions = async () => {
    try {
      console.log('here in getDivisions : ', watchCompanyName, companies);
      const company_id = companies.filter((c) => {
        if (c?.label === watchCompanyName) {
          return true;
        } else {
          return false;
        }
      })[0].value;

      console.log(company_id);

      const URL = `http://localhost:5000/api/v1/company/getDivisionByCompany/${company_id}`;
      const res = await axios.get(URL);
      const generetedData = res?.data?.data?.division.map((el) => {
        return { label: el.division_name, value: el._id };
      });

      console.log('here in division : ', generetedData);
      setDivisions(generetedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // console.log("useEffect called company name");
    getDivisions();
  }, [watchCompanyName]);

  const onSubmit = handleSubmit(async (data) => {
    const division_id = divisions.filter((d) => {
      if (d?.label === data?.divisionName) {
        return true;
      } else {
        return false;
      }
    })[0].value;

    
    try {
      const URL = `http://localhost:5000/api/v1/department/${itemMasterId}`;
      const res = await axios.post(URL, {
        department_name: data.departmentName,
        division_id
      });
      toggleAddDepartmentFlag();
      reset();
      setDone(true);
    } catch (err) {
      console.log(err);
    }
  });
  const getSpecificDepartment = async () => {
    try {
      console.log('also id', itemMasterId);
      const URL = `http://localhost:5000/api/v1/department/${itemMasterId}`;
      const res = await axios.get(URL);
      console.log('res is ', res.data);

      const r2 = await axios.get(`http://localhost:5000/api/v1/department/getAll`);
      const {company:c_name, division:di_name} = r2?.data?.data.filter((el) => {
        if(el._id === itemMasterId){
          return true;
        }
        else{
          return false
        }

      })[0]


      setValue('companyName', c_name, { shouldValidate: true });
      setValue('divisionName', di_name, { shouldValidate: true });
      setValue('departmentName', res?.data?.data?.department_name, { shouldValidate: true });



      const r = await axios.get('http://localhost:5000/api/v1/company/all/companies');

      let gotDivision = [];
      let gotDepartment = [];
      r?.data?.data.forEach((el) => {
        if (el.company_name === c_name) {
          gotDivision = el.division.map((div) => {
            return { label: div.division_name, value: div._id };
          });
        }
      });
      setDivisions(gotDivision);
      
      
    } catch (err) {
      console.log("here in sp dept error");
      console.log(err);
    }
  };
  useEffect(() => {
    getSpecificDepartment();
  }, []);
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid xs={12} md={1}></Grid>

        <Grid container xs={12} md={10} sx={{ marginTop: 5 }} justifyContent={'center'}>
          <Card sx={{ p: 3, width: '80%' }}>
            {/* <Typography variant="h4">Department Master</Typography> */}
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              // gridTemplateColumns={{
              //   xs: 'repeat(1, 1fr)',
              //   sm: 'repeat(2, 1fr)',
              // }}
            >
              <RHFAutocomplete
                name="companyName"
                label="Company Name *"
                options={companies.map((companyName) => companyName.label)}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const { label } = companies.filter((companyName) => {
                    return companyName.label === option;
                  })[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      {/* hello */}
                      {label}
                    </li>
                  );
                }}
              />
              <RHFAutocomplete
                name="divisionName"
                label="Divison Name *"
                options={divisions.map((divisionName) => divisionName.label)}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const { label } = divisions.filter(
                    (divisionName) => divisionName.label === option
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      {label}
                    </li>
                  );
                }}
              />
              <RHFTextField name="departmentName" label="Department Name *" />
            </Box>
            {done && (
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                <strong>Department name has been saved!</strong>
              </Alert>
            )}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                'Save Changes'
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

DepartmentForm.propTypes = {
  currentUser: PropTypes.object,
};
