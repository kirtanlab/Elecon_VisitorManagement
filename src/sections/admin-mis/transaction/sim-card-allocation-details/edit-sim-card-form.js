/* eslint-disable */
import PropTypes from 'prop-types';
import { useMemo, React, useState } from 'react';
import { useForm, useController, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
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
import { RHFTextField, RHFEditor, RHFAutocomplete } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';
import { useAdminMISContext } from 'src/context/admin_mis_context';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';
import label from 'src/components/label';
import { toDate } from 'date-fns';

export default function EditSimCardAllocationForm({ currentUser }) {

    const settings = useSettingsContext();

    const { user } = useAuthContext();

    const { toggleAddDepartmentFlag, itemMasterId} = useAdminMISContext();

    const [done, setDone] = useState(false);

    const [companies, setCompanies] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [emps, setEmps] = useState([]);
    const [allEmps, setAllEmps] = useState([]);
    const [sps, setSps] = useState([
        {label: "Airtel", id: 1},
        {label: "Jio", id: 2},
        {label: "VI", id: 3},
        {label: "BSNL", id: 4},
        
    ])

    const BillingDetailsSchema = Yup.object().shape({

        // companyName: Yup.string().required('Company name is required'),
        // divisionName: Yup.string().required('Division name is required'),
        // departmentName: Yup.string().required('Department name is required'),
        // employeeName: Yup.string().required('Employee Name is required'),
        serviceProvider: Yup.string().required('Service Provider name is required'),
        tariffPlanNo: Yup.string().required('Tariff Plan number is required'),
        // monthlyLimit: Yup.string().required('Monthly limit is required'),
        simCardNo: Yup.string().matches(/^(\d{10})?$/, 'Invalid Sim card number').required('Sim card number is required'),
        dataCardNo: Yup.string().matches(/^(\d{10})?$/, 'Invalid Data card number').required('Data card number is required'),
        requisitionDate: Yup.string().required('Requisition date for sim card is required'),
        issueDateOfSimCard: Yup.string().required('Issue date of sim card is required'),
        issueDateOfDataCard: Yup.string().required('Issue date of Data card is required'),
        amount: Yup.number().required('Issue date of Data card is required'),
        // approvedBy: Yup.string().required('Approved By Name is required'),
    });

    const defaultValues = useMemo(
        () => ({
            // companyName: currentUser?.companyName || '',
            // divisionName: currentUser?.divisionName || '',
            // departmentName: currentUser?.departmentName || '',
            // employeeName: currentUser?.employeeName || '',
            serviceProvider: currentUser?.serviceProvider || '',
            tariffPlanNo: currentUser?.tariffPlanNo || '',
            // monthlyLimit: currentUser?.monthlyLimit || '',
            simCardNo: currentUser?.simCardNo || '',
            dataCardNo: currentUser?.simCardNo || '',
            requisitionDate: currentUser?.requisitionDate || dayjs(Date.now()),
            issueDateOfSimCard: currentUser?.issueDateOfSimCard || '',
            issueDateOfDataCard: currentUser?.issueDateOfDataCard || '',
            amount: currentUser?.amount || '',
            // approvedBy: currentUser?.approvedBy || '',
        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(BillingDetailsSchema),
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

    // const watchCompanyName = watch("companyName")
    // const watchDivisionName = watch("divisionName")
    // const watchDepartmentName = watch("departmentName")

    

    // const getCompanies = async () => {
    //     try {
    //         const URL = `http://localhost:5000/api/v1/company/getAll`
    //         const res = await axios.get(URL);
    //         const generetedData = res?.data?.data.map((el) => {
    //             return { label: el.company_name, value: el._id }
    //         })

    //         setCompanies(generetedData);
    //     }
    //     catch (err) {
    //         alert("something went wrong")
    //         console.log(err);
    //     }

    // }

    // const getAllEmps = async() => {
    //     try{
    //         const res = await axios.get("http://localhost:5000/api/v1/employee/getAll");
    //         const generetedData = res?.data?.data.map((el) => {
    //             return { label: el.emp_name, value: el._id }
    //         })

    //         setAllEmps(generetedData);

    //     }
    //     catch(err){
    //         alert("error in get all emps");
    //         console.log(err);
    //     }
    // }

    // const getDivisions = async () => {
    //     try {

    //         console.log("here in getDivisions : ", watchCompanyName, companies);
    //         const company_id = companies.filter((c) => {
    //             if (c?.label === watchCompanyName) {
    //                 return true;
    //             }
    //             else {
    //                 return false
    //             }
    //         })[0]?.value;

    //         console.log(company_id);

    //         const URL = `http://localhost:5000/api/v1/company/getDivisionByCompany/${company_id}`;
    //         const res = await axios.get(URL);
    //         const generetedData = res?.data?.data?.division.map((el) => {
    //             return { label: el.division_name, value: el._id }
    //         })

    //         console.log("here in division : ", generetedData)
    //         setValue('divisionName', generetedData[0]?.label, { shouldValidate: true });
    //         setDivisions(generetedData);
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }

    // }

    // useEffect(() => {
    //     // console.log("useEffect called company name");
    //     getDivisions();
    //     getDepartments();
    // }, [watchCompanyName])


    // const getDepartments = async () => {
    //     try {
    //         try {

    //             // console.log("here in getDivisions : ", watchCompanyName, companies);
    //             const division_id = divisions.filter((c) => {
    //                 if (c?.label === watchDivisionName) {
    //                     return true;
    //                 }
    //                 else {
    //                     return false
    //                 }
    //             })[0]?.value;

    //             console.log(division_id);

    //             const URL = `http://localhost:5000/api/v1/division/getDepartmentByDivision/${division_id}`;
    //             const res = await axios.get(URL);
    //             const generetedData = res?.data?.data?.department.map((el) => {
    //                 return { label: el.department_name, value: el._id }
    //             })

    //             // console.log("here in division : ", generetedData)
    //             setValue('departmentName', generetedData[0]?.label, { shouldValidate: true });
    //             setDepartments(generetedData);
    //         }
    //         catch (err) {
    //             console.log(err);
    //         }
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // }

    // useEffect(() => {
    //     // console.log("useEffect called company name");
    //     getDepartments();
    // }, [watchDivisionName])

    // useEffect(() => {
    //     getEmployees()
    // }, [])


    // const getEmployees = async() => {
    //     try{
    //         console.log("here here her")
    //         console.log(companies)
    //         console.log(divisions)
    //         console.log(departments)
    //         const company_id = companies.filter((c) => {
    //             if (c?.label === watchCompanyName) {
    //                 return true;
    //             }
    //             else {
    //                 return false;
    //             }
    //         })[0]?.value
    //         const division_id = divisions.filter((d) => {
    //             if (d?.label === watchDivisionName) {
    //                 return true;
    //             }
    //             else {
    //                 return false;
    //             }
    
    //         })[0]?.value;
    
    //         const department_id = departments.filter((d) => {
    //             if (d?.label === watchDepartmentName) {
    //                 return true;
    //             }
    //             else {
    //                 return false;
    //             }
    
    //         })[0]?.value;

    //         console.log("company idddd", company_id)
    //         console.log("division idddd", division_id)
    //         console.log("department idddd", department_id)
            
    //         const URL = `http://localhost:5000/api/v1/employee/cdd/getAll`
    //         const res = await axios.post(URL, {
    //             company: company_id,
    //             division: division_id,
    //             department: department_id
    //         });
    //         const generetedData = res?.data?.data.map((el) => {
    //             return { label: el.emp_name, value: el._id }
    //         })
    //         setValue('employeeName', generetedData[0]?.label, { shouldValidate: true });
    //         setEmps(generetedData);
    //     }
    //     catch(err){
    //         console.log(err);
    //     }
    // }

    // useEffect(() => {
    //     getEmployees();
    // }, [watchDepartmentName])

    const onSubmit = handleSubmit(async (data) => {

        // const company_id = companies.filter((c) => {
        //     if (c?.label === data?.companyName) {
        //         return true;
        //     }
        //     else {
        //         return false;
        //     }
        // })[0].value
        // const division_id = divisions.filter((d) => {
        //     if (d?.label === data?.divisionName) {
        //         return true;
        //     }
        //     else {
        //         return false;
        //     }

        // })[0].value;

        // const department_id = departments.filter((d) => {
        //     if (d?.label === data?.departmentName) {
        //         return true;
        //     }
        //     else {
        //         return false;
        //     }

        // })[0].value;
        // const emp_id = emps.filter((el) => {
        //     if (el?.label === data?.employeeName) {
        //         return true;
        //     }
        //     else {
        //         return false;
        //     }

        // })[0].value;

        // const approvedBy_id = allEmps.filter((el) => {
        //     if (el?.label === data?.approvedBy) {
        //         return true;
        //     }
        //     else {
        //         return false;
        //     }
        // })[0].value;

        

        try {
            const URL = `http://localhost:5000/api/v1/bill/simcard/${itemMasterId}`
            const res = await axios.post(URL, {

                service_provider: data.serviceProvider,
                requisition_date: data.requisitionDate,
                tarriff_plan_no: data.tariffPlanNo,
                mobile_no: data.simCardNo,
                data_card_no: data.dataCardNo,
                issue_date_simcard: data.issueDateOfSimCard,
                issue_date_datacard: data.issueDateOfDataCard,
                amount: data.amount,
            })
            toggleAddDepartmentFlag();
            reset();
            setDone(true);
        }
        catch (err) {
            console.log(err);
        }

    });

    const getSpecificSimCardBill = async() => {
        try {
            console.log('this is id', itemMasterId);
            const URL = `http://localhost:5000/api/v1/bill/simcard/${itemMasterId}`;
      
            const res = await axios.get(URL);
            // console.log('specific vendor ', res.data.data.company);
      
            // setValue('companyName', res.data.data.company, { shouldValidate: true });
            // setValue('divisionName', res.data.data.division, { shouldValidate: true });
            // setValue('departmentName', res.data.data.department, {
            //   shouldValidate: true,
            // });
            // setValue('employeeName', res.data.data.employee, { shouldValidate: true });
            setValue('serviceProvider', res.data.data.service_provider, { shouldValidate: true });
            setValue('tariffPlanNo', res.data.data.tarriff_plan_no, { shouldValidate: true });
            // setValue('monthlyLimit', res.data.data.address1, { shouldValidate: true });
            setValue('simCardNo', res.data.data.mobile_no, { shouldValidate: true });
            setValue('dataCardNo', res.data.data.data_card_no, { shouldValidate: true });
            setValue('requisitionDate', dayjs(res.data.data.requisition_date), { shouldValidate: true });
            setValue('issueDateOfSimCard', dayjs(res.data.data.issue_date_simcard), { shouldValidate: true });
            setValue('issueDateOfDataCard', dayjs(res.data.data.issue_date_datacard), { shouldValidate: true });
            setValue('amount', res.data.data.amount, { shouldValidate: true });
            // setValue('approvedBy', res.data.data.approved_by, { shouldValidate: true });
      
            // const c_name = res.data.data.company;
            // const di_name = res.data.data.division;
      
            // const r = await axios.get('http://localhost:5000/api/v1/company/all/companies');
      
            // let gotDivision = [];
            // let gotDepartment = [];
            // r?.data?.data.forEach((el) => {
            //   if (el.company_name === c_name) {
            //     gotDivision = el.division.map((div) => {
            //       return { label: div.division_name, value: div._id };
            //     });
            //   }
            // });
      
            // r?.data?.data.forEach((el) => {
            //   if (el.company_name === c_name) {
            //     el.division.map((div) => {
            //       if (div.division_name === di_name) {
            //         gotDepartment = div.department.map((dept) => {
            //           return { label: dept.department_name, value: dept._id };
            //         });
            //       }
            //     });
            //   }
            // });
      
            // console.log('here in useeffect divisin', gotDivision);

            
            
            // setDivisions(gotDivision);
            // setDepartments(gotDepartment);
            // console.log('after setting default values');
          } catch (err) {
            console.log('wrroe in edit fetching ', err);
            alert('something went wrong here in');
          }
    }

    useEffect(() => {
        getSpecificSimCardBill()
    }, [])



    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>

            <Grid container spacing={2}>
                <Grid xs={12} md={1}>
                </Grid>

                <Grid container xs={12} md={10} sx={{ marginTop: 5, }} justifyContent={'center'}>
                    <Card sx={{ p: 3, width: '80%', }}>
                        {/* <Typography variant="h4">Item Master</Typography> */}
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                        // gridTemplateColumns={{
                        //   xs: 'repeat(1, 1fr)',
                        //   sm: 'repeat(2, 1fr)',
                        // }}
                        >
                            {/* <RHFAutocomplete
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
                                name="employeeName"
                                label="Employee Name *"
                                options={allEmps.map((empName) => empName.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = emps.filter(
                                        (empName) => empName.label === option
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
                            /> */}
                            
                            <Controller
                                name="requisitionDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Requisition Date*"
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
                            {/* <RHFTextField name="serviceProvider" label="Service Provider *" /> */}
                            <RHFAutocomplete
                                name="serviceProvider"
                                label="Service Provider *"
                                options={sps.map((spName) => spName.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = sps.filter(
                                        (spName) => spName.label === option
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
                            <RHFTextField name="tariffPlanNo" label="Tariff Plan No *" />
                            {/* <RHFTextField name="monthlyLimit" label="Monthly Limit *" /> */}
                            <RHFTextField name="simCardNo" label="Sim Card No *" />
                            <RHFTextField name="dataCardNo" label="Data Card No *" />
                            <Controller
                                name="issueDateOfSimCard"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Issue Date Sim Card *"
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
                                name="issueDateOfDataCard"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Issue Date Sim Card *"
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
                            <RHFTextField name="amount" label="Amount *" />
                            {/* <RHFAutocomplete
                                name="approvedBy"
                                label="Approved By *"
                                options={allEmps.map((empName) => empName.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = allEmps.filter(
                                        (empName) => empName.label === option
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
                            /> */}

                        </Box>
                        {
                            done && <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                <strong>Sim Card Allocation details has been saved!</strong>
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

EditSimCardAllocationForm.propTypes = {
    currentUser: PropTypes.object,
};