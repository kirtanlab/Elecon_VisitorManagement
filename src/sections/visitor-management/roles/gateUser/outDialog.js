import { Button, Checkbox, Dialog, DialogActions, DialogTitle, FormControlLabel, LinearProgress, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import PropTypes from 'prop-types';
import axios from "axios";
import { useVisitorContext } from "src/context/visitor_context";
import { useRef, useState } from "react";
import Label from "src/components/label";

export function OutDialog({
    open,
    onClose,
    row,
  }) {

    const { setOutGateUser,} = useVisitorContext();
    const [apiCalled, setApiCalled] = useState(false);
    const [accChecked, setAccChecked] = useState(false);
    const textFieldRef = useRef(null);

    const visitorOut = async() => {
      
        try{
          setApiCalled(true)
          const res = await axios.post(`http://localhost:5000/api/v1/visitor/${row._id}/outTime`)
        //   console.log('visitor is out api call',res)
  
          await axios.post(`http://localhost:5000/api/v1/notification`, {
            title: `Notification for Visitor Management`,
            message: `${row.name} has exited`,
            sender_id: sessionStorage.getItem("id"),
            receiver_id: row.to_whom_id
          })

          const remark = textFieldRef.current.value ? textFieldRef.current.value : "Visitor has left.";
          console.log(remark)
          setOutGateUser();
          setApiCalled(false)
          // alert(`${row.name} has exited and notification has been sent to the employee`)
        }
        catch(err){
          alert("something went wrong");
          console.log(err);
        }
  
      }

    return (
      <Dialog open={open} fullWidth maxWidth="xs" onClose={()=>{setAccChecked(false); onClose();}}>
        <DialogTitle>Visitor left</DialogTitle>
  
        <Stack spacing={3} sx={{ px: 3 }}>
          <TextField label="Remarks *" name="remark" fullWidth multiline rows={3} placeholder="Visitor has left..." inputRef={textFieldRef}/>
          <FormControlLabel 
            control={<Checkbox onChange={(e)=>setAccChecked(e.target.checked)} />} 
            label="Accessories are checked."
          />
        </Stack>
  
        <DialogActions>
          <Button onClick={()=>{setAccChecked(false); onClose();}}>Cancel</Button>
  
          <Button variant="contained" onClick={async ()=> { await visitorOut(); onClose();}} disabled={!accChecked}>
            Confirm 
          </Button>
        </DialogActions>
        {apiCalled && <LinearProgress />}
      </Dialog>
    );
  }
  
  OutDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    row: PropTypes.object,
  };
  