/* eslint-disable */
import PropTypes from 'prop-types';
import { useMemo, React, useState } from 'react';
import { useForm, useController, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
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
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// components
import { useTheme } from '@mui/material/styles';
import { Alert, AlertTitle, Grid, TextareaAutosize } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { RHFTextField, RHFEditor, RHFAutocomplete } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';
import { useAdminMISContext } from 'src/context/admin_mis_context';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { toDate } from 'date-fns';
import PaymentDetailsForm from '../payment-details-form';

export default function AssetDetailsForm({ currentUser }) {

    const settings = useSettingsContext();
    const theme = useTheme();

    const { user } = useAuthContext();

    const { toggleAddDepartmentFlag } = useAdminMISContext();

    const [done, setDone] = useState(false);
    const [assets, setAssets] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [payment, setPayment] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [emps, setEmps] = useState([]);
    const [allEmps, setAllEmps] = useState([]);

    const HotelBookingSchema = Yup.object().shape({

        companyName: Yup.string().required('Company name is required'),
        divisionName: Yup.string().required('Division name is required'),
        departmentName: Yup.string().required('Department name is required'),
        itemName: Yup.string().required('Item Name is required'),
        vendorName: Yup.string().required('Vendor Name is required'),
        issuedTo: Yup.string().required('Issued to is required'),
        assetNo: Yup.string().required('Asset number is required'),
        condition: Yup.string().required('Condition of asset is required'),
        wdvAmount: Yup.string().required('WDV Amount is required'),
        approvedBy: Yup.string().required('Approver Name is required'),
        requisitionDate: Yup.string().required('Requisition date is required'),
        issuedDate: Yup.string().required('Issue date is required'),
        purchaseDate: Yup.string().required('Purchase date is required'),
        saleDate: Yup.string().required('Sale date is required'),
        saleValue: Yup.string().required('Sale value is required'),
        cjoNo: Yup.string().required('CJO number is required'),

        //payment

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
            companyName: currentUser?.companyName || '',
            divisionName: currentUser?.divisionName || '',
            departmentName: currentUser?.departmentName || '',
            itemName: currentUser?.itemName || '',
            vendorName: currentUser?.vendorName || '',
            issuedTo: currentUser?.issuedTo || '',
            assetNo: currentUser?.assetNo || '',
            condition: currentUser?.condition || '',
            wdvAmount: currentUser?.wdvAmount || '',
            approvedBy: currentUser?.approvedBy || '',
            requisitionDate: currentUser?.requisitionDate || dayjs(Date.now()),
            issuedDate: currentUser?.issuedDate || dayjs(Date.now()),
            purchaseDate: currentUser?.purchaseDate || '',
            saleDate: currentUser?.saleDate || dayjs(Date.now()),
            saleValue: currentUser?.saleValue || '',
            cjoNo: currentUser?.cjoNo || '',

            //payment

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

    const modesofpayment = [
        { label: "Card" },
        { label: "UPI" },
        { label: "Cash" },
    ]   

    const watchCompanyName = watch("companyName")
    const watchDivisionName = watch("divisionName")

    const watchDepartmentName = watch("departmentName");

    
    const getAllEmps = async() => {
        try{
            const res = await axios.get("http://localhost:5000/api/v1/employee/getAll");
            const generetedData = res?.data?.data.map((el) => {
                return { label: el.emp_name, value: el._id }
            })

            setAllEmps(generetedData);

        }
        catch(err){
            alert("error in get all emps");
            console.log(err);
        }
    }
    
    

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

        const item_id = assets.filter((d) => {
            if (d?.label === data?.itemName) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;

        const vendor_id = vendors.filter((d) => {
            if (d?.label === data?.vendorName) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;


        const emp_id = emps.filter((d) => {
            if (d?.label === data?.issuedTo) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;

        const approved_by_id = allEmps.filter((d) => {
            if (d?.label === data?.approvedBy) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;

        try {
            const URL = `http://localhost:5000/api/v1/bill/asset`
            const res = await axios.post(URL, {
                company: company_id,
                division: division_id,
                department: department_id,
                item: item_id,
                vendor: vendor_id,
                issued_to: emp_id,
                approved_by: approved_by_id,
                issue_date: data.issuedDate,
                purchase_date: data.purchaseDate,
                condition: data.condition,
                sale_date: data.saleDate,
                wdv_amount: parseInt(data.wdvAmount),
                sale_value: parseInt(data.saleValue),
                cjo_no: data.cjoNo,

                // payment

                payment_mode: data.modeOfPayment,
                payment_from_bank: data.paymentFromBank,
                cheque_date: data.chequeDate,
                cheque_no: data.chequeNo,
                cheque_to: data.chequeTo,
                transaction_date: data.transactionDate,
                transaction_no: data.transactionNo,
                transaction_status: data.transactionStatus,
                payment_to_bank: data.paymentToBank,
                amount: parseInt(data.amount)
            })
            toggleAddDepartmentFlag();
            reset();
            setDone(true);
        }
        catch (err) {
            alert("something went wrong on submit button");
            console.log(err);
        }

    });


    const getAllItems = async() => {
        try{
            const URL = "http://localhost:5000/api/v1/asset/getAll"
            const res = await axios.get(URL);

            const generetedData = res?.data?.data.map((el) => {
                return { label: el.asset_name, value: el._id }
            })

            // console.log("here in division : ", generetedData)
            setAssets(generetedData);

        }
        catch(err){
            alert("something went wrong get all asset");
            console.log(err);
        }
    } 

    const getEmployees = async() => {
        try{
            const company_id = companies.filter((c) => {
                if (c?.label === watchCompanyName) {
                    return true;
                }
                else {
                    return false;
                }
            })[0].value
            const division_id = divisions.filter((d) => {
                if (d?.label === watchDivisionName) {
                    return true;
                }
                else {
                    return false;
                }
    
            })[0].value;
    
            const department_id = departments.filter((d) => {
                if (d?.label === watchDepartmentName) {
                    return true;
                }
                else {
                    return false;
                }
    
            })[0].value;

            console.log("company idddd", company_id)
            console.log("division idddd", division_id)
            console.log("department idddd", department_id)
            
            const URL = `http://localhost:5000/api/v1/employee/cdd/getAll`
            const res = await axios.post(URL, {
                company: company_id,
                division: division_id,
                department: department_id
            });
            const generetedData = res?.data?.data.map((el) => {
                return { label: el.emp_name, value: el._id }
            })

            setEmps(generetedData);
        }
        catch(err){
            console.log(err);
        }
    }


    const getAllVendors = async() => {
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


    useEffect(() => {
        getCompanies();
        getAllItems();
        getAllVendors();
        getAllEmps();
    }, [])


    useEffect(() => {
        getEmployees();
    }, [watchDepartmentName])

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
                                name="itemName"
                                label="Item Name *"
                                options={assets.map((itemName) =>itemName.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = assets.filter(
                                        (itemName) => itemName.label === option
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
                                name="vendorName"
                                label="Vendor Name *"
                                options={vendors.map((vendorName) => vendorName.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = vendors.filter(
                                        (vendorName) => vendorName.label === option
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
                                name="issuedTo"
                                label="Issued To *"
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
                            />

                            
                            
                            {/* <RHFTextField name="issuedTo" label="Issued To *" /> */}
                            <RHFTextField name="assetNo" label="Asset No *" />
                            <RHFTextField name="condition" label="Condition *" />
                            <RHFTextField name="wdvAmount" label="WDV Amount *" />

                            <RHFAutocomplete
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
                            />
                            {/* <RHFTextField name="approvedBy" label="Approved By *" /> */}
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
                            <Controller
                                name="issuedDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Issued Date *"
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
                                name="purchaseDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Purchase Date *"
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
                                name="saleDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Sale Date *"
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
                            <RHFTextField name="saleValue" label="Sale Value *" />
                            <RHFTextField name="cjoNo" label="CJO No *" />


                            {/* payment */}

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
                                <strong>Asset details has been saved!</strong>
                            </Alert>
                        }

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? 'Add Asset Details' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                        
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

AssetDetailsForm.propTypes = {
    currentUser: PropTypes.object,
};