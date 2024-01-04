import { Button, Dialog, DialogActions, DialogTitle, LinearProgress, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import PropTypes from 'prop-types';
import axios from "axios";
import { useVisitorContext } from "src/context/visitor_context";
import { useRef, useState } from "react";

export function InDialog({
    open,
    onClose,
    row,
  }) {

    const { setInGateUser,} = useVisitorContext();
    const [apiCalled, setApiCalled] = useState(false);
    const textFieldRef = useRef(null);

    const visitorIn = async() => {
        try{
          setApiCalled(true)
          const res = await axios.post(`http://localhost:5000/api/v1/visitor/${row._id}/inTime`)
          // console.log('visitor is in api call',res)
  
        await axios.post(`http://localhost:5000/api/v1/notification`, {
            title: `Notification for Visitor Management`,
            message: `${row.name} is entered into the company`,
            sender_id: sessionStorage.getItem("id"),
            receiver_id: row.to_whom_id
          })

          const remark = textFieldRef.current.value ? textFieldRef.current.value : "Visitor has entered.";
          console.log(remark)
          setInGateUser();
          setApiCalled(false);
          // alert(`${row.name} has entered and notification has been sent to employee`)
          // onclose();
        }
        catch(err){
          alert("something went wrong");
          console.log(err);
        }
          
      }

    return (
      <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
        <DialogTitle>Visitor Entered</DialogTitle>
  
        <Stack spacing={3} sx={{ px: 3 }}>
          <TextField label="Remarks *" name="remark" fullWidth multiline rows={3} placeholder="Visitor has entered..." inputRef={textFieldRef}/>
        </Stack>
  
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
  
          <Button variant="contained" onClick={async ()=>{ await visitorIn(); onClose();}}>
            Confirm 
          </Button>
        </DialogActions>
        {apiCalled && <LinearProgress />}
      </Dialog>
    );
  }
  
  InDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    row: PropTypes.object,
  };
  