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

export default function PaymentDetailsForm({ currentUser }) {

    const settings = useSettingsContext();

    const {toggleAddDepartmentFlag} = useAdminMISContext();

    const { user } = useAuthContext();

    const [done, setDone] = useState(false);

    const PaymentDetailsSchema = Yup.object().shape({
        modeOfPayment: Yup.string().required('Mode of payment is required'),
        paymentFromBank: Yup.string().required('Bank name is required'),
        chequeDate: Yup.string().required('Cheque Date is required'),
        chequeNo: Yup.string().required('Cheque Number is required'),
        chequeTo: Yup.string().required('Cheque To is required'),
        transactionDate: Yup.string().required('Transaction Date is required'),
        transactionNo: Yup.string().required('Transaction Number is required'),
        transactionStatus: Yup.string().required('Transaction Status is required'),
        paymentToBank: Yup.string().required('Bank name is required'),
        amount: Yup.string().required('Amount is required'),
    });

    const defaultValues = useMemo(
        () => ({
            modeOfPayment: currentUser?.modeOfPayment || '',
            paymentFromBank: currentUser?.paymentFromBank || '',
            chequeDate: currentUser?.chequeDate || '',
            chequeNo: currentUser?.chequeNo || '',
            chequeTo: currentUser?.chequeTo || '',
            transactionDate: currentUser?.transactionDate || '',
            transactionNo: currentUser?.transactionNo || '',
            transactionStatus: currentUser?.transactionStatus || '',
            paymentToBank: currentUser?.paymentToBank || '',
            amount: currentUser?.amount || '',
        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(PaymentDetailsSchema),
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

    const modesofpayment = [
        { label: "Admin" },
        { label: "Civil" },
        { label: "Security" },
    ]    

    const onSubmit = handleSubmit(async (data) => {

    });


    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>

            <Grid container spacing={2}>
                <Grid xs={12} md={1}>
                </Grid>

                <Grid container xs={12} md={10} sx={{ marginTop: 5, }} justifyContent={'center'}>
                    <Card sx={{ p: 3, width: '80%', }}>
                        
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
                                name="modeOfPayment"
                                label="Mode Of Payment*"
                                options={modesofpayment.map((modeOfPayment) => modeOfPayment.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = modesofpayment.filter(
                                        (modeOfPayment) => {
                                           return modeOfPayment.label === option
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
                            <RHFTextField name="paymentFromBank" label="Payment From Bank *" />
                            <Controller
                                name="chequeDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Cheque Date *"
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
                            <RHFTextField name="chequeNo" label="Cheque Number *" />
                            <RHFTextField name="chequeTo" label="Cheque To *" />
                            <Controller
                                name="transactionDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Transaction Date *"
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
                            <RHFTextField name="transactionNo" label="Transaction Number *" />
                            <RHFTextField name="transactionStatus" label="Transaction Status *" />
                            <RHFTextField name="paymentToBank" label="Payment To Bank *" />
                            <RHFTextField name="amount" label="Amount *" />

                        </Box>
                        {
                            done && <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                <strong>Payment Details has been saved!</strong>
                            </Alert>
                        }

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? 'Add Payement Details' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

PaymentDetailsForm.propTypes = {
    currentUser: PropTypes.object,
};