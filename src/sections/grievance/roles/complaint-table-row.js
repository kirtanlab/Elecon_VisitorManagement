/* eslint-disable */
import PropTypes from 'prop-types';
import { format } from 'date-fns';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
import Scrollbar from 'src/components/scrollbar';
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
import { CircularProgress, LinearProgress } from '@mui/material';
import ViewComplaintDialog from './view-complaint';
import { RemarkDialog } from './remark-dialog';
import { CloseRemarkDialog } from './close-remark-dialog';

// ----------------------------------------------------------------------

export default function ComplaintTableRow({ row, onViewRow }) {
  const { _id ,title, message, grievance_type, by_whom_id, grievance_date, status,} = row;

  const theme = useTheme();
  const confirm = useBoolean();
  const confirmClose = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const { approvedFlag, setApprovedFlag, declinedFlag, setDeclinedFlag, setComplaintId, viewGrievanceFlag, setViewGrievanceFlag} = useGrievanceContext();

  const[loaderOn, setLoaderOn] = useState(false);


  // const onApproved  = async() =>{
  //   try{
  //     setLoaderOn(true);
  //     const res = await axios.post(`http://localhost:5000/api/v1/grievance/${_id}/status`,{"status": "approved"})
  //     console.log('approved API', res)
  //     setApprovedFlag();
  //     setLoaderOn(false);
  //     // alert(`${by_whom_id.emp_name} 's complaint has been approved`)
  //   }
  //   catch{
  //     alert('something went wrong in approve process')
  //   }
  // }

  // const onDeclined  = async() =>{
  //   try{
  //     setLoaderOn(true);
  //     const res = await axios.post(`http://localhost:5000/api/v1/grievance/${_id}/status`,{"status": "declined"})
  //     console.log('declined API', res)
  //     setDeclinedFlag();
  //     setLoaderOn(false);
  //     // alert(`${by_whom_id.emp_name} 's complaint has been declined`)
  //   }
  //   catch{
  //     alert('something went wrong in declined process')
  //   }
  // }


  const renderComplaint = () => {
    return (
      <>
        <ViewComplaintDialog/>
      </>
    )
  }

  const renderPrimary = (
    <>
    <TableRow hover >
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

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
          {grievance_type}
        </Box>
      </TableCell>
      
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <Avatar alt={customer.name} src={customer.avatarUrl} sx={{ mr: 2 }} /> */}

        <ListItemText
          primary={by_whom_id?.emp_name}
          secondary={by_whom_id?.email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(grievance_date), 'dd MMM yyyy')}
          secondary={format(new Date(grievance_date), 'p')}
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

        {
          (sessionStorage.getItem("role") === "hod" && 
           status === 'pending')? 
          (<>
            <Button variant='outlined' color='primary' size='small' sx={{ml:3,fontSize:12,height:25,}} onClick={confirm.onTrue}>
                Approve
            </Button>
            <Button variant='outlined' color='error' size='small' sx={{ml:1,fontSize:12, height:25,}} onClick={confirmClose.onTrue}>
                Close
            </Button>
            {/* <IconButton color='primary' sx={{ml:4,}} onClick={onApproved}>
              <Iconify icon="ic:round-check-circle" color='primary'/> 
            </IconButton>
            <IconButton color='error' sx={{ml:3,}} onClick={onDeclined}>
              <Iconify icon="material-symbols:cancel-rounded" />
            </IconButton> */}
          </>
          ):(
            <></>
          ) 
        }
      {loaderOn && <LinearProgress sx={{mb:'-10%',mt:'10%'}}/>}
      </TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {/* <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton> */}

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>

    </>
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
            setComplaintId(row._id);
            setViewGrievanceFlag(true)
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

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
       <RemarkDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          row={row}
        />
        <CloseRemarkDialog
          open={confirmClose.value}
          onClose={confirmClose.onFalse}
          row={row}
        />

    </>
  );
}

ComplaintTableRow.propTypes = {
  row: PropTypes.object,
  by_whom_id : PropTypes.object,
  status : PropTypes.string,
  grievance_date : PropTypes.string,
  message : PropTypes.string,
  onViewRow: PropTypes.func,
};
