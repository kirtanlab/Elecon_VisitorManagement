/* eslint-disable */
import React, {useContext, useReducer} from "react";
import dayjs, {Dayjs} from 'dayjs';
import reducer from "../reducer/visitor_reducer"

const initialState = {
    // employee
    visitorId: "",
    editFlag: false,
    addAccFlag: false,
    showAccFlag: false,
    addVisitorFlag: false,
    deleteVisitorFlag: false,
    editVisitorFlag: false,
    showDetailsVisitorFlag: false,
    otp: "",
    username: "",
    name: "",
    // for admin
    empId: "",
    addEmpFlag: false,
    editEmpFlag: false,
    deleteEmpFlag: false,
    showEmpDetailsFlag: false,
    adminVisitorDate:dayjs(Date.now()),
    // gate user
    editVisitorFlagGateUser: false,
    addAccFlagGateUser: false,
    showAccFlagGateUser: false,
    inGateUser: false,
    outGateUser: false,

}

const VisitorContext = React.createContext()

export const VisitorProvider = ({children}) => {
    const [state, dispath] = useReducer(reducer, initialState);

    const setEditFlag = (val) => {
        dispath({type: "SET_EDIT_FLAG", payload:val})

    }
    const setAddAccFlag = (val) => {
        dispath({type: "SET_ADD_ACC_FLAG", payload:val})

    }
    const setShowAccFlag = (val) => {
        dispath({type: "SET_SHOW_ACC_FLAG", payload:val})

    }

    const setVisitorId = (val) => {
        dispath({type: "SET_VISITOR_ID", payload: val})
    }

    const setAddVisitorFlag = (val) => {
        dispath({type: "SET_ADD_VISITOR_FLAG", payload: val})
    }

    const deleteVisitorToggle = () => {
        dispath({type: "DELETE_VISITOR_TOGGLE"});
    }

    const setEditVisitorFlag = (val) => {
        dispath({type: "SET_EDIT_VISITOR_FLAG", payload: val})
    }


    const setShowDetailsVisitorFlag = (val) => {
        dispath({type: "SET_SHOW_DETAILS_VISITOR_FLAG", payload: val});
    }

    const setOtp = (val) => {
        dispath({type: "SET_OTP", payload:val})
    }

    const setUsername = (val) => {
        console.log("what is val ", val);
        dispath({type: "SET_USERNAME", payload: val})
    }

    const setName = (val) => {
        dispath({type: "SET_NAME", payload: val});
    }

    const setEmpId = (val) => {
        dispath({type: "SET_EMP_ID", payload: val})
    }

    const setAddEmpFlag = (val) => {
        dispath({type: "SET_ADD_EMP_FLAG", payload: val})
    }
    const setEditEmpFlag = (val) => {
        dispath({type: "SET_EDIT_EMP_FLAG", payload: val})
    }
    const setDeleteEmpFLag = (val) => {
        dispath({type: "SET_DELETE_EMP_FLAG", payload: val})
    }
    const setEmpShowDetailsFlag = (val) => {
        dispath({type: "SET_EMP_SHOW_DETAILS_FLAG", payload: val})
    }

    const setEditVisitorFlagGateUser = (val) => {
        dispath({type: "SET_EDIT_VISITOR_FLAG_GATEUSER", payload: val})
    }

    const setAddAccFlagGateUser = (val) => {
        dispath({type: "SET_ADD_ACC_FLAG_GATEUSER", payload: val})
    }

    const setShowAccFlagGateUser = (val) => {
        dispath({type: "SET_SHOW_ACC_FLAG_GATEUSER", payload: val})
    }

    const setInGateUser = (val) => {
        dispath({type: "IN_GATEUSER"})
    }

    const setOutGateUser = (val) => {
        dispath({type: "OUT_GATEUSER"})
    }

    const setAdminVisitorDate = (val) => {
        dispath({type: "SET_ADMIN_VISITOR_DATE", payload: val})
    }

    return (
        <VisitorContext.Provider value={{...state, setShowDetailsVisitorFlag, setEmpShowDetailsFlag, setDeleteEmpFLag, setEditEmpFlag, setOtp,setEmpId,  setAddEmpFlag, setName, setUsername, setEditFlag, setAddAccFlag, setShowAccFlag, setVisitorId, setAddVisitorFlag, deleteVisitorToggle, setEditVisitorFlag,setEditVisitorFlagGateUser,setAddAccFlagGateUser,setShowAccFlagGateUser,setInGateUser,setOutGateUser, setAdminVisitorDate}}>
            {children}
        </VisitorContext.Provider>
    )
}

export const useVisitorContext = () => {
    return useContext(VisitorContext);
}