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

export default function DepartmentForm({ currentUser }) {

    const settings = useSettingsContext();

    const {toggleAddDepartmentFlag} = useAdminMISContext();

    const { user } = useAuthContext();

    const [done, setDone] = useState(false);

    

    const [companies, setCompanies] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [hods, setHods] = useState([]);

    const DepartmentSchema = Yup.object().shape({
        companyName: Yup.string().required('Company name is required'),
        divisionName: Yup.string().required('Division name is required'),
        departmentName: Yup.string().required('Department name is required'),
        hodName: Yup.string().required('HOD name is required'),
    });

    const defaultValues = useMemo(
        () => ({
            companyName: currentUser?.companyName || '',
            divisionName: currentUser?.divisionName || '',
            departmentName: currentUser?.departmentName || '',
            hodName: currentUser?.hodName || '',
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
        formState: { isSubmitting, isDirty},
    } = methods;

    const watchCompanyName = watch("companyName")
    const getAllHods = async() => {
        try{
            const URL = `http://localhost:5000/api/v1/employee/getAllHOD`
            const res = await axios.get(URL);
            console.log("here in create employee ", res.data.data);
            let generatedHODS = res?.data?.data?.map((got) => {
                return {label: got.emp_name, value: got._id}
            }) 
            setHods(generatedHODS);

            console.log("after setting state");
        }
        catch(err){
            console.log(err);
        }
    }

    const getCompanies = async() => {
        try{
            const URL = `http://localhost:5000/api/v1/company/getAll`
            const res = await axios.get(URL);
            const generetedData = res?.data?.data.map((el) => {
                return {label: el.company_name, value: el._id}
            })

            setCompanies(generetedData);
        }
        catch(err){
            alert("something went wrong")
            console.log(err);   
        }

    }

    useEffect(() => {
        getCompanies();
        getAllHods();
    }, [])

    // const divisions = [
    //     { label: "Admin" },
    //     { label: "Civil" },
    //     { label: "Security" },
    // ]



    const getDivisions = async() => {
        try{

            console.log("here in getDivisions : ", watchCompanyName, companies);
            const company_id = companies.filter((c) => {
                if(c?.label === watchCompanyName){
                    return true;
                }
                else{
                    return false
                }
            })[0].value;

            console.log(company_id);

            const URL = `http://localhost:5000/api/v1/company/getDivisionByCompany/${company_id}`;
            const res = await axios.get(URL);
            const generetedData = res?.data?.data?.division.map((el) => {
                return {label: el.division_name, value: el._id}
            })

            console.log("here in division : ", generetedData)
            setDivisions(generetedData);    
        }
        catch(err){
            console.log(err);
        }

    }

    useEffect(() => {
        // console.log("useEffect called company name");
        getDivisions();
    }, [watchCompanyName])


    const onSubmit = handleSubmit(async (data) => {

        const division_id = divisions.filter((d) => {
            if(d?.label === data?.divisionName){
                return true;
            }
            else{
                return false;
            }

        })[0].value;

        try{    
            const URL = `http://localhost:5000/api/v1/department`
            const res = await axios.post(URL, {
                "department_name": data.departmentName,
                "subdepartmentId": "",
                division_id
            })
            toggleAddDepartmentFlag();
            reset();
            setDone(true);
        }
        catch(err){
            console.log(err);
        }

    });


    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>

            <Grid container spacing={2}>
                <Grid xs={12} md={1}>
                </Grid>

                <Grid container xs={12} md={10} sx={{ marginTop: 5, }} justifyContent={'center'}>
                    <Card sx={{ p: 3, width: '80%', }}>
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
                            <RHFTextField name="departmentName" label="Department Name *" />
                            <RHFAutocomplete
                                name="hodName"
                                label="Select HOD *"
                                options={hods?.map((hod) => hod.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => {
                                console.log("option and value");
                                console.log(option, value)
                                return option === value

                                }}
                                renderOption={(props, option) => {
                                console.log("here in render option");
                                const {label, value} = hods?.filter(
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

                        </Box>
                        {
                            done && <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                <strong>Department name has been saved!</strong>
                            </Alert>
                        }

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? 'Add Department' : 'Save Changes'}
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