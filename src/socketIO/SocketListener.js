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
    }

    componentDidMount() {
        /* Listener users online */
        this.socket.on('UserOnline', (data) => {
            console.tlog('SocketIOClient UserOnline', data);
            let usersOnline = [];
            if(data && data.listUserOnline) {
                usersOnline = data.listUserOnline;
            }

            EventRegister.emitEvent(Constants.APP_EVENT_KEY.IO_USERS_ONLINE, usersOnline);
        });

        /* Listener users offline */
        this.socket.on('UserOffline', (data) => {
            console.tlog('SocketIOClient UserOffline', data);
            if(data && data.User) {
                EventRegister.emitEvent(Constants.APP_EVENT_KEY.IO_USER_OFFLINE, data.User);
            }
        });

        /* Add event listener when user success login to notify admin is online */
        EventRegister.addEventListener(Constants.APP_EVENT_KEY.TRACKING_SOCKET_ADMIN_ONLINE, () => {
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