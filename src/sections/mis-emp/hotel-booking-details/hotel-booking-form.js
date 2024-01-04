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

export default function HotelBookingForm({ currentUser }) {

    const settings = useSettingsContext();

    const { user } = useAuthContext();

    const { toggleAddDepartmentFlag } = useAdminMISContext();

    const [done, setDone] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [emps, setEmps] = useState([]);

    const HotelBookingSchema = Yup.object().shape({
        hotelName: Yup.string().required('Hotel Name is required'),
        guestName: Yup.string().required('Guest Name is required'),
        purposeOfVisit: Yup.string().required('Purpose of visit is required'),
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

    const watchCompanyName = watch("companyName")
    const watchDivisionName = watch("divisionName")
    const watchDepartmentName = watch("departmentName");

    

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

    const getEmps = async() => {
        try{
            const URL = `http://localhost:5000/api/v1/employee/getAll`
            const res = await axios.get(URL);
            const generetedData = res?.data?.data.map((el) => {
                return { label: el.emp_name, value: el._id }
            })

            setEmps(generetedData);
        }
        catch(err){
            console.log(err);
        }
    }

    const onSubmit = handleSubmit(async (data) => {
        // const emp_id = emps.filter((el) => {
        //     if (el?.label === data?.bookedBy) {
        //         return true;
        //     }
        //     else {
        //         return false;
        //     }

        // })[0].value;

        const hotel = hotels.filter((el) => {
            if (el?.label === data?.hotelName) {
                return true;
            }
            else {
                return false;
            }
        })[0].value;
        

        try {
            const URL = `http://localhost:5000/api/v1/bill/hotel`
            const res = await axios.post(URL, {
                company: user.company,
                division: user.division,
                department: user.department,
                booked_by: user._id,
                hotel,
                guest_name: data.guestName,
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


    useEffect(() => {
        getHotels();
        getEmps();
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
                            {/* <RHFAutocomplete
                                name="bookedBy"
                                label="Booked By *"
                                options={emps.map((empName) => empName.label)}
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
                                {!currentUser ? 'Add Hotel Booking Details' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

HotelBookingForm.propTypes = {
    currentUser: PropTypes.object,
};