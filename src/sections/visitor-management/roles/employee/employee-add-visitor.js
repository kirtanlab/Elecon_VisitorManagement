/* eslint-disable */
import PropTypes from "prop-types";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCallback, useMemo, useState } from "react";
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
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Dialog, { dialogClasses } from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
//dialog imports
// import Dialog from '@mui/material/Dialog';
import { useRef } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as icons from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Image, Button as button_bootstrap } from "react-bootstrap";

// ----------------------------------------------------------------------
// eslint-disable-next-line react/jsx-no-constructed-context-values
export default function AddVisitorView({ currentUser }) {
  const router = useRouter();
  const theme = useTheme();
  const [done, setDone] = useState(false);
  const { visitorId } = useVisitorContext();
  const currentDate = dayjs(Date.now());
  const [openCamera, setOpenCamera] = useState(false);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");

  const videoRef = useRef(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const defaultValues = useMemo(
    () => ({
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
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewVisitorSchema),
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

  const watchVisitType = watch("visit_type");

  // const convertToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader();
  //     fileReader.readAsDataURL(file);
  //     fileReader.onload = () => {
  //       resolve(fileReader.result);
  //     };
  //     fileReader.onerror = (error) => {
  //       reject(error);
  //     };
  //   });
  // };

  // const handleCamera = () => {
  //   return (
  //     <>
  //       <Dialog
  //         fullWidth
  //         maxWidth="xl"
  //         // open={flag.value}
  //         open={openCamera}
  //         onClose={() => {
  //           setOpenCamera(false);
  //         }}
  //         transitionDuration={{
  //           enter: theme.transitions.duration.shortest,
  //           exit: 0,
  //         }}
  //         PaperProps={{
  //           sx: {
  //             mt: 3,
  //             overflow: "unset",
  //           },
  //         }}
  //         sx={{
  //           [`& .${dialogClasses.container}`]: {
  //             alignItems: "flex-start",
  //           },
  //         }}
  //       >
  //         <Camera
  //           onTakePhoto={(dataUri) => {
  //             handleTakePhoto(dataUri);
  //           }}
  //         />
  //       </Dialog>
  //     </>
  //   );
  // };

  // const handleStartCamera = async () => {
  //   try {
  //     return (
  //       <>
  //         <Camera
  //           onTakePhoto={(dataUri) => {
  //             handleTakePhoto(dataUri);
  //           }}
  //         />
  //         ;
  //       </>
  //     );
  //   } catch (error) {
  //     console.error("Error accessing camera:", error);
  //   }
  // };

  //   const values = watch();
  // const handleDrop = useCallback(
  //   // async (acceptedFiles) => {
  //   //   const file = acceptedFiles[0];
  //   //   console.log("file", file);
  //   //   const newFile = await convertToBase64(file);
  //   //   console.log("here in drop", newFile);
  //   //   if (file) {
  //   //     setValue("id_proof", newFile, { shouldValidate: true });
  //   //   }
  //   //   setOpen(false);
  //   // },
  //   // [setValue]

  // );

  const fileInputRef = useRef(null);

  const handleDrop = () => {
    // Trigger a click on the input element to open the file dialog
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    // Check if a file is selected
    if (file) {
      // Check file size (max size 3.1 MB)
      if (file.size > 3.1 * 1024 * 1024) {
        alert("File size exceeds the maximum limit of 3.1 MB");
        return;
      }

      const reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (e) => {
        // e.target.result contains the base64-encoded image data
        const base64Data = e.target.result;

        // Perform further actions with the base64Data if needed

        // Example: Log the base64 data to the console
        console.log(base64Data);
        setOpen(false);
        setImage(base64Data);
      };

      // Read in the image file as a data URL.
      reader.readAsDataURL(file);
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const onSubmit = handleSubmit(async (data) => {
    console.log("on submit called", data);
    try {
      const emp_id = sessionStorage.getItem("id");
      console.log(emp_id);
      const URL = `http://localhost:5000/api/v1/visitor/createVisitor`;
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
  function handleTakePhoto(dataUri) {
    console.log("takePhoto", dataUri);
    setOpen(false);
    setImage(dataUri);
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Box sx={{ mt: 4, height: 200, width: 200 }}>
          {image && (
            <div style={{ position: "relative", flexDirection: "column" }}>
              <Image
                style={{ height: 200, width: 200, borderRadius: 10 }}
                src={image}
                alt="Uploaded Image"
              />
            </div>
          )}
          {!image ? (
            <Button
              onClick={handleClickOpen}
              component="label"
              variant="outlined"
              style={{
                flexDirection: "column",
                paddingTop: 10,
                marginTop: 20,
                marginLeft: 10,
                alignContent: "center",
              }}
              startIcon={<icons.CloudUpload fontSize="large" />}
            >
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  mx: "auto",
                  display: "block",
                  textAlign: "center",
                  color: "text.disabled",
                }}
              >
                Upload your Id proof here
                <br /> max size of {fData(3145728)}
              </Typography>
              {/* <VisuallyHiddenInput type="file" /> */}
            </Button>
          ) : (
            <Button
              component="label"
              variant="outlined"
              style={{
                flexDirection: "column",
                paddingTop: 10,
                marginTop: 20,
                marginLeft: 18,
                color: "red",
                alignContent: "center",
              }}
              onClick={() => {
                setImage("");
              }}
              startIcon={<icons.Delete fontSize="large" />}
            >
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  mx: "auto",
                  display: "block",
                  textAlign: "center",
                  color: "text.disabled",
                }}
              >
                Delete Uploaded Image
              </Typography>
            </Button>
          )}
        </Box>
        {/* </Grid> */}
        <Dialog
          // fullWidth
          maxWidth="xl"
          // open={flag.value}
          open={openCamera}
          isFullscreen={true}
          onClose={() => {
            setOpenCamera(false);
          }}
          transitionDuration={{
            enter: theme.transitions.duration.shortest,
            exit: 0,
          }}
          PaperProps={{
            sx: {
              mt: 3,
              padding: 1,
              // paddingTop: 6,
              // paddingTop: 1,
              // position: "fixed",

              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // overflow: "unset",
            },
          }}
          sx={{
            [`& .${dialogClasses.container}`]: {
              alignItems: "flex-start",
            },
          }}
        >
          <Camera
            onCameraError={() => {
              setOpenCamera(false);
              alert("Problem with camera");
              setOpen(true);
            }}
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);

              setOpenCamera(false);
            }}
          />
        </Dialog>
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
                      {label}
                    </li>
                  );
                }}
              />
              <RHFTextField name="entry_gate" label="Entry Gate *" />
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
                    minDate={currentDate}
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

              {watchVisitType === "multiple" && (
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
                      minDate={currentDate}
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
              )}
            </Box>
            {done && (
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Visitor has been added!
              </Alert>
            )}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!currentUser ? "Add Visitor" : "Save Changes"}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Please Upload Photo of Visitor"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            select camera or upload file accrodingly
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenCamera(true);
            }}
          >
            Open Camera
          </Button>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <Button onClick={handleDrop} autoFocus>
            Upload File
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

AddVisitorView.propTypes = {
  currentUser: PropTypes.object,
};
