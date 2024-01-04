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

export default function SalesDetailsForm({ currentUser }) {

    const settings = useSettingsContext();

    const {toggleAddDepartmentFlag} = useAdminMISContext();

    const { user } = useAuthContext();

    const [done, setDone] = useState(false);

    const SalesDetailsSchema = Yup.object().shape({
        salesDate: Yup.string().required('Sales date is required'),
        salesValue: Yup.string().required('Sales value is required'),
        wdvAmount: Yup.string().required('WDV Amount is required'),
        saleTo: Yup.string().required("Buyer's name  is required"),
        approvedBy: Yup.string().required('Approver name is required'),
    });

    const defaultValues = useMemo(
        () => ({
            salesDate: currentUser?.salesDate || '',
            salesValue: currentUser?.salesValue || '',
            wdvAmount: currentUser?.wdvAmount || '',
            saleTo: currentUser?.saleTo || '',
            approvedBy: currentUser?.approvedByS || '',
        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(SalesDetailsSchema),
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
                            <Controller
                                name="salesDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Sales Date *"
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
                            <RHFTextField name="salesValue" label="Sales Value *" />
                            <RHFTextField name="wdvAmount" label="WDV Amount*" />
                            <RHFTextField name="saleTo" label="Sold To *" />
                            <RHFTextField name="approvedBy" label="Approved By *" />

                        </Box>
                        {
                            done && <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                <strong>Sales Details has been saved!</strong>
                            </Alert>
                        }

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? 'Add Sales Details' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

SalesDetailsForm.propTypes = {
    currentUser: PropTypes.object,
};