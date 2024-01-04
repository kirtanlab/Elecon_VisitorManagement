/* eslint-disable */
import PropTypes from 'prop-types';
import { differenceInMinutes, format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
// @mui
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
import Scrollbar from 'src/components/scrollbar';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useGrievanceContext } from 'src/context/grievance_context';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import axios from 'axios';
import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import ViewComplaintDialog from '../../view-complaint';
import { useAdminMISContext } from 'src/context/admin_mis_context';

// ----------------------------------------------------------------------

export default function ComplaintTableRowForEmp({ row, onViewRow }) {
  const { _id ,title, activity, employee, requisition_date, status, is_escalated, is_resend} = row;

  const theme = useTheme();
  const popover = usePopover();

  // colculation of time till complaint has fired 
  const startDate = new Date(requisition_date);
  const duration = differenceInMinutes(new Date(),startDate);
  // console.log('difference btn issue of complaint and now', duration);

  // const { approvedFlag, setApprovedFlag, declinedFlag, setDeclinedFlag,} = useGrievanceContext();
  const {viewGrievanceFlag, setViewGrievanceFlag, setComplaintId} = useGrievanceContext();
  const {toggleAddDepartmentFlag} = useAdminMISContext();

  const renderComplaint = () => {
    return (
      <>
        <ViewComplaintDialog/>
      </>
    )
  }

  const onResend = async() => {
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/requisition/update/${_id}/resend`)
      toggleAddDepartmentFlag()
      alert("Requisition resent")
    } catch (error) {
      console.log(error);
      alert("something went wrong in resend button");
    }
  }
  const onEscalate = async() => {
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/requisition/update/${_id}/escalate`)
      toggleAddDepartmentFlag()
      alert("Requisition escalated")
    } catch (error) {
      console.log(error);
      alert("something went wrong in escalate button")
    }
  }
  const onRemind = async() => {
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/requisition/update/${_id}/remind`)
      toggleAddDepartmentFlag()
      alert("Requisition Reminded")
    } catch (error) {
      console.log(error);
      alert("something went wrong in remind button");
    }
  }

  const renderPrimary = (
    <TableRow hover >
      
      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {title}
        </Box>
      </TableCell>
      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {activity}
        </Box>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(requisition_date), 'dd MMM yyyy')}
          secondary={format(new Date(requisition_date), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'approved' && 'success') ||
            (status === 'pending' && 'warning') ||
            (status === 'declined' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>

      </TableCell>

      {is_resend || (duration >= 1 && status === 'pending')?
      <TableCell>
        
        {is_resend?
        <Button variant='outlined' color='primary' size='small' sx={{ml:0,fontSize:12,height:25,}} disabled>
          Resent
        </Button> :
        <Button variant='outlined' color='primary' size='small' sx={{ml:0,fontSize:12,height:25,}} onClick={onResend}>
          Resend
        </Button>
        }

        {status === 'pending'?
        <Button variant='outlined' color='error' size='small' sx={{ml:2,fontSize:12, height:25,}} onClick={onEscalate}>
          Escalate
        </Button> :
        <Button variant='outlined' color='error' size='small' sx={{ml:2,fontSize:12, height:25,}} disabled>
          Escalate
        </Button> 
        }

        {status === 'pending'?
        <Button variant='outlined' color='warning' size='small' sx={{ml:2,fontSize:12, height:25,}} onClick={onRemind}>
          Remind
        </Button> :
        <Button variant='outlined' color='warning' size='small' sx={{ml:2,fontSize:12, height:25,}} disabled>
          Remind
        </Button>
        }
      </TableCell> : <div></div> }

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
       
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            setViewGrievanceFlag(true)
            setComplaintId(row._id);
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
        <Dialog
              fullWidth
              maxWidth="lg"
              open={viewGrievanceFlag}
              onClose={() => {setViewGrievanceFlag(false)}}
              transitionDuration={{
                enter: theme.transitions.duration.shortest,
                exit: 0,
              }}
              PaperProps={{
                sx: {
                  mt: 15,
                  overflow: 'unset',
                },
              }}
              sx={{
                [`& .${dialogClasses.container}`]: {
                  alignItems: 'flex-start',
                },
              }}
            >
              <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
                <InputBase
                  fullWidth
                  autoFocus
                  placeholder="Complaint"
                  value={''}
                  onChange={() => {
                    '';
                  }}
                  endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
                  inputProps={{
                    sx: { typography: 'h6' },
                  }}
                />
              </Box>

              <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>{renderComplaint()}</Scrollbar>
        </Dialog>
      </CustomPopover>

    </>
  );
}

ComplaintTableRowForEmp.propTypes = {
  row: PropTypes.object,
  by_whom_id : PropTypes.object,
  status : PropTypes.string,
  grievance_date : PropTypes.string,
  message : PropTypes.string,
  onViewRow: PropTypes.func,
};
