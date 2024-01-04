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
import { RHFTextField, RHFEditor, RHFAutocomplete, RHFCode, RHFCheckbox } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';
import { useAdminMISContext } from 'src/context/admin_mis_context';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';
import label from 'src/components/label';

export default function BillingDetailsForm({ currentUser }) {

    const settings = useSettingsContext();

    const { user } = useAuthContext();

    const { toggleAddDepartmentFlag } = useAdminMISContext();

    const [done, setDone] = useState(false);

    const [companies, setCompanies] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);

    const BillingDetailsSchema = Yup.object().shape({

        location: Yup.string().required('Location name is required'),
        particular: Yup.string().required('Particular is required'),
        totalEmployees: Yup.string().required('Total number of employees are required'),
        billNo: Yup.string().required('Bill number is required'),
        monthAndYear: Yup.string().required('Month and year are required'),
        billAmount: Yup.string().required('Bill amount is required'),
        billDate: Yup.string().required('Bill date is required'),
        sgst: Yup.string().required('SGST is required'),
        cgst: Yup.string().required('CGST is required'),
        igst: Yup.string().required('IGST is required'),
        totalAmount: Yup.string().required('Total amount is required'),

    });

    const defaultValues = useMemo(
        () => ({
            location: currentUser?.location || '',
            particular: currentUser?.particular || '',
            totalEmployees: currentUser?.totalEmployees || '',
            billNo: currentUser?.billNo || '',
            billAmount: currentUser?.billAmount || '',
            monthAndYear: currentUser?.monthAndYear || '',
            billDate: currentUser?.billDate || '',
            sgst: currentUser?.sgst || '',
            cgst: currentUser?.cgst || '',
            igst: currentUser?.igst || '',
            totalAmount: currentUser?.totalAmount || '',
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

    const watchCompanyName = watch("companyName")
    const watchDivisionName = watch("divisionName")

    
    const locations = [
        { label: "Admin" },
        { label: "Civil" },
        { label: "Security" },
    ]

    const particulars = [
        { label: "Admin" },
        { label: "Civil" },
        { label: "Security" },
    ]

    const contracters = [
        { label: "Admin" },
        { label: "Civil" },
        { label: "Security" },
    ]

    const workTypes = [
        { label: "Admin" },
        { label: "Civil" },
        { label: "Security" },
    ]

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

        const department_id = departments.filter((d) => {
            if (d?.label === data?.departmentName) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;

        try {
            const URL = `http://localhost:5000/api/v1/sub_department`
            const res = await axios.post(URL, {
                sub_department_name: data.subDepartment,
                gl_code: data.glCode,
                d_id: department_id
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
                            <RHFAutocomplete
                                name="particular"
                                label="Particular *"
                                options={particulars.map((particular) => particular.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = particulars.filter(
                                        (particular) => particular.label === option
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
                                name="monthAndYear"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Month & Year *"
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
                            <RHFCheckbox name="cgst" label="CGST" />
                            <RHFCheckbox name="igst" label="IGST" />
                            <RHFTextField name="totalAmount" label="Total Amount *" />

                        </Box>
                        {
                            done && <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                <strong>Man Power billing details has been saved!</strong>
                            </Alert>
                        }

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? 'Add Billing Details' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

BillingDetailsForm.propTypes = {
    currentUser: PropTypes.object,
};