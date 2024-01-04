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

export default function ShowDepartmentDetails() {
  const [department, setDepartment] = useState(null);
  const { itemMasterId } = useAdminMISContext();

  const getDepartment = async () => {
    try {
      console.log('id is ', itemMasterId);
      const URL = `http://localhost:5000/api/v1/department/${itemMasterId}`;
      const res = await axios.get(URL);
      //   console.log('specific vendor', res);

      const tempDepartment = [];
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
          console.log('got', got);
          if (got[key] === '') {
            tempDepartment.push({ key: key, value: '-----' });
          } else {
            if (key === 'department')
              tempDepartment.push({ key: key, value: got[key]['department_name'] });
            else tempDepartment.push({ key: key, value: got[key] });
          }
        }
      }
      // console.log("temp Vendor", tempVendor);
      setDepartment(tempDepartment);
    } catch (err) {
      alert('something went wrong');
      console.log(err);
    }
  };

  useEffect(() => {
    getDepartment();
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
      {department ? (
        department.map((atr, index) => {
          console.log('atr', atr);
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

ShowDepartmentDetails.propTypes = {};
