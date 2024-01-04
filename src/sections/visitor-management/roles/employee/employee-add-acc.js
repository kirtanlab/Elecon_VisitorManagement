/* eslint-disable */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, AlertTitle} from '@mui/lab';
// import { AlertTitle } from '@mui/lab';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// assets
import { countries } from 'src/assets/data';
import { roles } from 'src/assets/data/roles';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import axios from 'axios';
import { useVisitorContext } from 'src/context/visitor_context';


// ----------------------------------------------------------------------
// eslint-disable-next-line react/jsx-no-constructed-context-values
export default function AddAccView({ currentUser }) {
  const router = useRouter();

  const [done, setDone] = useState(false);
  const {visitorId} = useVisitorContext();

  const NewAccSchema = Yup.object().shape({
    acc_name: Yup.string().required('Accessory name is required'),
    acc_type: Yup.string().required('Accessory type is required'),
    model_no: Yup.string().required('Model no is required'),
    is_returnable: Yup.string().required('Returnable is required'),
    
    
  });

  const defaultValues = useMemo(
    () => ({
        acc_name: currentUser?.acc_name || '',
        acc_type: currentUser?.acc_type || '',
        model_no: currentUser?.model_no || '',
        is_returnable: currentUser?.is_returnable || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewAccSchema),
    defaultValues,
  });

  const {
    reset,
    // watch,
    // control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

//   const values = watch();


  const onSubmit = handleSubmit(async (data) => {
    try {
        console.log("here in onsubmit ", data);
        const URL = `http://localhost:5000/api/v1/visitor/${visitorId}/addAccessories`
        const accessory = await axios.post(URL, {
            acc_name:data.acc_name,
            acc_type:data.acc_type,
            model_no:data.model_no,
            is_returnable: ((data.is_returnable === 'YES') ? true: false)
        })
        setDone(true);
        reset();      
    } catch (error) {
      alert("something went wrong");
      console.error(error);
    }
    // reset();
    
  });


  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
        
      <Grid container spacing={2}>
        <Grid xs={12} md={1}>
        </Grid>

        <Grid xs={12} md={10}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="acc_name" label="Accessory Name *" />
              <RHFTextField name="acc_type" label="Accessory Type *"/>
              <RHFTextField name="model_no" label="Model Number *" />

              <RHFAutocomplete
                name="is_returnable"
                label="Returnable *"
                options={['YES', 'NO']}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const label = ['YES', 'NO'].filter(
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
                
            
            </Box>
            {
                done && <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                Accessories has been created <strong>check it out!</strong>
              </Alert>
            }

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Add Accessory' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

AddAccView.propTypes = {
  currentUser: PropTypes.object,
};
