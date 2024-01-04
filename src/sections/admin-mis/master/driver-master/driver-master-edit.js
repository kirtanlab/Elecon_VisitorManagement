/* eslint-disable */
import PropTypes from 'prop-types';
import { useMemo, React, useState, useEffect } from 'react';
import { useForm, useController, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import dayjs, {Dayjs} from 'dayjs'
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

export default function EditDriverForm({ currentUser }) {
  const settings = useSettingsContext();

  const { toggleAddDepartmentFlag, itemMasterId } = useAdminMISContext();

  const { user } = useAuthContext();

  const [done, setDone] = useState(false);

  const [companies, setCompanies] = useState([]);

  const [divisions, setDivisions] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [contractors, setContractors] = useState([
    {label: "contractor 1"},
    {label: "contractor 2"},
    {label: "contractor 3"},
    {label: "contractor 4"},
    {label: "contractor 5"},
])

  const VendorSchema = Yup.object().shape({
    companyName: Yup.string().required('Company name is required'),
        divisionName: Yup.string().required('Division name is required'),
        departmentName: Yup.string().required('Department name is required'),
        contractor: Yup.string().required('contractor name is required'),
        firstName: Yup.string().required('First name is required'),
        middleName: Yup.string().required('Middle name is required'),
        lastName: Yup.string().required('Last name is required'),
        contactNo: Yup.string().matches(/^(\d{10})?$/, 'Invalid Phone number').required('Phone number is required'),
        email_id: Yup.string().required('Email is required').email('Email must be a valid email address'),
        birthdate: Yup.string().required('Birthdate is required'),
        // licenseNo: Yup.string().matches(/^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/, 'Invalid License number').required('License number is required'),
        licenseNo: Yup.string().required('License number is required'),
        // matches(/^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/, 'Invalid License number')
        licenseExpiryDate: Yup.string().required('License Expiry date is required'),
        joinDate: Yup.string().required('join date is required'),
        releaveDate: Yup.string().required('Releave date is required'),
        address: Yup.string().matches(/^(.{20,})$/, 'Address must have atleast 20 characters').required('Address is required'),
        // address2: Yup.string().matches(/^.{20,}$/,'Address must have atleast 20 characters').required('Address is required'),
        city: Yup.string().required('City name is required'),
        pincode: Yup.string().matches(/^.{6,}$/, 'Invalid pincode').required('Pincode is required'),
        state: Yup.string().required('State name is required'),
        // district: Yup.string().required('District is required'),
        emergencyContactName: Yup.string().required('Emergency contact  name is required'),
        emergencyContactNo: Yup.string().matches(/^(\d{10})?$/, 'Invalid Conatct number').required('Emergency contact number is required'),
  });

  const defaultValues = useMemo(
    () => ({
        companyName: currentUser?.companyName || '',
        divisionName: currentUser?.divisionName || '',
        departmentName: currentUser?.departmentName || '',
        contractor: currentUser?.contractor || '',
        firstName: currentUser?.firstName || '',
        middleName: currentUser?.middleName || '',
        lastName: currentUser?.lastName || '',
        email_id: currentUser?.email_id || '',
        contactNo: currentUser?.contactNo || '',
        address: currentUser?.address || '',
        birthdate: currentUser?.birthdate || dayjs(Date.now()),
        licenseNo: currentUser?.licenseNo || '',
        licenseExpiryDate: currentUser?.licenseExpiryDate || '',
        joinDate: currentUser?.joinDate || '',
        releaveDate: currentUser?.releaveDate || '',
        emergencyContactName: currentUser?.emergencyContactName || '',
        emergencyContactNo: currentUser?.emergencyContactNo || '',
        city: currentUser?.city || '',
        pincode: currentUser?.pincode || '',
        state: currentUser?.state || '',
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
      console.log('here in getDivisions compnies: ', watchCompanyName, companies);
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

      console.log('here in division divisions: ', generetedData);
      setDivisions(generetedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // console.log("useEffect called company name");
    getDivisions();
  }, [watchCompanyName]);
  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
    }

  const getDepartments = async () => {
    try {
      console.log('here in department div : ', watchDivisionName, divisions);
      const division_id = divisions.filter((c) => {
        if (c?.label === watchDivisionName) {
          return true;
        } else {
          return false;
        }
      })[0].value;

      console.log('in department', division_id);

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
  };

  useEffect(() => {
    console.log('useEffect called company name');
    getDepartments();
  }, [watchDivisionName]);

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
      console.log('------------', company_id, division_id);
      if (d?.label === data?.departmentName) {
        return true;
      } else {
        return false;
      }
    })[0].value;

    try {
      const URL = `http://localhost:5000/api/v1/driver/${itemMasterId}`;

      const res = await axios.post(URL, {
        company: company_id,
        division: division_id,
        department: department_id,
        contractor: data.contractor,
        first_name: data.firstName,
        middle_name: data.middleName,
        last_name: data.lastName,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        state: data.state,
        phone_no: data.contactNo,
        email_id: data.email_id,
        emergancy_contact_person: data.emergencyContactName,
        emergancy_contact_no: data.emergencyContactNo,
        birth_date: formatDate(data.birthdate),
        join_date: formatDate(data.joinDate),
        license_no: data.licenseNo,
        license_exp_date: formatDate(data.licenseExpiryDate),
        releave_date: formatDate(data.releaveDate),
      });
      toggleAddDepartmentFlag();
      reset();
      setDone(true);
    } catch (err) {
      console.log(err);
    }
  });

  const getSpecificVendor = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/driver/${itemMasterId}`;

      const res = await axios.get(URL);
      console.log('specific vendor ', res);

      setValue('companyName', res.data.data.company.company_name, { shouldValidate: true });
      setValue('divisionName', res.data.data.division.division_name, { shouldValidate: true });
      setValue('departmentName', res.data.data.department.department_name, {
        shouldValidate: true,
      });
      setValue('contractor', res.data.data.contractor, { shouldValidate: true });
      setValue('firstName', res.data.data.first_name, { shouldValidate: true });
      setValue('middleName', res.data.data.middle_name, { shouldValidate: true });
      setValue('lastName', res.data.data.last_name, { shouldValidate: true });
      setValue('address', res.data.data.address, { shouldValidate: true });
      setValue('city', res.data.data.city, { shouldValidate: true });
      setValue('email_id', res.data.data.email_id, { shouldValidate: true });
      setValue('pincode', res.data.data.pincode, { shouldValidate: true });
      setValue('state', res.data.data.state, { shouldValidate: true });
      setValue('contactNo', res.data.data.phone_no, { shouldValidate: true });
      setValue('emergencyContactName', res.data.data.emergancy_contact_person, { shouldValidate: true });
      setValue('emergencyContactNo', res.data.data.emergancy_contact_no, { shouldValidate: true });
      setValue('licenseNo', res.data.data.license_no, { shouldValidate: true });
      setValue('birthdate', dayjs(res.data.data.birth_date) , { shouldValidate: true });
      setValue('joinDate', dayjs(res.data.data.join_date), { shouldValidate: true });
      setValue('licenseExpiryDate', dayjs(res.data.data.license_exp_date), { shouldValidate: true });
      setValue('releaveDate', dayjs(res.data.data.releave_date), { shouldValidate: true });
      setValue('district', dayjs(res.data.data.district), { shouldValidate: true });

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
    getSpecificVendor();
  }, []);

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
              <RHFAutocomplete
                                name="contractor"
                                label="Contractor *"
                                options={contractors.map((contractorName) => contractorName.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = contractors.filter(
                                        (contractorName) => contractorName.label === option
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
                            <RHFTextField name="firstName" label="First Name *" />
                            <RHFTextField name="middleName" label="Middle Name *" />
                            <RHFTextField name="lastName" label="Last Name *" />
                            <RHFTextField name="contactNo" label="Contact Number *" />
                            <RHFTextField name="email_id" label="Email *" />
                            <Controller
                                name="birthdate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="BirthDate*"
                                        value={field.value}
                                        onChange={(newValue) => {
                                            field.onChange(newValue);
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!error,
                                                helperText: error?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                            <RHFTextField name="licenseNo" label="License Number *" />
                            <Controller
                                name="licenseExpiryDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="License Expiry Date*"
                                        value={field.value}
                                        onChange={(newValue) => {
                                            field.onChange(newValue);
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!error,
                                                helperText: error?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="joinDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Join Date*"
                                        value={field.value}
                                        onChange={(newValue) => {
                                            field.onChange(newValue);
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!error,
                                                helperText: error?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="releaveDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Releave Date*"
                                        value={field.value}
                                        onChange={(newValue) => {
                                            field.onChange(newValue);
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!error,
                                                helperText: error?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                            <RHFTextField name="address" label="Address *" multiline rows={4} />
                            <RHFTextField name="city" label="City *" />
                            <RHFTextField name="pincode" label="Pincode *" />
                            <RHFTextField name="state" label="State *" />
                            <RHFTextField name="emergencyContactName" label="Emergency Contact Name *" />
                            <RHFTextField name="emergencyContactNo" label="Emergency Contact Number *" />
            </Box>
            {done && (
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                <strong>Vendor has been registered!</strong>
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

EditDriverForm.propTypes = {
  currentUser: PropTypes.object,
};
