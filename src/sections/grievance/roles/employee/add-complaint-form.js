/* eslint-disable */
import PropTypes from 'prop-types';
import { useMemo, React, useState } from 'react';
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
import axios from 'axios';

export default function AddComplaintForm({ currentUser }) {

    const settings = useSettingsContext();

    const {user} = useAuthContext();

    const [done, setDone] = useState(false);

    const NewGrievanceSchema = Yup.object().shape({
        title: Yup.string().required('title is required'),
        grievance_type: Yup.string().required('Type is required'),
        description: Yup.string().matches(/^.{30,}$/,'complaint must have atleast 30 characters').required('description is required'),
    });

    const defaultValues = useMemo(
        () => ({
            title: currentUser?.title || '',
            grievance_type: currentUser?.grievance_type || '',
            description: currentUser?.description || '',
            // dateOfOccurrence: currentUser?.dateOfOccurrence || dayjs(Date.now())
        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(NewGrievanceSchema),
        defaultValues,
    });

    const grievance_types = [
      {label: "Type 1"},
      {label: "Type 2"},
      {label: "Type 3"},
      {label: "Type 4"},
      {label: "Type 5"}
    ]

    const {
        reset,
        // watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;


    const onSubmit = handleSubmit(async (data) => {
  
        try {
            const res = await axios.post(`http://localhost:5000/api/v1/grievance/${user._id}`,{"title": data.title, "message": data.description, grievance_type: data.grievance_type})
            console.log("------------------------8",res)
            setDone(true);
            reset();
        } catch (error) {
            console.log(error,'******* error in create complaint')
        }

    });
   

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
        
        <Grid container spacing={2}>
          <Grid xs={12} md={1}>
          </Grid>
  
          <Grid container xs={12} md={10} sx={{marginTop:5,}} justifyContent={'center'}>
            <Card sx={{ p: 3 ,  width:'80%', }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                // gridTemplateColumns={{
                //   xs: 'repeat(1, 1fr)',
                //   sm: 'repeat(2, 1fr)',
                // }}
              >
                <RHFTextField name="title" label="Title of Complaint *" />
                <RHFAutocomplete
                  name="grievance_type"
                  label="Grievance Type"
                  options={grievance_types.map((ac) => ac.label)}
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderOption={(props, option) => {
                    const { label } = grievance_types.filter((ac) => {
                      return ac.label === option;
                    })[0];

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
                <RHFTextField name="description" label="Description *"  multiline rows={4}/>  
              
              </Box>
              {
                  done && <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Complaint has been registered <strong>done!</strong>
                  </Alert>
              }
  
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentUser ? 'Add Complaint' : 'Save Changes'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
}

AddComplaintForm.propTypes = {
    currentUser: PropTypes.object,
};