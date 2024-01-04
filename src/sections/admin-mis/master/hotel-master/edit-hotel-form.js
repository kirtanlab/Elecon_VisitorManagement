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
import HotelForm from './hotel-form';

export default function EditHotelForm({ currentUser }) {
  const settings = useSettingsContext();

  const { toggleAddDepartmentFlag, itemMasterId } = useAdminMISContext();

  const { user } = useAuthContext();

  const [done, setDone] = useState(false);

  const [companies, setCompanies] = useState([]);

  const [divisions, setDivisions] = useState([]);

  const [departments, setDepartments] = useState([]);

  const HotelSchema = Yup.object().shape({
    companyName: Yup.string().required('Company name is required'),
    divisionName: Yup.string().required('Division name is required'),
    departmentName: Yup.string().required('Department name is required'),
    hotelName: Yup.string().required('Hotel name is required'),
    contactNo: Yup.string()
      .matches(/^(\d{10})?$/, 'Invalid Phone number')
      .required('Phone number is required'),
    address1: Yup.string()
      .matches(/^.{20,}$/, 'Address must have atleast 20 characters')
      .required('Address is required'),
    address2: Yup.string()
      .matches(/^.{20,}$/, 'Address must have atleast 20 characters')
      .required('Address is required'),
    city: Yup.string().required('City name is required'),
    pincode: Yup.string()
      .matches(/^.{6,}$/, 'Invalid pincode')
      .required('Pincode is required'),
    district: Yup.string().required('District is required'),
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
      hotelName: currentUser?.hotelName || '',
      contactNo: currentUser?.contactNo || '',
      address1: currentUser?.address1 || '',
      address2: currentUser?.address2 || '',
      city: currentUser?.city || '',
      pincode: currentUser?.pincode || '',
      state: currentUser?.state || '',
      email_id: currentUser?.email_id || '',
      district: currentUser?.district || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(HotelSchema),
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
    })[0].value;
    const division_id = divisions.filter((d) => {
      if (d?.label === data?.divisionName) {
        return true;
      } else {
        return false;
      }
    })[0].value;

    const department_id = departments.filter((d) => {
      if (d?.label === data?.departmentName) {
        return true;
      } else {
        return false;
      }
    })[0].value;

    try {
      const URL = `http://localhost:5000/api/v1/hotel/${itemMasterId}`;
      const res = await axios.post(URL, {
        company: company_id,
        division: division_id,
        department: department_id,
        name: data.hotelName,
        phone_no: data.contactNo,
        email_id: data.email_id,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        district: data.district,
      });
      toggleAddDepartmentFlag();
      reset();
      setDone(true);
    } catch (err) {
      console.log(err);
    }
  });
  const getSpecificHotel = async () => {
    try {
      console.log('this is id', itemMasterId);
      const URL = `http://localhost:5000/api/v1/hotel/${itemMasterId}`;

      const res = await axios.get(URL);
      console.log('specific vendor ', res.data.data.company.company_name);

      setValue('companyName', res.data.data.company.company_name, { shouldValidate: true });
      setValue('divisionName', res.data.data.division.division_name, { shouldValidate: true });
      setValue('departmentName', res.data.data.department.department_name, {
        shouldValidate: true,
      });
      setValue('hotelName', res.data.data.name, { shouldValidate: true });
      setValue('hotelcode', res.data.data.hotel_code, { shouldValidate: true });
      setValue('contactNo', res.data.data.phone_no, { shouldValidate: true });
      setValue('address1', res.data.data.address1, { shouldValidate: true });
      setValue('address2', res.data.data.address2, { shouldValidate: true });
      setValue('city', res.data.data.city, { shouldValidate: true });
      setValue('pincode', res.data.data.pincode, { shouldValidate: true });
      setValue('district', res.data.data.district, { shouldValidate: true });
      setValue('state', res.data.data.state, { shouldValidate: true });
      setValue('email_id', res.data.data.email_id, { shouldValidate: true });

      const c_name = res.data.data.company.company_name;
      const di_name = res.data.data.division.division_name;

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

      r?.data?.data.forEach((el) => {
        if (el.company_name === c_name) {
          el.division.map((div) => {
            if (div.division_name === di_name) {
              gotDepartment = div.department.map((dept) => {
                return { label: dept.department_name, value: dept._id };
              });
            }
          });
        }
      });

      console.log('here in useeffect divisin', gotDivision);

      setDivisions(gotDivision);
      setDepartments(gotDepartment);
      console.log('after setting default values');
    } catch (err) {
      console.log('wrroe in edit fetching ', err);
      alert('something went wrong here in');
    }
  };

  useEffect(() => {
    // getAllHOD();
    getSpecificHotel();
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid xs={12} md={1}></Grid>

        <Grid container xs={12} md={10} sx={{ marginTop: 5 }} justifyContent={'center'}>
          <Card sx={{ p: 3, width: '80%' }}>
            {/* <Typography variant="h4">Hotel Master</Typography> */}
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
              <RHFTextField name="hotelName" label="Hotel Name *" />
              <RHFTextField name="contactNo" label="Hotel Contact Number *" />
              <RHFTextField name="email_id" label="Hotel Mail Address*" />
              <RHFTextField name="address1" label="Hotel Address 1 *" multiline rows={4} />
              <RHFTextField name="address2" label="Hotel Address 2 *" multiline rows={4} />
              <RHFTextField name="city" label="City *" />
              <RHFTextField name="pincode" label="Pincode *" />
              <RHFTextField name="district" label="District *" />
              <RHFTextField name="state" label="State *" />
            </Box>
            {done && (
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                <strong>Hotel Information has been registered!</strong>
              </Alert>
            )}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

EditHotelForm.propTypes = {
  currentUser: PropTypes.object,
};
