import { Linking } from "react-native";
import AndroidOpenSettings from 'react-native-android-open-settings';
import firebase from "../pns/firebase";
import APICommonService, { API_KEY } from "../apis/APICommonService";
import Constants from "../utils/Constants";
import * as Util from '../utils/Util';
import i18n from "../translations/i18n";
import { EventRegister } from "react-native-event-listeners";


export const checkAndAskPNSPermissionFirstTime = async () => {
    const FCM = firebase.messaging();


    // Check and ask FCM permission for the first time
    let result = await Util.getItemAsyncStorage(Constants.ASYNC_STORAGE_KEY.ASK_PERMISSION_PNS_FIRST_TIME);

    if (!result) { /* At the first time into app */
        // Save to local storage to tracking already enter app
        Util.setItemAsyncStorage(Constants.ASYNC_STORAGE_KEY.ASK_PERMISSION_PNS_FIRST_TIME, '1');

        if (Constants.isIOS) {
            FCM.requestPermission((resp => {
                // Don't care resp, we always register pns device
            }));
        } else {
            // Check permission
            checkPNSPermissionFirstTime(FCM);
        }
    }

    // Always Register PNS device for case: Allow or Don't Allow
    registerPNSDevice(FCM);
}

// Check and ask FCM permission -> For Android
export const checkPNSPermissionFirstTime = (FCM) => {
    FCM.hasPermission().then(resp => {
        if (!resp || resp == false || resp === 0) {
            Util.showConfirmAlert(
                i18n.t(Constants.TRANSLATE_KEY.ting_ask_permission_title),
                i18n.t(Constants.TRANSLATE_KEY.ting_ask_permission_msg),
                i18n.t(Constants.TRANSLATE_KEY.go_to_setting_title),
                i18n.t(Constants.TRANSLATE_KEY.deny_title),
                false, () => {
                    // Go to setting to enable PNS
                    if (Constants.isIOS) {
                        Linking.openURL('app-settings://notification/ting!');
                    } else {
                        AndroidOpenSettings.appDetailsSettings();
                    }
                }, null);
        }
    });
}

// Register PNS device to receiving push (always register)
export const registerPNSDevice = (FCM) => {
    // Get FCM Token to register push
    FCM.getToken().then(token => {
        console.tlog('FCMToken', token);
        // Update header FCM token
        if (token) {
            Constants.fcmToken = token;
            // Update header token API
            // var paramsHeader = {};
            // paramsHeader[API_KEY.X_TING_FCM_TOKEN_KEY] = token;
            // APICommonService.updateHeader(paramsHeader);

            // Call api to notify fcm_token
            // APICommonService.updateFCMToken().then(resp => {
            //     console.tlog('updateFCMToken RESP', resp);
            // }).catch(err => {
            //     console.tlog('updateFCMToken ERR', err);
            // });
        }

        EventRegister.emitEvent(Constants.APP_EVENT_KEY.SUCCESS_GET_FCM_TOKEN);
    });
}