import React, { Component } from "react";
import AppStateListener from "react-native-appstate-listener";
import { EventRegister } from "react-native-event-listeners";
import Constants from "../utils/Constants";
import firebase from "./firebase";


export default class FCMController extends Component {
    constructor(props) {
        super(props);

    }

    componentWillUnmount() {
        const FCM = firebase.notifications();
        FCM.cancelAllNotifications();
        // PushNotification.cancelLocalNotifications();
        if (this.waitHomeTimer !== null && typeof this.waitHomeTimer !== 'undefined') {
            clearTimeout(this.waitHomeTimer);
        }
        this.waitHomeTimer = null;
        this._currentPushInfo = null;
    }

    componentDidMount() {
        this.configPush();
    }


    configPush = async () => {

        const FCM = firebase.notifications();
        FCM.getInitialNotification().then((notificationOpen) => {
            this._handleOpenPnsFromLaunchingOrBackground(notificationOpen, false);
        });

        FCM.onNotificationOpened((notificationOpen) => {
            this._handleOpenPnsFromLaunchingOrBackground(notificationOpen, true);
        });

        FCM.onNotificationDisplayed((notification) => {
            //this._handleNotificationWhenAppOnScreen(notification);
        });

        FCM.onNotification((notification) => {
            this._handleNotificationWhenAppOnScreen(notification);
        })

    }

    processPush = (userInteraction = false) => {
        if (Constants.isHomeOnScreen) {
            console.tlog('pnsData FCM', this._currentPushInfo);

            EventRegister.emitEvent(Constants.APP_EVENT_KEY.NEW_NOTIFICATION, {
                push_info: this._currentPushInfo,
                userInteraction
            });

            this._currentPushInfo = null;
        } else {
            this.waitHomeTimer = setTimeout(() => {
                console.tlog("delay handle notification till app launch home screen");
                if (Constants.isHomeOnScreen) {
                    EventRegister.emitEvent(Constants.APP_EVENT_KEY.NEW_NOTIFICATION, {
                        push_info: this._currentPushInfo,
                        userInteraction
                    });

                    this._currentPushInfo = null;
                } else {
                    this.processPush(userInteraction);
                }

            }, 500);
        }
    }


    _handleOpenPnsFromLaunchingOrBackground = (notificationOpen, isFromBg = true) => {
        // if (!isFromBg) {
        //     Constants.isHomeOnScreen = false;
        // }

        if (notificationOpen) {
            const {
                action,
                notification,
                results
            } = notificationOpen;
            if (notification) {
                const {
                    body,
                    data,
                    notificationId,
                    sound,
                    subtitle,
                    title
                } = notification;

                console.tlog(isFromBg ? "_handleOpenPnsFromBackground" : "_handleOpenPnsFromLaunching", {
                    body,
                    data,
                    notificationId,
                    sound,
                    subtitle,
                    title
                });

                //TODO : handle push here
                const pushInfo = {
                    title, body, data
                }
                this._currentPushInfo = pushInfo;
                this.processPush(true);
            }
        }

    };

    _handleNotificationWhenAppOnScreen = (notification) => {
        const {
            body,
            data,
            notificationId,
            sound,
            subtitle,
            title
        } = notification;
        console.tlog("_handleNotificationWhenAppOnScreen", {
            body,
            data,
            notificationId,
            sound,
            subtitle,
            title
        });

        //TODO : handle push here
        const pushInfo = {
            title, body, data
        }
        this._currentPushInfo = pushInfo;
        this.processPush(false);
    }

    handleActive = () => {
        // Post event to notify app in active
        // EventRegister.emitEvent(Constants.APP_EVENT_KEY.APP_ACTIVE_FOREGROUND);

        // Keep status
        Constants.appInBackground = false;
    };

    handleInactive = () => {
        Constants.appInBackground = true;
    };

    handleBackground = () => {
        Constants.appInBackground = true;
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