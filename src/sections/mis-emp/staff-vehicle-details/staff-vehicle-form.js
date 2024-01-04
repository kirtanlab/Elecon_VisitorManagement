/* eslint-disable */
import PropTypes from 'prop-types';
import { useMemo, React, useState } from 'react';
import { useForm, useController, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
// @mui
import { useTheme } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// import { DatePicker } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { Alert, AlertTitle, Grid, TextareaAutosize } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { RHFTextField, RHFEditor, RHFAutocomplete, RHFUpload, RHFUploadAvatar} from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';
import { useAdminMISContext } from 'src/context/admin_mis_context';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';



export default function StaffVehicleForm({ currentUser }) {

    const theme = useTheme();

    const settings = useSettingsContext();


    const { user } = useAuthContext();

    const { toggleAddDepartmentFlag } = useAdminMISContext();

    const [done, setDone] = useState(false);
    const [fileUpload, setFileUpload] = useState();
    const [insurance, setInsurance] = useState();
    const [puc, setPUC] = useState();
    const [companies, setCompanies] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [allEmps, setAllEmps] = useState([]);
    const [allVehicles, setAllVehicles] = useState([])


    const StaffVehicleSchema = Yup.object().shape({

        // companyName: Yup.string().required('Company name is required'),
        // divisionName: Yup.string().required('Division name is required'),
        // departmentName: Yup.string().required('Department name is required'),
        // vehicleType: Yup.string().required('Vehicle type is required'),
        makeModel: Yup.string().required('Make and Model is required'),
        vehicleNo: Yup.string().required('Vehicle number is required'),
        purchaseDate: Yup.string().required('Purchase date is required'),
        issueDate: Yup.string().required('Issued date is required'),
        recievedDate: Yup.string().required('Recieved date is required'),
        assetNo: Yup.string().required('Asset number is required'),
        engineNo: Yup.string().required('Engine number is required'),
        chassisNo: Yup.string().required('Chassis number is required'),
        remarks: Yup.string(),
        condition: Yup.string().required('Condition of vehicle is required'),
        usage: Yup.string().required('Usage is required'),

        // sales details 
        salesDate: Yup.string().required('Sales date is required'),
        salesValue: Yup.string().required('Sales value is required'),
        wdvAmount: Yup.string().required('WDV Amount is required'),
        saleTo: Yup.string().required("Buyer's name  is required"),
        approvedBy: Yup.string().required('Approver name is required'),
        



        // payment details 

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


        // image to be uploaded
        rcBook: Yup.mixed().required('RC Book of vehicle is required'),
        pucDetails: Yup.mixed().required('PUC of vehicle is required'),
        insuranceDetails: Yup.mixed().required('Insurance details of vehicle are required'),

        
    });

    const defaultValues = useMemo(
        () => ({
            // companyName: currentUser?.companyName || '',
            // divisionName: currentUser?.divisionName || '',
            // departmentName: currentUser?.departmentName || '',
            // vehicleType: currentUser?.vehicleType || '',
            makeModel: currentUser?.makeModel || '',
            vehicleNo: currentUser?.vehicleNo || '',
            purchaseDate: currentUser?.purchaseDate || '',
            issueDate: currentUser?.issueDate || '',
            recievedDate: currentUser?.recievedDate || '',
            assetNo: currentUser?.assetNo || '',
            engineNo: currentUser?.engineNo || '',
            chassisNo: currentUser?.chassisNo || '',
            remarks: currentUser?.remarks || '',
            condition: currentUser?.condition || '',
            usage: currentUser?.usage || '',


            // sales details 
            salesDate: currentUser?.salesDate || '',
            salesValue: currentUser?.salesValue || '',
            wdvAmount: currentUser?.wdvAmount || '',
            saleTo: currentUser?.saleTo || '',
            approvedBy: currentUser?.approvedBy || '',




            // payment details 
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


            // image to be uploaded

            rcBook: currentUser?.rcBook || '',
            pucDetails: currentUser?.pucDetails || '',
            insuranceDetails: currentUser?.insuranceDetails || '',

            // driver details 
            driver: currentUser?.driver || '',

        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(StaffVehicleSchema),
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

    const makeModels = [
        { label: "Admin" },
        { label: "Civil" },
        { label: "Security" },
    ]

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

    const modesofpayment = [
        { label: "Card" },
        { label: "Cheque" },
        { label: "Online" },
        { label: "Cash" },
    ]

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

    const getAllVehicles = async() => {
        try{
            const URL = "http://localhost:5000/api/v1/makeAndModel/getAll"
            const res = await axios.get(URL);
            const generetedData = res?.data?.data.map((el) => {
                return { label: el.make_and_model_name, value: el._id }
            })

            setAllVehicles(generetedData);


        }
        catch(err){
            alert("something went wrong in get all vehicles");
            console.log(err);
        }
    }

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

        const vehicle_id = allVehicles.filter((d) => {
            if (d?.label === data?.makeModel) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;

        const assigned_by_id = allEmps.filter((d) => {
            if (d?.label === data?.approvedBy) {
                return true;
            }
            else {
                return false;
            }

        })[0].value;

        try {
            const URL = `http://localhost:5000/api/v1/bill/makeAndModel`
            const res = await axios.post(URL, {
                company: user.company,
                division: user.division,
                department: user.department,
                make_model: vehicle_id,
                employee: user._id,
                approved_by: assigned_by_id,

                vehicle_no: data.vehicleNo,
                purchase_date: data.purchaseDate,
                issue_date: data.issueDate,
                received_date: data.recievedDate,
                engine_no: data.engineNo,
                chassis_no: data.chassisNo,
                remarks: data.remarks,
                condition: data.condition,
                usage: data.usage,


                sale_date: data.salesDate,
                sale_value: data.salesValue,
                wdv_amount: data.wdvAmount,
                sale_to: data.saleTo,
                
                payment_mode: data.modeOfPayment,
                payment_from_bank: data.paymentFromBank,
                cheque_date: data.chequeDate,
                cheque_no: data.chequeNo,
                cheque_to: data.chequeTo,
                transaction_date: data.transactionDate,
                transaction_no: data.transactionNo,
                transaction_status: data.transactionStatus,
                payment_to_bank: data.paymentToBank,
                amount: data.amount,

                rc_book_details: data.rcBook,
                insurance_details: data.insuranceDetails,
                puc_details: data.pucDetails




            }, {
                headers:{
                            "Content-Type": "multipart/form-data"
                        }
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
        // getCompanies();
        getAllEmps();
        getAllVehicles()
    }, [])

    const handleDropRcBook = async(acceptedFiles) => {
        const file = acceptedFiles[0];
          // const newFile = await convertToBase64(file)
          console.log("here in drop RC book", file);
          const newFile = Object.assign(file, {
              preview: URL.createObjectURL(file),
          });
          console.log("here is the file", newFile?.tempFilePath);
        if (file) {
          setValue('rcBook', newFile, { shouldValidate: true });
        }
  }
  const handleDropInsurance = async(acceptedFiles) => {
        const file = acceptedFiles[0];
          // const newFile = await convertToBase64(file)
          // console.log("here in drop insurance", file);
          const newFile = Object.assign(file, {
              preview: URL.createObjectURL(file),
          });
          console.log("here is the file", file);
        if (file) {
          setValue('insuranceDetails', newFile, { shouldValidate: true });
        }
  }
  const handleDropPuc = async(acceptedFiles) => {
        const file = acceptedFiles[0];
          // const newFile = await convertToBase64(file)
          console.log("here in drop puc", file);
          const newFile = Object.assign(file, {
              preview: URL.createObjectURL(file),
          });
          console.log("here is the file", newFile?.tempFilePath);
        if (file) {
          setValue('pucDetails', newFile, { shouldValidate: true });
        }
  }

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
                                name="makeModel"
                                label="Make & Model *"
                                options={allVehicles.map((makeModel) => makeModel.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = allVehicles.filter(
                                        (makeModel) => makeModel.label === option
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
                            <RHFTextField name="vehicleNo" label="Vehicle No *" />
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
                                name="recievedDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Recieved Date *"
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
                                name="issueDate"
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
                            <RHFTextField name="engineNo" label="Engine number *" />
                            <RHFTextField name="assetNo" label="Asset number *" />
                            <RHFTextField name="chassisNo" label="Chassis number *" />
                            <RHFTextField name="remarks" label="Remarks" />
                            <RHFTextField name="condition" label="Condition of vehicle *" />
                            <RHFTextField name="usage" label="Usage *" />


                                        {/* sales details */}

                            <Typography variant='h6' sx={{marginBottom: 2}}>
                                Enter Sales Details
                            </Typography>

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
                            {/* <RHFTextField name="approvedBy" label="Approved By *" /> */}

                            <RHFAutocomplete
                                name="approvedBy"
                                label="Approved By *"
                                options={allEmps.map((emp) => emp.label)}
                                getOptionLabel={(option) => option}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option) => {
                                    const { label } = allEmps.filter(
                                        (emp) => emp.label === option
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

                                        {/* payment details  */}

                            <Typography variant='h6' sx={{marginBottom: 2}}>
                                Enter Payment Details
                            </Typography>

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

                            <Typography variant='h6' sx={{marginBottom: 2}}>
                            Upload RC Book Details
                            </Typography>
                            {/* <RHFUpload name="rcBook" label="Upload RC Book Details" /> */}
                            {/* <Input type='file' onChange={handleFileChange}/> */}
                            <RHFUploadAvatar
                                name="rcBook"
                                maxSize={3145728}
                                onDrop={handleDropRcBook}
                                helperText={
                                <Typography
                                    variant="caption"
                                    sx={{
                                    mt: 3,
                                    mx: 'auto',
                                    display: 'block',
                                    textAlign: 'center',
                                    color: 'text.disabled',
                                    }}
                                >
                                    Upload your RC Book here
                                    <br /> max size of 3 MB
                                </Typography>
                                }
                            />
                            <Typography variant='h6' sx={{marginBottom: 2}}>
                            Upload Insurance Details
                            </Typography>
                            {/* <RHFUpload name="insuranceDetails" label="Upload Insurance Details" /> */}
                            <RHFUploadAvatar
                                name="insuranceDetails"
                                maxSize={3145728}
                                onDrop={handleDropInsurance}
                                helperText={
                                <Typography
                                    variant="caption"
                                    sx={{
                                    mt: 3,
                                    mx: 'auto',
                                    display: 'block',
                                    textAlign: 'center',
                                    color: 'text.disabled',
                                    }}
                                >
                                    Upload your Insurance here
                                    <br /> max size of 3 MB
                                </Typography>
                                }
                            />
                            <Typography variant='h6' sx={{marginBottom: 2}}>
                            Upload PUC Details
                            </Typography>
                            {/* <RHFUpload name="pucDetails" label="Upload PUC Details" /> */}
                            <RHFUploadAvatar
                                name="pucDetails"
                                maxSize={3145728}
                                onDrop={handleDropPuc}
                                helperText={
                                <Typography
                                    variant="caption"
                                    sx={{
                                    mt: 3,
                                    mx: 'auto',
                                    display: 'block',
                                    textAlign: 'center',
                                    color: 'text.disabled',
                                    }}
                                >
                                    Upload your PUC here
                                    <br /> max size of 3 MB
                                </Typography>
                                }
                            />

                            

                        </Box>
                        {
                            done && <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                <strong>Staff Vehicle details has been saved!</strong>
                            </Alert>
                        }

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? 'Add Staff Vehicle Details' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

StaffVehicleForm.propTypes = {
    currentUser: PropTypes.object,
};