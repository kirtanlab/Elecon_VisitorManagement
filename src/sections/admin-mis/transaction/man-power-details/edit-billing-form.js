/* eslint-disable */
import PropTypes from 'prop-types';
import { useMemo, React, useState } from 'react';
import { useForm, useController, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// @mui
import { useEffect } from 'react';
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
import { RHFTextField, RHFEditor, RHFAutocomplete, RHFCheckbox } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';
import { useAdminMISContext } from 'src/context/admin_mis_context';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';
import label from 'src/components/label';

export default function EditManPowerDetailsForm({ currentUser }) {

    const settings = useSettingsContext();

    const { user } = useAuthContext();

    const { toggleAddDepartmentFlag } = useAdminMISContext();

    const [done, setDone] = useState(false);

    const [companies, setCompanies] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [vendors, setVendors] = useState([]);

    const [isSgstChecked, setIsSgstChecked] = useState(true);
    const [isCgstChecked, setIsCgstChecked] = useState(true);
    const [isIgstChecked, setIsIgstChecked] = useState(true);

    const ManPowerDetailsSchema = Yup.object().shape({

        companyName: Yup.string().required('Company name is required'),
        divisionName: Yup.string().required('division name is required'),
        departmentName: Yup.string().required('department name is required'),
        contracterName: Yup.string().required('Contracter name is required'),
        workType: Yup.string().required('Work type is required'),
        monthAndYear: Yup.string().required('Month and year are required'),

        // bill details 

        location: Yup.string().required('Location name is required'),
        totalEmployees: Yup.number().required('Total number of employees are required'),
        billNo: Yup.string().required('Bill number is required'),
        billAmount: Yup.number().required('Bill amount is required'),
        billDate: Yup.string().required('Bill date is required'),
        sgst: Yup.string(),
        cgst: Yup.string(),
        igst: Yup.string(),
        sgstValue: Yup.number(),
        cgstValue: Yup.number(),
        igstValue: Yup.number(),
        totalAmount: Yup.number().required('Total amount is required'),
       
    });

    const defaultValues = useMemo(
        () => ({
            companyName: currentUser?.companyName || '',
            divisionName: currentUser?.companyName || '',
            departmentName: currentUser?.companyName || '',
            contracterName: currentUser?.contracterName || '',
            workType: currentUser?.workType || '',
            monthAndYear: currentUser?.monthAndYear || '',

            // bill details 


            location: currentUser?.location || '',
            totalEmployees: currentUser?.totalEmployees || '',
            billNo: currentUser?.billNo || '',
            billAmount: currentUser?.billAmount || '',
            monthAndYear: currentUser?.monthAndYear || '',
            billDate: currentUser?.billDate || '',
            sgst: currentUser?.sgst || '',
            cgst: currentUser?.cgst || '',
            igst: currentUser?.igst || '',
            sgstValue: currentUser?.sgstValue || 0,
            cgstValue: currentUser?.cgstValue || 0,
            igstValue: currentUser?.igstValue || 0,
            totalAmount: currentUser?.totalAmount || '',
            
        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(ManPowerDetailsSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        register,
        formState: { isSubmitting },
    } = methods;

    const watchCompanyName = watch("companyName")
    const watchDivisionName = watch("divisionName")
    const watchSGST = watch("sgst");
    const watchCGST = watch("cgst");
    const watchIGST = watch("igst");






    useEffect(() => {
        setIsSgstChecked(!watchSGST);
    }, [watchSGST])
    useEffect(() => {
        setIsCgstChecked(!watchCGST)
    }, [watchCGST])
    useEffect(() => {
        setIsIgstChecked(!watchIGST)
    }, [watchIGST])

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

    const getWorkTypes = async() => {
        try{
            const URL = "http://localhost:5000/api/v1/workType/getAll"
            const res = await axios.get(URL);
            const generetedData = res?.data?.data.map((el) => {
                return { label: el.work_type, value: el._id }
            })

            setWorkTypes(generetedData)

        }
        catch(err){
            alert("something went wrong in get all worktypes");
            console.log(err);
        }
    }


    const getVendors = async() => {
        try{
            const URL = "http://localhost:5000/api/v1/vendor/getAll"
            const res = await axios.get(URL);
            const generetedData = res?.data?.data.map((el) => {
                return { label: el.name, value: el._id }
            })

            
            setVendors(generetedData);
        }   
        catch(err){
            alert("something went wrong in get all vendors");
            console.log(err);
        }
    }

    const getLocations = async() => {
        try{    
            const URL = "http://localhost:5000/api/v1/location/getAll"
            const res = await axios.get(URL)
            const generetedData = res?.data?.data.map((el) => {
                return { label: el.location_name, value: el._id }
            })

            setLocations(generetedData)

        }
        catch(err){
            alert("something went wrong in get locations");
            console.log(err);
        }

    }
 
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


    const getDepartments = async () => {
        try {
            try {

                // console.log("here in getDivisions : ", watchCompanyName, companies);
                const division_id = divisions.filter((c) => {
                    if (c?.label === watchDivisionName) {
                        return true;
                    }
                    else {
                        return false
                    }
                })[0].value;

                console.log(division_id);

                const URL = `http://localhost:5000/api/v1/division/getDepartmentByDivision/${division_id}`;
                const res = await axios.get(URL);
                const generetedData = res?.data?.data?.department.map((el) => {
                    return { label: el.department_name, value: el._id }
                })

                // console.log("here in division : ", generetedData)
                setDepartments(generetedData);
            }
            catch (err) {
                console.log(err);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        // console.log("useEffect called company name");
        getDepartments();
    }, [watchDivisionName])

    const onSubmit = handleSubmit(async (data) => {

        
        const company_id = companies.filter((c) => {
            if (c?.label === data?.companyName) {
                return true;
            }
            else {
                return false;
            }
        })[0].value
        const division_id = divisions.filter((d) => {
            if (d?.label === data?.divisionName) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;

        const department_id = departments.filter((d) => {
            if (d?.label === data?.departmentName) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;

        const workType_id = workTypes.filter((d) => {
            if (d?.label === data?.workType) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;

        const location_id = locations.filter((d) => {
            if (d?.label === data?.location) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;

        const contracter_id = vendors.filter((d) => {
            if (d?.label === data?.contracterName) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;




        try {
            const URL = `http://localhost:5000/api/v1/bill/manPower`
            const res = await axios.post(URL, {
                company: company_id,
                division: division_id,
                department: department_id,
                work_type: workType_id,
                location: location_id,
                contractor: contracter_id,
                month_year: data.monthAndYear,
                no_of_employee: data.totalEmployees,
                bill_no: data.billNo,
                bill_date: data.billDate,
                bill_amount: data.billAmount,
                sgst: data.sgstValue,
                cgst: data.cgstValue,
                igst: data.igstValue,
                total_amount: data.totalAmount
                

            })
            toggleAddDepartmentFlag();
            reset();
            setDone(true);
        }
        catch (err) {
            console.log(err);
        }

    });



    useEffect(() => {
        getCompanies();
        getWorkTypes();
        getLocations();
        getVendors();
    }, [])

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>

            <Grid container spacing={2}>
                <Grid xs={12} md={1}>
                </Grid>

                <Grid container xs={12} md={10} sx={{ marginTop: 5, }} justifyContent={'center'}>
                    <Card sx={{ p: 3, width: '80%', }}>
                        {/* <Typography variant="h4">Sub Department Master</Typography> */}
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
                                        (companyName) => companyName.label === option
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
                            <RHFAutocomplete
                                name="contracterName"
                                label="Contracter Name *"
                                options={vendors.map((contracterName) => contracterName.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = vendors.filter(
                                        (contracterName) => contracterName.label === option
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
                                name="workType"
                                label="Work Type *"
                                options={workTypes.map((workType) => workType.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = workTypes.filter(
                                        (workType) => workType.label === option
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
                            <Controller
                                name="monthAndYear"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Month & Year *"
                                        views={['year', 'month']}
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

                            <RHFAutocomplete
                                name="location"
                                label="location *"
                                options={locations.map((location) => location.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = locations.filter(
                                        (location) => location.label === option
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
                            
                            <RHFTextField name="totalEmployees" label="Number of employees *" />
                        
                            <Controller
                                name="billDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Bill Date *"
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
                            <RHFTextField name="billNo" label="Bill Number *" />
                            <RHFTextField name="billAmount" label="Bill Amount *" />
                            <RHFCheckbox name="sgst" label="SGST" />
                            {!isSgstChecked && <RHFTextField name="sgstValue" label="SGST Value" />}
                            <RHFCheckbox name="cgst" label="CGST" />
                            {!isCgstChecked && <RHFTextField name="cgstValue" label="CGST Value" />}
                            <RHFCheckbox name="igst" label="IGST" />
                            {!isIgstChecked && <RHFTextField name="igstValue" label="IGST Value" />}
                            <RHFTextField name="totalAmount" label="Total Amount *" />


                        </Box>
                        {
                            done && <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                <strong>Man Power details has been saved!</strong>
                            </Alert>
                        }

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? 'Add Man Power Details' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

EditManPowerDetailsForm.propTypes = {
    currentUser: PropTypes.object,
};