/* eslint-disable */
import React, { useContext, useReducer } from "react";
import reducer from "../reducer/admin_mis_reducer"

const initialState = {
    addDepartmentFlag: false,

    // master add, edit, showdetail, delete flag
    itemMasterId: "", 

    formMasterFlag: false,
    editMasterFlag: false,
    showMasterFlag: false,
    deleteMasterFlag: false,


    editTransactionFlag: false,
    showTransactionFlag: false,
    deleteTransactionFlag: false,


}
 
const AdminMISContext = React.createContext()



export const AdminMISProvider = ({ children }) => {
    const [state, dispath] = useReducer(reducer, initialState);

    const toggleAddDepartmentFlag = () => {
        dispath({type: "TOGGLE_ADD_DEPARTMENT_FLAG"})
    }

    const setItemMasterId = (val) => {
        dispath({type: "SET_ITEM_MASTER_ID" , payload: val})
    }

    const setFormMasterFlag = (val) => {
        dispath({type: "SET_FORM_MASTER_FLAG" , payload: val})
    }

    const setEditMasterFlag = (val) => {
        dispath({type: "SET_EDIT_MASTER_FLAG" , payload: val})
    }

    const setShowMasterFlag = (val) => {
        dispath({type: "SET_SHOW_MASTER_FLAG" , payload: val})
    }

    const setDeleteMasterFlag = (val) => {
        dispath({type: "SET_DELETE_MASTER_FLAG" , payload: val})
    }


    const setEditTransactionFlag = (val) => {
        dispath({type: "SET_EDIT_TRANSACTION_FLAG" , payload: val})
    }
    const setShowTransactionFlag = (val) => {
        dispath({type: "SET_SHOW_TRANSACTION_FLAG" , payload: val})
    }
    const setDeleteTransactionFlag = (val) => {
        dispath({type: "SET_DELETE_TRANSACTION_FLAG" , payload: val})
    }

    return (
        <AdminMISContext.Provider value={{...state, setEditTransactionFlag, setShowTransactionFlag, setDeleteTransactionFlag, toggleAddDepartmentFlag, setItemMasterId, setFormMasterFlag, setEditMasterFlag, setShowMasterFlag, setDeleteMasterFlag}}>
            {children}
        </AdminMISContext.Provider>
    )
}

export const useAdminMISContext = () => {
    return useContext(AdminMISContext);
}
