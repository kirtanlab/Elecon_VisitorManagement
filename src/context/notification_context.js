/* eslint-disable */
import React, {useEffect, useState, useContext, useReducer} from "react";
import reducer from "../reducer/notification_reducer"

const initialState = {
    totalCount: 0,
    readCount: 0,
    unreadCount: 0,
    notifications: null,
    nflag: false,
    notificationid: ""

}

const NotificationContext = React.createContext()

export const NotificationProvider = ({children}) => {
    const [state, dispath] = useReducer(reducer, initialState);

    const setTotalCount = (val) => {
        dispath({type: "SET_TOTAL_COUNT", payload:val})

    }
    const setReadCount = (val) => {
        dispath({type: "SET_READ_COUNT", payload:val})

    }
    const setUnreadCount = (val) => {
        dispath({type: "SET_UNREAD_COUNT", payload:val})

    }
    const setNotifications = (val) => {
        dispath({type: "SET_NOTIFICATIONS", payload:val})

    }

    const toggleFlag = () => {
        dispath({type: "TOGGLE_NFLAG"});
    }

    const setNotificationId = (val) => {
        dispath({type: "SET_NOTIFICATION_ID", payload: val});
    }
    
     
    return (
        <NotificationContext.Provider value={{...state, setTotalCount, setReadCount, setUnreadCount, setNotifications, toggleFlag, setNotificationId}}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotificationContext = () => {
    return useContext(NotificationContext);
}