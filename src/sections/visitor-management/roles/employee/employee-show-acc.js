/* eslint-disable */
import { Container, Grid, LinearProgress } from "@mui/material";
import { _bookings} from "src/_mock";
import { useSettingsContext } from "src/components/settings";
import { useEffect, useState } from "react";
import axios from "axios";
import AccDetails from "./acc-details-table";
import { useVisitorContext } from "src/context/visitor_context";


export default function ShowAccView(){
    const {visitorId} = useVisitorContext()
    const [currAcc, setCurrAcc] = useState(null)

    const getAllAccessories = async() => {
        try{    
            const URL =`http://localhost:5000/api/v1/visitor/${visitorId}/getAccessories`
            console.log("url is :", URL)
            
            const res = await axios.get(URL)
            console.log("here in get All acc response", res)
            setCurrAcc(res.data.data);
        }
        catch(err){
            alert("something went wrong");
            console.log(err)
        }
    }

    useEffect(() => {
        getAllAccessories()
    }, [])

    return (
        <Grid xs={12}>
            {
                currAcc ? 

              <AccDetails
                title="Accessory Details"
                tableData={currAcc}
                tableLabels={[
                  { id: 'acc_name', label: 'Accessory Name' },
                  { id: 'acc_type', label: 'Accessory Type' },
                  { id: 'model_no', label: 'Model Number' },
                  { id: 'is_returnable', label: 'Returnable' },
                ]}
                
              /> : <LinearProgress/>
            }
            </Grid>
    )

}