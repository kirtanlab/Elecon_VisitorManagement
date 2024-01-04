import { Button, Dialog, DialogActions, DialogTitle, LinearProgress, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import PropTypes from 'prop-types';
import axios from "axios";
import { useGrievanceContext } from 'src/context/grievance_context';
import { useRef, useState } from "react";

export function CloseRemarkDialog({
    open,
    onClose,
    row,
  }) {

    const { _id ,title, message, by_whom_id, grievance_date, status,} = row;
    const [apiCalled, setApiCalled] = useState(false);
    const textFieldRef = useRef(null);
    
    const { approvedFlag, setApprovedFlag, declinedFlag, setDeclinedFlag, setComplaintId, viewGrievanceFlag, setViewGrievanceFlag} = useGrievanceContext();

    const onClosure = async() => {
        try{

            const remarks = textFieldRef.current.value
            setApiCalled(true);
            const res = await axios.post(`http://localhost:5000/api/v1/requisition/${_id}/close`,{"remarks": remarks})
            console.log('declined API', res)
            setDeclinedFlag();
            setApiCalled(false);
            // alert(`${by_whom_id.emp_name} 's complaint has been declined`)
          }
          catch(err){
            console.log(err)
            alert('something went wrong in declined process')
          }
          
      }

    return (
      <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
        <DialogTitle>Closure Remarks</DialogTitle>
  
        <Stack spacing={3} sx={{ px: 3 }}>
          <TextField label="Remarks *" name="remark" fullWidth multiline rows={3} placeholder="Enter the grievance closure remarks here" inputRef={textFieldRef}/>
        </Stack>
  
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
  
          <Button variant="contained" onClick={async ()=>{ await onClosure(); onClose();}}>
            Confirm 
          </Button>
        </DialogActions>
        {apiCalled && <LinearProgress />}
      </Dialog>
    );
  }
  
 CloseRemarkDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    row: PropTypes.object,
  };
  