/* eslint-disable */

const grievance_reducer = (state, action) => {

    if(action.type === "SET_COMPLAINT_ID"){
        return {...state, complaintId: action.payload}
    }

    if(action.type === "SET_APPROVED_FLAG"){
        return {...state, approvedFlag: !state.approvedFlag}
    }

    if(action.type === "SET_DECLINED_FLAG"){
        return {...state, declinedFlag: !state.declinedFlag}
    }

    if(action.type === "SET_ADD_GRIEVANCE_FLAG"){
        return {...state, addGrievanceFlag: action.payload}
    }
    if(action.type === "SET_VIEW_GRIEVANCE_FLAG"){
        return {...state, viewGrievanceFlag: action.payload}
    }


    return state;
}

export default grievance_reducer;