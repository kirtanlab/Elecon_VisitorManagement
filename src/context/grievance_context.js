/* eslint-disable */
import React, { useContext, useReducer } from "react";
import reducer from "../reducer/grievance_reducer"

const initialState = {
    complaintId: "",
    approvedFlag: false,
    declinedFlag: false,
    addGrievanceFlag: false,
    viewGrievanceFlag: false,
}

const GrievanceContext = React.createContext()

export const GrievanceProvider = ({ children }) => {
    const [state, dispath] = useReducer(reducer, initialState);

    const toggleResendComplaint = () => {
        dispath({ type: "TOGGLE_RESEND_COMPLAINT" })
    }

    const toggleEscalateComplaint = () => {
        dispath({ type: "TOGGLE_ESCALATE_COMPLAINT" })
    }

    const toggleRemindComplaint = () => {
        dispath({ type: "TOGGLE_REMIND_COMPLAINT" })
    }

    const setComplaintId = (val) => {
        dispath({ type: "SET_COMPLAINT_ID", payload: val })
    }

    const setApprovedFlag = () => {
        dispath({ type: "SET_APPROVED_FLAG" })
    }

    const setDeclinedFlag = () => {
        dispath({ type: "SET_DECLINED_FLAG" })

    }

    const setAddGrievanceFlag = (val) => {
        dispath({ type: "SET_ADD_GRIEVANCE_FLAG", payload: val })
    }

    const setViewGrievanceFlag = (val) => {
        dispath({ type: "SET_VIEW_GRIEVANCE_FLAG", payload: val })
    }

    return (
        <GrievanceContext.Provider value={{ ...state, toggleResendComplaint, toggleEscalateComplaint, toggleRemindComplaint, setComplaintId, setApprovedFlag, setDeclinedFlag, setAddGrievanceFlag, setViewGrievanceFlag }}>
            {children}
        </GrievanceContext.Provider>
    )
}

export const useGrievanceContext = () => {
    return useContext(GrievanceContext);
}
