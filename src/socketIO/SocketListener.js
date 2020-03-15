import React, { Component } from "react";
import AppStateListener from "react-native-appstate-listener";
import { EventRegister } from "react-native-event-listeners";
import io from 'socket.io-client/dist/socket.io';
import Constants from "../utils/Constants";

export default class SocketListener extends Component {
    constructor(props) {
        super(props);

        this.onInitSocketIO();
    }

    onInitSocketIO = () => {
        this.socket = io('http://3lichat.us:8080');

        // Listener socket event
        this.addSocketListener();
    }

    componentWillUnmount() {
        if (this.trackignAdminOnline) {
            EventRegister.removeEventListener(this.trackignAdminOnline);
        }

        // if (this.appActiveLst) {
        //     EventRegister.removeEventListener(this.appActiveLst);
        // }
    }

    componentDidMount() {

        /*var dataSend = {IDneed: data.sendID,needSend:true};
        socket.emit('needSendMessage' dataSend);
         */

        /* Add event listener when user success login to notify admin is online */
        this.trackignAdminOnline = EventRegister.addEventListener(Constants.APP_EVENT_KEY.TRACKING_SOCKET_ADMIN_ONLINE, () => {
            this.onTrackingOnline();
        });

        /* Add event listener when app in active */
        // this.appActiveLst = EventRegister.addEventListener(Constants.APP_EVENT_KEY.APP_ACTIVE_FOREGROUND, () => {
        // Remove listener first
        // this.removeSocketListener();

        // Init again
        // this.onInitSocketIO();

        // this.onTrackingOnline();
        // });
    }

    onTrackingOnline = () => {
        if (this.socket && Constants.userInfo) {
            let params = {};
            params.user_id = Constants.userInfo.managerConnectSocket;

            this.socket.emit('newLogin', params);
        }
    }

    addSocketListener = () => {
        if (this.socket) {
            this.socket.on('connect', (data) => {
                this.onTrackingOnline();
                // console.tlog('SocketIOClient Connection Status', `${data}`);
            });

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

                // console.tlog('SocketIOClient needSendMessage DATA', data);
                /*data: {
                    "sendID": 1,
                    "userID": 2,
                    "pageID": 33
                }*/
                if (data) {
                    let isLoggedIn = false;
                    if (Constants.userInfo) {
                        isLoggedIn = true;
                    }

                    // Check send pns or not
                    if ((Constants.currentChatInfo &&
                        (Constants.currentChatInfo.msg_uid === data.userID &&
                            Constants.currentChatInfo.msg_pid === data.pageID))) {
                        var dataSend = { IDneed: data ? data.sendID : '', needSend: false };
                        this.socket.emit("needSendMessage", dataSend);
                    }
                }
            });
        }
    }

    removeSocketListener = () => {
        if (this.socket) {
            /* Listener users online */
            this.socket.off('UserOnline');

            /* Listener users offline */
            this.socket.off('UserOffline');

            this.socket.on("needSendMessage");
        }
    }


    handleActive = () => {
        this.onTrackingOnline();
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