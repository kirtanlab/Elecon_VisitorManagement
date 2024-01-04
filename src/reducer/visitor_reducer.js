/* eslint-disable */

const visitor_reducer = (state, action) => {

    if(action.type === "SET_EDIT_FLAG"){
        return {...state, editFlag: action.payload}
    }
    if(action.type === "SET_ADD_ACC_FLAG"){
        return {...state, addAccFlag: action.payload}

    }
    if(action.type === "SET_SHOW_ACC_FLAG"){
        return {...state, showAccFlag: action.payload}
    }
    if(action.type === "SET_VISITOR_ID"){
        return {...state, visitorId: action.payload}
    }
    if(action.type === "SET_ADD_VISITOR_FLAG"){
        return {...state, addVisitorFlag: action.payload}
    }
    if(action.type === "DELETE_VISITOR_TOGGLE"){
        return {...state, deleteVisitorFlag: !state.deleteVisitorFlag};
    }
    if(action.type === "SET_EDIT_VISITOR_FLAG"){
        return {...state, editVisitorFlag: action.payload};
    }
    if(action.type === "SET_OTP"){
        return {...state, otp: action.payload};
    }
    if(action.type === "SET_USERNAME"){
        console.log("here in action payload", action.payload);
        return {...state, username: action.payload};
    }
    if(action.type === "SET_NAME"){
        return {...state, name: action.payload};
    }
    if(action.type === "SET_EMP_ID"){
        return {...state, empId: action.payload};
    }
    if(action.type === "SET_ADD_EMP_FLAG"){
        console.log("called set add emp flag")
        console.log(action.payload);
        return {...state, addEmpFlag: action.payload};
    }
    if(action.type === "SET_EDIT_EMP_FLAG"){
        return {...state, editEmpFlag: action.payload};
    }
    if(action.type === "SET_DELETE_EMP_FLAG"){
        return {...state, deleteEmpFlag: action.payload};
    }
    if(action.type === "SET_SHOW_DETAILS_VISITOR_FLAG"){
        return {...state, showDetailsVisitorFlag: action.payload};
    }
    if(action.type === "SET_EMP_SHOW_DETAILS_FLAG"){
        return {...state, showEmpDetailsFlag: action.payload};
    }

    if(action.type === "SET_EDIT_VISITOR_FLAG_GATEUSER"){
        return {...state, editVisitorFlagGateUser: action.payload};
    }
    if(action.type === "SET_ADD_ACC_FLAG_GATEUSER"){
        return {...state, addAccFlagGateUser: action.payload};
    }
    if(action.type === "SET_SHOW_ACC_FLAG_GATEUSER"){
        return {...state, showAccFlagGateUser: action.payload};
    }
    if(action.type === "IN_GATEUSER"){
        return {...state, inGateUser: !state.inGateUser};
    }
    if(action.type === "OUT_GATEUSER"){
        return {...state, outGateUser: !state.outGateUser};
    }
    if(action.type === "SET_ADMIN_VISITOR_DATE"){
        return {...state, adminVisitorDate: action.payload};
    }

    return state;

}

export default visitor_reducer;