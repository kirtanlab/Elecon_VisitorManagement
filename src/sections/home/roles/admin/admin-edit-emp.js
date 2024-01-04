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
import Grid from '@mui/material/Unstable_Grid2';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { useRouter } from 'src/routes/hooks';
// assets
import { roles } from 'src/assets/data/roles';
// components
import axios from 'axios';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { useVisitorContext } from 'src/context/visitor_context';


// ----------------------------------------------------------------------
// eslint-disable-next-line react/jsx-no-constructed-context-values
export default function EditEmpView({ currentUser }) {
  const router = useRouter();

  const [done, setDone] = useState(false);

  const [hods, setHods] = useState([]);

  const [companies, setCompanies] = useState([]);

  const [divisions, setDivisions] = useState([]);

  const [departments, setDepartments] = useState([]);

  const {empId} = useVisitorContext();

  const NewUserSchema = Yup.object().shape({
    emp_id: Yup.string().required('Name is required'),
    companyName: Yup.string().required('Company name is required'),
    divisionName: Yup.string().required('Division name is required'),
    departmentName: Yup.string().required('Department name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string(),
    username: Yup.string().required('username is required'),
    role: Yup.string().required('Role is required'),
    gate_name: Yup.string(),
    // company_name: Yup.string(),
    // hod_id: Yup.string(),
    // hod_emp_id: Yup.string(),
    password: Yup.string(),
    // password: Yup.string(),
    hod: Yup.string(),
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
        hod: currentUser?.hod || '',
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

  const watchCompanyName = watch("companyName")
  const watchDivisionName = watch("divisionName")

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
        alert("something went wrong")
        console.log(err);
    }

}

    useEffect(() => {
        getCompanies();
    }, [])

const getDivisions = async () => {
    try {

        console.log("here in getDivisions compnies: ", watchCompanyName, companies);
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

        console.log("here in division divisions: ", generetedData)
        setDivisions(generetedData);
    }
    catch (err) {
        console.log(err);
    }

}

    useEffect(() => {
    // console.log("useEffect called company name");
    console.log("useEffect called for divisons")
    getDivisions();
    }, [watchCompanyName])

    const getDepartments = async() => {
        try{
            console.log("here in department div : ", watchDivisionName, divisions);
            const division_id = divisions.filter((c) => {
                if(c?.label === watchDivisionName){
                    return true;
                }
                else{
                    return false
                }
            })[0].value;

            console.log('in department',division_id);

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


    useEffect(() => {
        console.log("useEffect called for departments")
        getDepartments();
    }, [watchDivisionName])


  const onSubmit = handleSubmit(async (data) => {
    try {
        console.log("here in onsubmit ", data.hod);
        
        const {value: final_hod_id} = hods.filter((hod) => {
          return hod.label === data.hod;
        })[0]
        console.log("seconddd");
        const company_id = companies.filter((c) => {
          if(c?.label === data?.companyName){
              return true;
          }
          else{
              return false;
          }
      })[0]?.value
      console.log("third");
      const division_id = divisions.filter((d) => {
          if (d?.label === data?.divisionName) {
              return true;
          }
          else {
              return false;
          }

      })[0]?.value;
      console.log("4444");

      const department_id = departments.filter((d) => {
          console.log('------------',company_id, division_id);
          if (d?.label === data?.departmentName) {
              return true;
          }
          else {
              return false;
          }

      })[0]?.value;
      console.log("5555");

      console.log("got got got ", )

        console.log("final hod id", final_hod_id);
        const URL = `http://localhost:5000/api/v1/admin/updateEmployee/${empId}`
        const employee = await axios.post(URL, {
            emp_id: data.emp_id,
            company: company_id,
            division: division_id,
            department: department_id,
            "emp_name": data.username,
            "email": data.email,
            "role": data.role,
            "gate_name": data.gate_name,
            "password": data.password,
            "phoneNumber": data.phoneNumber,
            "hod_id": final_hod_id,
        })
        console.log("after calling API");
        console.log(employee);
        setDone(true);
        reset();
        
    } catch (error) {
      console.log("cant be : ", error);
      alert("something went wrong")
    }
    
  });

  const getSpecificEmp = async() => {
    try{
        
        const res = await axios.get(`http://localhost:5000/api/v1/employee/getAllHOD`);
        let generatedHODS = res?.data?.data?.map((got) => {
          return {label: got.emp_name, value: got._id}
        })

        generatedHODS.unshift({label: "Select HOD", value: ""});
        console.log("generated HODS", generatedHODS);
        setHods(generatedHODS);
        const URL = `http://localhost:5000/api/v1/employee/${empId}`
        const emp = await axios.get(URL);
        console.log("specific emp maliyo : ", emp?.data?.data);
        // console.log("specific hod ", hods);
        console.log("what is name of hod : ",emp?.data?.data.hod_id?.emp_name);
        console.log("genereted tttt", generatedHODS[2]);
        let emp_name = "";
        if(emp?.data?.data.hod_id?.emp_name !== undefined){
          const tt = generatedHODS.filter((hod) => {
            return hod?.label === emp?.data?.data.hod_id?.emp_name
          })[0]
          emp_name = tt.label
        }
        
        

        // console.log("got filter is : ", testemp)
        // console.log("emp name here", emp_name);
        // const emp_name = temp[0].label ? temp[0].label : "";
        console.log("here emp name is is is is : ", emp_name)
        setValue("emp_id", emp.data.data.emp_id, { shouldValidate: true })
        setValue("companyName", emp.data.data.company.company_name, { shouldValidate: true })
        setValue("divisionName", emp.data.data.division.division_name, { shouldValidate: true })
        setValue("departmentName", emp.data.data.department.department_name, { shouldValidate: true })
        setValue("email", emp.data.data.email, { shouldValidate: true })
        setValue("username", emp.data.data.emp_name, { shouldValidate: true })
        setValue("phoneNumber", emp.data.data.phoneNumber, { shouldValidate: true })
        setValue("role", emp.data.data.role, { shouldValidate: true })
        setValue("gate_name", emp.data.data.gate_name, { shouldValidate: true })
        // setValue("hod_id", emp.data.data.hod_id, { shouldValidate: true })
        // setValue("hod_emp_id", emp.data.data.hod_emp_id, { shouldValidate: true })
        setValue("password", emp.data.data.password, { shouldValidate: true })
        setValue("hod", emp_name ? emp_name:"Select HOD", {shouldValidate: true})

        const c_name = emp.data.data.company.company_name;
        const di_name = emp.data.data.division.division_name

        const r = await axios.get("http://localhost:5000/api/v1/company/all/companies");

        
        let gotDivision = [];
        let gotDepartment = [];
        r?.data?.data.forEach((el) => {
            if(el.company_name === c_name){
                gotDivision = el.division.map((div) => {
                    return {label: div.division_name, value: div._id}
                })
            }
        })

        r?.data?.data.forEach((el) => {
            if(el.company_name === c_name){
                
                el.division.map((div) => {
                    if(div.division_name === di_name){
                        gotDepartment = div.department.map((dept) => {
                            return {label: dept.department_name, value: dept._id}
                        })

                    }
                })

            }
        })

        console.log("here in useeffect divisin", gotDivision)

        setDivisions(gotDivision);
        setDepartments(gotDepartment);



        // console.log("after setting default values");
    }
    catch(err){
      // console.log("alksdjaskdjha", err);
      console.log(err);
      alert("something went wrong here in")
    }
  }
  
  useEffect(() => { 
    // getAllHOD();
    getSpecificEmp()
  }, [])


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
              <RHFTextField name="emp_id" label="Emp ID"/>
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
              
              <RHFTextField name="email" label="Email Address"/>
              <RHFTextField name="username" label="username" />
              <RHFTextField name="phoneNumber" label="Phone Number" />

              <RHFAutocomplete
                name="role"
                label="role"
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
                name="hod"
                label="Select HOD"
                options={hods?.map((hod) => hod.label)}
                
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => {
                  // console.log("option and value");
                  // console.log(option, value)
                  console.log("hods hods hods", hods);
                  return option === value

                }}
                renderOption={(props, option) => {
                  console.log("here in render option");
                  const {label, value} = hods.filter(
                    (hod) => {
                      // console.log("when selected");
                      return hod.label === option
                    }
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
              
                {/* <Typography>{name}</Typography> */}
                
              <RHFTextField name="gate_name" label="gate name"/>
              {/* <RHFTextField name="hod_id" label="hod id" />
              <RHFTextField name="hod_emp_id" label="hod emp id" /> */}
              <RHFTextField name="password" label="password" />
            </Box>
            {
                done && <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Employee has been updated <strong>check it out!</strong>
              </Alert>
            }

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Save Changes' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

EditEmpView.propTypes = {
  currentUser: PropTypes.object,
};
