/* eslint-disable */
import PropTypes from "prop-types";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, AlertTitle } from "@mui/lab";
import dayjs, { Dayjs } from "dayjs";
// import { AlertTitle } from '@mui/lab';
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
// utils
import { fData } from "src/utils/format-number";
// routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
// assets
import { countries } from "src/assets/data";
import { roles } from "src/assets/data/roles";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from "src/components/hook-form";
import axios from "axios";
import { useVisitorContext } from "src/context/visitor_context";
import { TextField } from "@mui/material";

// ----------------------------------------------------------------------
// eslint-disable-next-line react/jsx-no-constructed-context-values
export default function EditVisitorView() {
  const router = useRouter();

  const [done, setDone] = useState(false);
  const { visitorId } = useVisitorContext();
  const [currentUser, setCurrentUser] = useState({});

  const NewVisitorSchema = Yup.object().shape({
    id_proof: Yup.string(),
    name: Yup.string().required("Name is required"),
    email_id: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    phone_no: Yup.string()
      .matches(/^(\d{10})?$/, "Invalid Phone number")
      .required("Phome number is required"),
    gender: Yup.string().required("Gender is required"),
    entry_gate: Yup.string().required("Entry gate is required"),
    appointment_half: Yup.string().required("Appointment half is required"),
    is_professional: Yup.string().required("Is professional is required field"),
    purpose: Yup.string().required("Purpose is required"),
    guest_company: Yup.string(),
    place: Yup.string(),
    designation: Yup.string(),
    visit_type: Yup.string(),
    id_proof_number: Yup.string(),
    to_date: Yup.string().required("To date is required"),
    from_date: Yup.string().required("From date is required"),
  });

  const defaultValues = {
    name: currentUser?.name || "",
    phone_no: currentUser?.phone_no || "",
    email_id: currentUser?.email_id || "",
    gender: currentUser?.gender || "",
    is_professional: currentUser?.is_professional || "", // YES or NO
    designation: currentUser?.designation || "",
    guest_company: currentUser?.guest_company || "",
    id_proof: currentUser?.id_proof || "", // should be in image
    id_proof_number: currentUser?.id_proof_number || "",
    place: currentUser?.place || "",
    visit_type: currentUser?.visit_type || "", // single or multiple
    purpose: currentUser?.purpose || "",
    entry_gate: currentUser?.entry_gate || "",
    appointment_half: currentUser?.appointment_half || "", // first half or second half
    to_date: currentUser?.to_date || dayjs(Date.now()),
    from_date: currentUser?.from_date || dayjs(Date.now()),
    // emp_id and to_whon_id will be the user who is creating the visitor
  };
  const methods = useForm({
    resolver: yupResolver(NewVisitorSchema),
    defaultValues,
  });

  const {
    reset,
    // watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  //   const values = watch();
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      console.log("clicked");
      const file = acceptedFiles[0];

      const newFile = await convertToBase64(file);
      console.log("here in drop", newFile);
      if (file) {
        setValue("id_proof", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const getVisitor = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/visitor/${visitorId}`;
      const res = await fetch(URL);
      const resData = await res.json();
      console.log("here in get visitor ", resData);
      //   setCurrentUser(resData.data)
      setValue("name", resData.data.name, { shouldValidate: true });
      setValue("phone_no", resData.data.phone_no, { shouldValidate: true });
      setValue("email_id", resData.data.email_id, { shouldValidate: true });
      setValue("gender", resData.data.gender, { shouldValidate: true });
      setValue("is_professional", resData.data.is_professional ? "YES" : "NO", {
        shouldValidate: true,
      });
      setValue("guest_company", resData.data.guest_company, {
        shouldValidate: true,
      });
      setValue("designation", resData.data.designation, {
        shouldValidate: true,
      });
      setValue("place", resData.data.place, { shouldValidate: true });
      setValue("visit_type", resData.data.visit_type, { shouldValidate: true });
      setValue("purpose", resData.data.purpose, { shouldValidate: true });
      setValue("id_proof_number", resData.data.id_proof_number, {
        shouldValidate: true,
      });
      setValue("entry_gate", resData.data.entry_gate, { shouldValidate: true });
      setValue("appointment_half", resData.data.appointment_half, {
        shouldValidate: true,
      });
      setValue("to_date", dayjs(resData.data.to_date), {
        shouldValidate: true,
      });
      setValue("from_date", dayjs(resData.data.from_date), {
        shouldValidate: true,
      });
      setValue("id_proof", resData.data.id_proof, { shouldValidate: true });
    } catch (err) {
      alert("something went wrong");
      console.log(err);
    }
  };
  useEffect(() => {
    getVisitor();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    console.log("on submit called", data);
    try {
      const emp_id = sessionStorage.getItem("id");
      const URL = `http://localhost:5000/api/v1/visitor/${visitorId}/updateVisitor`;
      const visitor = await axios.post(URL, {
        name: data.name,
        phone_no: data.phone_no,
        email_id: data.email_id,
        gender: data.gender,
        is_professional: data.is_professional === "YES" ? true : false,
        designation: data.designation,
        id_proof: data.id_proof,
        id_proof_number: data.id_proof_number,
        place: data.place,
        visit_type: data.visit_type,
        purpose: data.purpose,
        guest_company: data.guest_company,
        entry_gate: data.entry_gate,
        appointment_half: data.appointment_half,
        to_date: formatDate(data.to_date),
        from_date: formatDate(data.from_date),
        emp_id: emp_id,
        to_whom_id: emp_id,
      });

      console.log("after request", visitor);
      setDone(true);
      reset();
    } catch (error) {
      alert("something went wrong");
      console.log("here in error in handle submit");
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={4}> */}
        <Box sx={{ mb: 5 }}>
          <RHFUploadAvatar
            name="id_proof"
            maxSize={3145728}
            onDrop={handleDrop}
            helperText={
              <Typography
                variant="caption"
                sx={{
                  mt: 3,
                  mx: "auto",
                  display: "block",
                  textAlign: "center",
                  color: "text.disabled",
                }}
              >
                Upload your Id proof here
                <br /> max size of {fData(3145728)}
              </Typography>
            }
          />
        </Box>
        {/* </Grid> */}

        <Grid xs={12} md={10}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField name="name" label="Visitor Name *" />
              <RHFTextField name="email_id" label="Email Address *" />
              <RHFTextField name="phone_no" label="Phone Number *" />

              <RHFAutocomplete
                name="gender"
                label="Gender *"
                options={["Male", "Female"]}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const label = ["Male", "Female"].filter(
                    (t) => t === option
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
              <RHFTextField name="entry_gate" label="Entry Gate" />
              <RHFAutocomplete
                name="appointment_half"
                label="Appointment half *"
                options={["first half", "second half"]}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const label = ["first half", "second half"].filter(
                    (t) => t === option
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
              <RHFAutocomplete
                name="is_professional"
                label="Is professional *"
                options={["YES", "NO"]}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const label = ["YES", "NO"].filter((t) => t === option)[0];

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
              <RHFTextField name="purpose" label="Purpose *" />
              <RHFTextField name="guest_company" label="Guest Company" />
              <RHFTextField name="place" label="Place" />
              <RHFTextField name="designation" label="Designation" />
              <RHFAutocomplete
                name="visit_type"
                label="Visit Type"
                options={["single", "multiple"]}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const label = ["single", "multiple"].filter(
                    (t) => t === option
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

              <RHFTextField name="id_proof_number" label="ID proof number" />

              <Controller
                name="to_date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="To Date *"
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
                name="from_date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="From Date *"
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
            {done && (
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                visitor has been updated <strong>check it out!</strong>
              </Alert>
            )}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {currentUser ? "Save Changes" : "NO"}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

EditVisitorView.propTypes = {};
