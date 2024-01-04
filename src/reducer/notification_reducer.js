/* eslint-disable */


const notification_reducer = (state, action) => {

    if(action.type === "SET_TOTAL_COUNT"){
        return {...state, totalCount: action.payload}
    }
    if(action.type === "SET_READ_COUNT"){
        return {...state, readCount: action.payload}
    }
    if(action.type === "SET_UNREAD_COUNT"){
        return {...state, unreadCount: action.payload}
    }
    if(action.type === "SET_NOTIFICATIONS"){
        return {...state, notifications: action.payload}
    }
    if(action.type === "TOGGLE_NFLAG"){
        return {...state, nflag: !state.nflag}
    }
    if(action.type === "SET_NOTIFICATION_ID"){
        return {...state, notificationid: action.payload}
    }

    return state;

}


export default notification_reducer;