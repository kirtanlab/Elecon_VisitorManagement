/* eslint-disable */
import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import axios from 'axios';
import { useEffect } from 'react';
// utils
import { fToNow } from 'src/utils/format-time';
// components
import Label from 'src/components/label';
import FileThumbnail from 'src/components/file-thumbnail';
import { useNotificationContext } from 'src/context/notification_context';

// ----------------------------------------------------------------------

export default function NotificationItem({ notification }) {
  
  const {toggleFlag} = useNotificationContext()
  function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }


  const handleRead = async(req, res) => {
      try{

        const URL = `http://localhost:5000/api/v1/notification/readNotification/${notification._id}`;
        const res = await axios.post(URL)
        toggleFlag();

      }
      catch(err){
        console.log(err);
      }
  }


  const renderText = (
    <ListItemText
      disableTypography
      // primary={reader(notification.title)} // who sent the notification with html 
      primary={reader(`<p><strong>${notification?.sender_id?.emp_name}</strong>  ${notification?.title}</p>`)} // who sent the notification with html 
      secondary={ // message of notification ?
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >
          {/* {timeSince(notification?.created_date)} */}
          {notification?.message}
          {/* hello this is temp notification */}
        </Stack>
      }
    />
  );



  const friendAction = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained" onClick={handleRead}>
        Clear
      </Button>
      {/* <Button size="small" variant="outlined">
        Cancel
      </Button> */}
    </Stack>
  );



  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      {/* {renderUnReadBadge} */}

      {/* {renderAvatar} */}

      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {notification?.is_read === false && friendAction}
      </Stack>
    </ListItemButton>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object,
};

// ----------------------------------------------------------------------

function reader(data) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
