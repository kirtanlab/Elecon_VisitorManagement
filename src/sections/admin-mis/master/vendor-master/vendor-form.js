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
import axios from 'axios';
import label from 'src/components/label';

export default function VendorForm({ currentUser }) {
  const settings = useSettingsContext();

  const { toggleAddDepartmentFlag } = useAdminMISContext();

  const { user } = useAuthContext();

  const [done, setDone] = useState(false);

  const [companies, setCompanies] = useState([]);

  const [divisions, setDivisions] = useState([]);

  const [departments, setDepartments] = useState([]);

  const VendorSchema = Yup.object().shape({
    companyName: Yup.string().required('Company name is required'),
    divisionName: Yup.string().required('Division name is required'),
    departmentName: Yup.string().required('Department name is required'),
    vendorName: Yup.string().required('Vendor name is required'),
    contactNo: Yup.string()
      .matches(/^(\d{10})?$/, 'Invalid Phone number')
      .required('Phone number is required'),
    address1: Yup.string()
      .matches(/^(.{10,})$/, 'Address must have atleast 20 characters')
      .required('Address is required'),
    address2: Yup.string()
      .matches(/^(.{10,})$/, 'Address must have atleast 20 characters')
      .required('Address is required'),
    city: Yup.string().required('City name is required'),
    pincode: Yup.string()
      .matches(/^.{6,}$/, 'Invalid pincode')
      .required('Pincode is required'),
    vendorcode: Yup.string().required('Vendor code is required'),
    state: Yup.string().required('State name is required'),
    email_id: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
  });

  const defaultValues = useMemo(
    () => ({
      companyName: currentUser?.companyName || '',
      divisionName: currentUser?.divisionName || '',
      departmentName: currentUser?.departmentName || '',
      vendorName: currentUser?.vendorName || '',
      contactNo: currentUser?.contactNo || '',
      address1: currentUser?.address1 || '',
      address2: currentUser?.address2 || '',
      city: currentUser?.city || '',
      pincode: currentUser?.pincode || '',
      state: currentUser?.state || '',
      email_id: currentUser?.email_id || '',
      vendorcode: currentUser?.vendorcode || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(VendorSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const watchCompanyName = watch('companyName');
  const watchDivisionName = watch('divisionName');

  const getDepartments = async () => {
    try {
      try {
        // console.log("here in getDivisions : ", watchCompanyName, companies);
        const division_id = divisions.filter((c) => {
          if (c?.label === watchDivisionName) {
            return true;
          } else {
            return false;
          }
        })[0].value;

        console.log(division_id);

        const URL = `http://localhost:5000/api/v1/division/getDepartmentByDivision/${division_id}`;
        const res = await axios.get(URL);
        const generetedData = res?.data?.data?.department.map((el) => {
          return { label: el.department_name, value: el._id };
        });

        // console.log("here in division : ", generetedData)
        setDepartments(generetedData);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // console.log("useEffect called company name");
    getDepartments();
  }, [watchDivisionName]);

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
    const company_id = companies.filter((c) => {
      if (c?.label === data?.companyName) {
        return true;
      } else {
        return false;
      }
    })[0]?.value;
    const division_id = divisions.filter((d) => {
      if (d?.label === data?.divisionName) {
        return true;
      } else {
        return false;
      }
    })[0]?.value;

    const department_id = departments.filter((d) => {
      if (d?.label === data?.departmentName) {
        return true;
      } else {
        return false;
      }
    })[0]?.value;

    if (company_id === undefined || division_id === undefined || department_id === undefined) {
      // throw new Error("invalid company or division or department name");
      alert('invalid company or division or department name');
      return;
    }

    try {
      const URL = `http://localhost:5000/api/v1/vendor`;
      const res = await axios.post(URL, {
        company_id,
        division_id,
        department_id,
        name: data.vendorName,
        phone_no: data.contactNo,
        email_id: data.email_id,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        vendor_code: data.vendorcode,
      });
      toggleAddDepartmentFlag();
      reset();
      setDone(true);
    } catch (err) {
      alert('something went wrong');
      console.log(err.message);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid xs={12} md={1}></Grid>

        <Grid container xs={12} md={10} sx={{ marginTop: 5 }} justifyContent={'center'}>
          <Card sx={{ p: 3, width: '80%' }}>
            {/* <Typography variant="h4">Vendor Master</Typography> */}
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
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
              <RHFAutocomplete
                name="departmentName"
                label="Department Name *"
                options={departments.map((departmentName) => departmentName.label)}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const { label } = departments.filter(
                    (departmentName) => departmentName.label === option
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
              <RHFTextField name="vendorName" label="Vendor Name *" />
              <RHFTextField name="vendorcode" label="Vendor code *" />
              <RHFTextField name="contactNo" label="Contact Number *" />
              <RHFTextField name="address1" label="Address 1 *" multiline rows={4} />
              <RHFTextField name="address2" label="Address 2 *" multiline rows={4} />
              <RHFTextField name="email_id" label="Email *" />
              <RHFTextField name="city" label="City *" />
              <RHFTextField name="pincode" label="Pincode *" />
              <RHFTextField name="state" label="State *" />
            </Box>
            {done && (
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                <strong>Vendor has been registered!</strong>
              </Alert>
            )}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Add Vendor' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

VendorForm.propTypes = {
  currentUser: PropTypes.object,
};
