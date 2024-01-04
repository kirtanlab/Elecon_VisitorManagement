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

export default function ShowStaffVehicleBillDetails() {
  const [hotel, setHotel] = useState(null);
  const { itemMasterId } = useAdminMISContext();

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
    }

  const getHotel = async () => {
    try {
      const URL = `http://localhost:5000/api/v1/bill/makeAndModel/${itemMasterId}`;
      const res = await axios.get(URL);
      console.log('specific vendor', res);

      const tempHotel = [];
      const got = res.data.data;
      for (const key in got) {
        if (
          key === '_id' ||
          key === '__v' ||
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
            tempHotel.push({ key: key, value: '-----' });
          }
          else if(key === "purchase_date" || key === "issue_date" || key === "received_date" || key === "sale_date" || key === "cheque_date" || key === "transaction_date") {
            tempHotel.push({key: key, value: formatDate(got[key])})
          }
          else {
            tempHotel.push({key: key, value: got[key]})
          }
        }
      }
      // console.log("temp Vendor", tempVendor);
      setHotel(tempHotel);
    } catch (err) {
      alert('something went wrong');
      console.log(err);
    }
  };

  useEffect(() => {
    getHotel();
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
      {hotel ? (
        hotel.map((atr, index) => {
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

ShowStaffVehicleBillDetails.propTypes = {};
