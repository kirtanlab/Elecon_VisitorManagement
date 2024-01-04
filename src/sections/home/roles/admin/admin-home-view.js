/* eslint-disable */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, AlertTitle} from '@mui/lab';
// import { AlertTitle } from '@mui/lab';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// assets
import { countries } from 'src/assets/data';
import { roles } from 'src/assets/data/roles';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import axios from 'axios';


// ----------------------------------------------------------------------
// eslint-disable-next-line react/jsx-no-constructed-context-values
export default function HomeView({ currentUser }) {
  const router = useRouter();

  const [done, setDone] = useState(false);
  const [hods, setHods] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isRoleHod, setIsRoleHod] = useState(false);

  const NewUserSchema = Yup.object().shape({
    
    emp_id: Yup.string().matches(/^(\d*)$/,'Id should contain only numbers').required('Employee id is required'),
    companyName: Yup.string(),
    divisionName: Yup.string(),
    departmentName: Yup.string(),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required').min(6,'Password must be of minimum 6 char'),
    role: Yup.string().required('Role is required'),
    phoneNumber: Yup.string().nullable().matches(/^(\d{10})?$/,'Invalid Phone number'),
    // company_name: Yup.string(),
    // hod_id: Yup.string().nullable().matches(/^(\d*)?$/,'Id should contain only numbers'),
    // hod_emp_id: Yup.string().nullable().matches(/^(\d*)?$/,'Id should contain only numbers'),
    gate_name: Yup.string(),
    // hod: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
        emp_id: currentUser?.emp_id || '',
        companyName: currentUser?.companyName || '',
        divisionName: currentUser?.divisionName || '',
        departmentName: currentUser?.departmentName || '',
        email: currentUser?.email || '',
        phoneNumber: currentUser?.phoneNumber || '',
        username: currentUser?.username || '',
        role: currentUser?.role || '',
        gate_name: currentUser?.gate_name || '',
        // company_name: currentUser?.company_name || '',
        // hod_id: currentUser?.hod_id || '',
        // hod_emp_id: currentUser?.hod_emp_id || '',
        password: currentUser?.password || '',
        // hod: currentUser?.hod || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    // control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

//   const values = watch();
    const watchCompanyName = watch("companyName")
    const watchDivisionName = watch("divisionName")
    const watchRole = watch("role");
    const getDepartments = async() => {
      try{
          try{

              // console.log("here in getDivisions : ", watchCompanyName, companies);
              const division_id = divisions.filter((c) => {
                  if(c?.label === watchDivisionName){
                      return true;
                  }
                  else{
                      return false
                  }
              })[0].value;
  
              console.log(division_id);
  
              const URL = `http://localhost:5000/api/v1/division/getDepartmentByDivision/${division_id}`;
              const res = await axios.get(URL);
              const generetedData = res?.data?.data?.department.map((el) => {
                  return {label: el.department_name, value: el._id}
              })
  
              // console.log("here in division : ", generetedData)
              setDepartments(generetedData);    
          }
          catch(err){
              console.log(err);
          }
      }
      catch(err){
          console.log(err);
      }
  }

  useEffect(() => {
      // console.log("useEffect called company name");
      getDepartments();
  }, [watchDivisionName])


  useEffect(() => {
    if(watchRole === "hod"){
      setIsRoleHod(true)
    }
    else{
      setIsRoleHod(false);
    }
  }, [watchRole])

  const getCompanies = async () => {
      try {
          const URL = `http://localhost:5000/api/v1/company/getAll`
          const res = await axios.get(URL);
          const generetedData = res?.data?.data.map((el) => {
              return { label: el.company_name, value: el._id }
          })

          setCompanies(generetedData);
      }
      catch (err) {
          alert("something went wrong companies")
          console.log(err);
      }

  }

  useEffect(() => {
      getCompanies();
  }, [])

  const getDivisions = async () => {
      try {

          console.log("here in getDivisions : ", watchCompanyName, companies);
          const company_id = companies.filter((c) => {
              if (c?.label === watchCompanyName) {
                  return true;
              }
              else {
                  return false
              }
          })[0].value;

          console.log(company_id);

          const URL = `http://localhost:5000/api/v1/company/getDivisionByCompany/${company_id}`;
          const res = await axios.get(URL);
          const generetedData = res?.data?.data?.division.map((el) => {
              return { label: el.division_name, value: el._id }
          })

          console.log("here in division : ", generetedData)
          setDivisions(generetedData);
      }
      catch (err) {
          console.log(err);
      }

  }

  useEffect(() => {
      // console.log("useEffect called company name");
      getDivisions();
  }, [watchCompanyName])

  const onSubmit = handleSubmit(async (data) => {
    try {
      // const {value:final_hod_id} = hods.filter((hod) => {
      //   return hod.label === data.hod;
      // })[0];
      const company_id = companies.filter((c) => {
        if(c?.label === data?.companyName){
            return true;
        }
        else{
            return false;
        }
    })[0]?.value
    const division_id = divisions.filter((d) => {
        if (d?.label === data?.divisionName) {
            return true;
        }
        else {
            return false;
        }

    })[0]?.value;

    const department_id = departments.filter((d) => {
        if (d?.label === data?.departmentName) {
            return true;
        }
        else {
            return false;
        }

    })[0]?.value;

      console.log("emp id id id id id id id", data.emp_id);
        console.log("here in onsubmit ", data);
        const employee = await axios.post("http://localhost:5000/api/v1/admin/createEmployee", {
            "emp_id": data.emp_id,
            "emp_name": data.username,
            "role": data.role,
            "gate_name": data.gate_name,
            "password": data.password,
            "email": data.email,
            "phoneNumber": data.phoneNumber,
            // "hod_id": final_hod_id ? final_hod_id : "",
            company: company_id,
            division: division_id,
            department: department_id
        })
        console.log("after calling API");
        console.log(employee);
        setDone(true);
        reset();

    } catch (error) {
      alert("something went wrong here in form")
      console.log(error);
    }
   
    
  });

  // const getAllHODs = async() => {
  //   try{  
  //     const URL = `http://localhost:5000/api/v1/employee/getAllHOD`
  //     const res = await axios.get(URL);
  //     console.log("here in create employee ", res.data.data);
  //     let generatedHODS = res?.data?.data?.map((got) => {
  //       return {label: got.emp_name, value: got._id}
  //     }) 
  //     generatedHODS.unshift({label: "Select HOD", value: ""})
  //     setHods(generatedHODS);

  //     console.log("after setting state");
  //   }
  //   catch(err){
  //     console.log(err);
  //   }
  // }

  // useEffect(() => {
  //   getAllHODs()
  // }, [])

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
        
      <Grid container spacing={2}>
        <Grid xs={12} md={1}>
        </Grid>

        <Grid xs={12} md={10}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="emp_id" label="Emplyee id *" />
              <RHFAutocomplete
                name="role"
                label="Role *"
                required
                options={roles.map((role) => role.label)}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const {label} = roles.filter(
                    (role) => role.label === option
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      {/* <Iconify
                        key={label}
                        icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      /> */}
                      {label}
                    </li>
                  );
                }}
              />
              <RHFAutocomplete
                                name="companyName"
                                label="Company Name *"
                                options={companies.map((companyName) => companyName.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = companies.filter(
                                        (companyName) => {
                                           return companyName.label === option
                                        }
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
                            {
                              !isRoleHod &&
                            
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
                              }
              {/* <RHFTextField name="emp_id" label="Emplyee id *" /> */}
              <RHFTextField name="email" label="Email Address *" />
              <RHFTextField name="username" label="User name *" />
              <RHFTextField name="password" label=" Set Password *" />

              

            

              <RHFTextField name="phoneNumber" label="Phone Number" />
              {/* <RHFTextField name="company_name" label="Company name" /> */}
              {/* <RHFTextField name="hod_id" label="Hod id" />
              <RHFTextField name="hod_emp_id" label="Hod employee id" /> */}
              <RHFTextField name="gate_name" label="Gate name"/>
            </Box>
            {
                done && <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Employee has been created <strong>check it out!</strong>
              </Alert>
            }

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create Employee' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

HomeView.propTypes = {
  currentUser: PropTypes.object,
};
