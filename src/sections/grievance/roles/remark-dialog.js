import { Button, Dialog, DialogActions, DialogTitle, LinearProgress, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import PropTypes from 'prop-types';
import axios from "axios";
import { useGrievanceContext } from 'src/context/grievance_context';
import { useRef, useState } from "react";

export function RemarkDialog({
    open,
    onClose,
    row,
  }) {

    const { _id ,title, message, by_whom_id, grievance_date, status,} = row;
    const [apiCalled, setApiCalled] = useState(false);
    const textFieldRef = useRef(null);
    
    const { approvedFlag, setApprovedFlag, declinedFlag, setDeclinedFlag, setComplaintId, viewGrievanceFlag, setViewGrievanceFlag} = useGrievanceContext();

    const onApproved = async() => {
      try{
        const remarks = textFieldRef.current.value;
        console.log("is remark dialog");
        setApiCalled(true);
        const res = await axios.post(`http://localhost:5000/api/v1/grievance/${_id}/approve`,{"remarks": remarks})
        console.log('approved API', res)
        setApprovedFlag(true);
        setApiCalled(false);
        // alert(`${by_whom_id.emp_name} 's complaint has been approved`)
      }
      catch{
        alert('something went wrong in approve process')
      }
          
      }

    return (
      <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
        <DialogTitle>Approval Remarks</DialogTitle>
  
        <Stack spacing={3} sx={{ px: 3 }}>
          <TextField label="Remarks *" name="remark" fullWidth multiline rows={3} placeholder="Enter the grievance approval remarks here" inputRef={textFieldRef}/>
        </Stack>
  
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
  
          <Button variant="contained" onClick={async ()=>{ await onApproved(); onClose();}}>
            Confirm 
          </Button>
        </DialogActions>
        {apiCalled && <LinearProgress />}
      </Dialog>
    );
  }
  
 RemarkDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    row: PropTypes.object,
  };
  