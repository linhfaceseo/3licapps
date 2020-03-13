import React, { Component } from "react";
import AppStateListener from "react-native-appstate-listener";
import { EventRegister } from "react-native-event-listeners";
import io from 'socket.io-client/dist/socket.io';
import Constants from "../utils/Constants";

export default class SocketListener extends Component {
    constructor(props) {
        super(props);

        this.socket = io('http://3lichat.us:8080');
    }

    componentWillUnmount() {
        if (this.trackignAdminOnline) {
            EventRegister.removeEventListener(this.trackignAdminOnline);
        }
    }

    componentDidMount() {
        /* Listener users online */
        this.socket.on('UserOnline', (data) => {
            console.tlog('SocketIOClient UserOnline', data);
            let usersOnline = [];
            if (data && data.listUserOnline) {
                usersOnline = data.listUserOnline;
            }

            EventRegister.emitEvent(Constants.APP_EVENT_KEY.IO_USERS_ONLINE, usersOnline);
        });

        /* Listener users offline */
        this.socket.on('UserOffline', (data) => {
            console.tlog('SocketIOClient UserOffline', data);
            if (data && data.User) {
                EventRegister.emitEvent(Constants.APP_EVENT_KEY.IO_USER_OFFLINE, data.User);
            }
        });


        this.socket.on("needSendMessage", (data) => {

            console.tlog('SocketIOClient needSendMessage DATA', data);
            /*data: {
                "sendID": 1
            }*/

            // If already logged-in and app in foreground -> Do not send pns to notify
            if (Constants.userInfo && !Constants.appInBackground) {
                console.tlog('SocketIOClient needSendMessage', 'Khong can SEND');
                var dataSend = { IDneed: data.sendID, needSend: false };
                this.socket.emit("needSendMessage", dataSend);
            } else {
                console.tlog('SocketIOClient needSendMessage', 'SEND PSN nhe');
            }
        });


        /*var dataSend = {IDneed: data.sendID,needSend:true};
        socket.emit('needSendMessage' dataSend);
         */

        /* Add event listener when user success login to notify admin is online */
        this.trackignAdminOnline = EventRegister.addEventListener(Constants.APP_EVENT_KEY.TRACKING_SOCKET_ADMIN_ONLINE, () => {
            let params = {};
            if (Constants.userInfo) {
                params.user_id = Constants.userInfo.managerConnectSocket;
            }

            this.socket.emit('newLogin', params);
        });
    }

    handleActive = () => {
    };

    handleInactive = () => {
    };

    handleBackground = () => {

    };

    render() {
        return (
            <AppStateListener
                onActive={this.handleActive}
                onBackground={this.handleBackground}
                onInactive={this.handleInactive}
            />
        );
    }


}