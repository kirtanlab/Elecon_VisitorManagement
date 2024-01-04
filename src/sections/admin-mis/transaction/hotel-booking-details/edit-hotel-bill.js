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

export default function EditHotelBookingForm({ currentUser }) {

    const settings = useSettingsContext();

    const { user } = useAuthContext();

    const { itemMasterId, toggleAddDepartmentFlag } = useAdminMISContext();

    const [done, setDone] = useState(false);

    // const [companies, setCompanies] = useState([]);
    // const [divisions, setDivisions] = useState([]);
    // const [departments, setDepartments] = useState([]);
    const [hotels, setHotels] = useState([])


    // useEffect(() => {
    //     console.log("form called in hotel booking");
    // }, [])

    const HotelBookingSchema = Yup.object().shape({

        // companyName: Yup.string().required('Company name is required'),
        // divisionName: Yup.string().required('Division name is required'),
        // departmentName: Yup.string().required('Department name is required'),
        hotelName: Yup.string().required('Hotel Name is required'),
        guestName: Yup.string().required('Guest Name is required'),
        // purposeOfVisit: Yup.string().required('Purpose of visit is required'),
        purposeOfVisit: Yup.string(),
        billNo: Yup.string().required('Bill number is required'),
        guestStayTotalDays: Yup.string().required('Guest stay total days are required'),
        amount: Yup.string().required('amount to be paid is required'),
        // bookedBy: Yup.string().required('Booker Name is required'),
        requisitionDate: Yup.string().required('Requisition date for sim card is required'),
        billDate: Yup.string().required('Billing Date is required'),
        guestStayFromDate: Yup.string().required('Guest-Stay From Date is required'),
        guestStayToDate: Yup.string().required('Guest-Stay To Date is required'),
    });

    const defaultValues = useMemo(
        () => ({
            companyName: currentUser?.companyName || '',
            divisionName: currentUser?.divisionName || '',
            departmentName: currentUser?.departmentName || '',
            hotelName: currentUser?.hotelName || '',
            guestName: currentUser?.guestName || '',
            purposeOfVisit: currentUser?.purposeOfVisit || '',
            billNo: currentUser?.billNo || '',
            guestStayTotalDays: currentUser?.guestStayTotalDays || '',
            amount: currentUser?.amount || '',
            // bookedBy: currentUser?.bookedBy || '',
            requisitionDate: currentUser?.requisitionDate || dayjs(Date.now()),
            billDate: currentUser?.billDate || dayjs(Date.now()),
            guestStayFromDate: currentUser?.guestStayFromDate || dayjs(Date.now()),
            guestStayToDate: currentUser?.guestStayToDate || dayjs(Date.now()),
        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(HotelBookingSchema),
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

    // const hotels = [
    //     { label: "Admin" },
    //     { label: "Civil" },
    //     { label: "Security" },
    // ]

    // const companies = [
    //     { label: "Admin" },
    //     { label: "Civil" },
    //     { label: "Security" },
    // ]

    // const divisions = [
    //     { label: "Admin" },
    //     { label: "Civil" },
    //     { label: "Security" },
    // ]

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
    //         })[0].value;

    //         console.log(company_id);

    //         const URL = `http://localhost:5000/api/v1/company/getDivisionByCompany/${company_id}`;
    //         const res = await axios.get(URL);
    //         const generetedData = res?.data?.data?.division.map((el) => {
    //             return { label: el.division_name, value: el._id }
    //         })

    //         console.log("here in division : ", generetedData)
    //         setDivisions(generetedData);
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }

    // }

    // useEffect(() => {
    //     // console.log("useEffect called company name");
    //     getDivisions();
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
    //             })[0].value;

    //             console.log(division_id);

    //             const URL = `http://localhost:5000/api/v1/division/getDepartmentByDivision/${division_id}`;
    //             const res = await axios.get(URL);
    //             const generetedData = res?.data?.data?.department.map((el) => {
    //                 return { label: el.department_name, value: el._id }
    //             })

    //             // console.log("here in division : ", generetedData)
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

        const hotel_id = hotels.filter((d) => {
            if (d?.label === data?.hotelName) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;




        try {
            const URL = `http://localhost:5000/api/v1/bill/hotel/${itemMasterId}`
            const res = await axios.post(URL, {
                company: user.company,
                division: user.division,
                department: user.department,
                booked_by: user._id,
                hotel: hotel_id,
                guest_name: data.guestName,
                purpose: data.purposeOfVisit,
                requisition_date: data.requisitionDate,
                stay_to_date: data.guestStayToDate,
                stay_from_date: data.guestStayFromDate,
                bill_no: data.billNo,
                total_days: data.guestStayTotalDays,
                amount: data.amount,
                billing_date: data.billDate
            })
            toggleAddDepartmentFlag();
            reset();
            setDone(true);
        }
        catch (err) {
            console.log(err);
        }

    });

    const getSpecificHotelBill = async() => {
        try{
            console.log('this is id', itemMasterId);
            const URL = `http://localhost:5000/api/v1/bill/hotel/${itemMasterId}`;

            const res = await axios.get(URL);
            console.log("here in specific hotel bill res : ", res?.data);
            // console.log('specific vendor ', res.data.data.company.company_name);

            // setValue('companyName', res.data.data.company.company_name, { shouldValidate: true });
            // setValue('divisionName', res.data.data.division.division_name, { shouldValidate: true });
            // setValue('departmentName', res.data.data.department.department_name, {
            //     shouldValidate: true,
            // });
            setValue('hotelName', res.data.data.hotel.name, { shouldValidate: true });
            setValue('guestName', res.data.data.guest_name, { shouldValidate: true });
            setValue('purposeOfVisit', res.data.data.purpose, { shouldValidate: true });
            setValue('billNo', res.data.data.bill_no, { shouldValidate: true });
            setValue('guestStayTotalDays', res.data.data.total_days, { shouldValidate: true });
            setValue('amount', res.data.data.amount, { shouldValidate: true });
            setValue('requisitionDate', dayjs(res.data.data.requisition_date), { shouldValidate: true });
            setValue('billDate', dayjs(res.data.data.billing_date), { shouldValidate: true });
            setValue('guestStayFromDate', dayjs(res.data.data.stay_from_date), { shouldValidate: true });
            setValue('guestStayToDate', dayjs(res.data.data.stay_to_date), { shouldValidate: true });

            
    
        }
        catch(err){
            alert("something went wrong in get specific hotel bill");
            console.log(err);
        }
    }

    const getHotels = async() => {
        try{
            const URL = `http://localhost:5000/api/v1/hotel/getAll`
            const res = await axios.get(URL);
            const generetedData = res?.data?.data.map((el) => {
                return { label: el.name, value: el._id }
            })

            setHotels(generetedData);
        }
        catch(err){
            console.log(err);
        }
    }



    useEffect(() => {
        // getCompanies();
        getSpecificHotelBill()
        getHotels()

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
                            /> */}
                            <RHFAutocomplete
                                name="hotelName"
                                label="Hotel Name *"
                                options={hotels.map((hotelName) => hotelName.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = hotels.filter(
                                        (hotelName) => hotelName.label === option
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
                
                            <RHFTextField name="guestName" label="Guest Name *" />
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
                            <RHFTextField name="purposeOfVisit" label="Purpose Of Visit *" />
                            <RHFTextField name="billNo" label="Bill No *" />
                            <RHFTextField name="guestStayTotalDays" label="Guest-Stay Total Days*" />
                            <RHFTextField name="amount" label="Amount To Be Paid *" />
                            <Controller
                                name="billDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Billing Date *"
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
                            {/* <RHFTextField name="bookedBy" label="Booked By *" /> */}
                            <Controller
                                name="guestStayFromDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Guest-Stay From Date *"
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
                                name="guestStayToDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Guest-Stay Date *"
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

                        </Box>
                        {
                            done && <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                <strong>Hotel Booking details has been saved!</strong>
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

EditHotelBookingForm.propTypes = {
    currentUser: PropTypes.object,
};