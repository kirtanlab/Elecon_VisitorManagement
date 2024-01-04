/* eslint-disable */
import { m } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _notifications } from 'src/_mock';
// components
import { LinearProgress } from '@mui/material';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
//
import NotificationItem from './notification-item';
import { useNotificationContext } from 'src/context/notification_context';
import axios from 'axios';

// ----------------------------------------------------------------------

// const TABS = [
//   {
//     value: 'all',
//     label: 'All',
//     count: 22,
//   },
//   {
//     value: 'unread',
//     label: 'Unread',
//     count: 12,
//   },
//   {
//     value: 'read',
//     label: 'Read',
//     count: 12,
//   }
// ];

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const drawer = useBoolean();

  const smUp = useResponsive('up', 'sm');

  const [currentTab, setCurrentTab] = useState('all');
  const [TABS, setTABS] = useState([])

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  // const [notifications, setNotifications] = useState(_notifications);
  const {notifications, setNotifications, nflag} = useNotificationContext()
  // const {totalCount, readCount, unreadCount, setTotalCount, setReadCount, setUnreadCount, notifications, setNotifications} = useNotificationContext()



  const getCounts = async() => {
    try{
      const emp_id = sessionStorage.getItem("id");
      if(emp_id === "null"){
        console.log("emp not found", emp_id);
        setTABS([
          {value:"all", label: "All", count:0},
          {value:"read", label: "Read", count:0},
          {value:"unread", label: "Unread", count:0},
  
        ])
      }
      else{
        console.log("emp found");
        const r1 = await axios.get(`http://localhost:5000/api/v1/notification/all/${emp_id}`);
        const r2 = await axios.get(`http://localhost:5000/api/v1/notification/read/${emp_id}`);
        const r3 = await axios.get(`http://localhost:5000/api/v1/notification/unread/${emp_id}`);
        setTABS([
          {value:"all", label: "All", count:r1?.data?.count},
          {value:"read", label: "Read", count:r2?.data?.count},
          {value:"unread", label: "Unread", count:r3?.data?.count},
  
        ])

      }
    }
    catch(err){
      console.log(err);
    }
  }

  // get curr Notification

  const getNotifications = async() => {
    try{  
      const emp_id = sessionStorage.getItem("id");
      console.log("what is emp_id : " ,emp_id);
      if(emp_id === "null"){

      }
      else{
        const URL = `http://localhost:5000/api/v1/notification/${currentTab}/${emp_id}` 
        const res = await axios.get(URL)
        console.log("got notification", res?.data?.data);
        setNotifications(res?.data?.data);

      }
    }
    catch(err){
      console.log(err);
    }
  }


  // const iconClick = () => {



  //   drawer.onTrue()
  // }
  

   

  useEffect(() => {
    getCounts()
    getNotifications()

  }, [])

  useEffect(() => {
    getCounts()
    getNotifications()
  }, [currentTab, nflag])

  // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  // const handleMarkAllAsRead = () => {
  //   setNotifications(
  //     notifications.map((notification) => ({
  //       ...notification,
  //       isUnRead: false,
  //     }))
  //   );
  // };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {/* {!!totalUnRead && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )} */}
    </Stack>
  );

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {TABS ? TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={
                (tab.value === 'unread' && 'info') ||
                (tab.value === 'read' && 'success') ||
                'default'
              }
            >
              {tab.count}
            </Label>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      )) : <LinearProgress/>}
    </Tabs>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {notifications ? notifications.map((notification) => (
          <NotificationItem key={notification._id} notification={notification} />
        )) : <LinearProgress/>}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={0} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2.5, pr: 1 }}
        >
          {renderTabs}
          {/* <IconButton onClick={handleMarkAllAsRead}>
            <Iconify icon="solar:settings-bold-duotone" />
          </IconButton> */}
        </Stack>

        <Divider />

        {renderList}
      </Drawer>
    </>
  );
}
