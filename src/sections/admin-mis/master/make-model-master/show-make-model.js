/* eslint-disable */
import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemButton, { listItemButtonClasses } from '@mui/material/ListItemButton';
// components
import axios from 'axios';
import { LinearProgress } from '@mui/material';
import { useAdminMISContext } from 'src/context/admin_mis_context';

// ----------------------------------------------------------------------

export default function ShowMakeModelDetails() {
  const [vendor, setVendor] = useState(null);
  const { itemMasterId } = useAdminMISContext();

  const getVendor = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/makeAndModel/${itemMasterId}`;
      const res = await axios.get(URL);
      console.log('specific vendor', res);

      const tempVendor = [];
      const got = res.data.data;
      for (const key in got) {
        if (
          key === '_id' ||
          key === '__v' ||
          key === 'visitors' ||
          key === 'created_date' ||
          key === 'created_by' ||
          key === 'updated_date' ||
          key === 'updated_by' ||
          key === 'deleted_date' ||
          key === 'deleted_by'
        ) {
          continue;
        } else {
          if (got[key] === '') {
            tempVendor.push({ key: key, value: '-----' });
          } else {
            if (key === 'company') tempVendor.push({ key: key, value: got[key]['company_name'] });
            // console.log(got[key]["company_name"])
            else if (key === 'division')
              tempVendor.push({ key: key, value: got[key]['division_name'] });
            else if (key === 'department')
              tempVendor.push({ key: key, value: got[key]['department_name'] });
            else tempVendor.push({ key: key, value: got[key] });
          }
        }
      }
      // console.log("temp Vendor", tempVendor);
      setVendor(tempVendor);
    } catch (err) {
      alert('something went wrong');
      console.log(err);
    }
  };

  useEffect(() => {
    getVendor();
  }, []);

  return (
    <Stack
      spacing={0.5}
      sx={{
        p: 0.5,
        maxHeight: 80 * 8,
        // overflowX: 'hidden',
      }}
    >
      {vendor ? (
        vendor.map((atr, index) => {
          return (
            <Stack
              key={index}
              spacing={0.5}
              component={ListItemButton}
              sx={{
                py: 1,
                px: 1.5,
                borderRadius: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">{atr?.key}</Typography>
              </Stack>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {atr?.value}
              </Typography>
            </Stack>
          );
        })
      ) : (
        <LinearProgress />
      )}
    </Stack>
  );
}

ShowMakeModelDetails.propTypes = {};
