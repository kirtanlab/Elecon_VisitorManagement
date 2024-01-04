/* eslint-disable */

const admin_mid_reducer = (state, action) => {

    if(action.type === "TOGGLE_ADD_DEPARTMENT_FLAG"){
        return {...state, addDepartmentFlag: !state.addDepartmentFlag}
    }

    if(action.type === "SET_ITEM_MASTER_ID"){
        return {...state, itemMasterId: action.payload}
    }

    if(action.type === "SET_FORM_MASTER_FLAG"){
        return {...state, formMasterFlag: action.payload}
    }

    if(action.type === "SET_EDIT_MASTER_FLAG"){
        return {...state, editMasterFlag: action.payload}
    }

    if(action.type === "SET_SHOW_MASTER_FLAG"){
        return {...state, showMasterFlag: action.payload}
    }

    if(action.type === "SET_DELETE_MASTER_FLAG"){
        return {...state, deleteMasterFlag: action.payload}
    }
    if(action.type === "SET_EDIT_TRANSACTION_FLAG"){
        return {...state, editTransactionFlag: action.payload}
    }
    if(action.type === "SET_SHOW_TRANSACTION_FLAG"){
        return {...state, showTransactionFlag: action.payload}
    }
    if(action.type === "SET_DELETE_TRANSACTION_FLAG"){
        return {...state, deleteTransactionFlag: action.payload}
    }



    return state;
}

export default admin_mid_reducer;