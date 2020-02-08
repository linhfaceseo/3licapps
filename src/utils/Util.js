import React from "react";
import { Alert, AsyncStorage, View } from "react-native";
import ImagePicker from "react-native-image-picker";
import { BallIndicator } from 'react-native-indicators';
import i18n from "../translations/i18n";
import Constants from "./Constants";

// based on iphone 5s's scale
// Use iPhone8 1x as base size which is 375 x 667
const baseWidth = 375;
const baseHeight = 667;

const scaleWidth = Constants.deviceW / baseWidth;
const scaleHeight = Constants.deviceH / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);
export const scaledSize = (size) => Math.ceil((size * scale));

export const setItemAsyncStorage = async (key, value) => {
    let newKey = key.replace("-", "");
    await AsyncStorage.setItem(newKey, value);
}

export const getItemAsyncStorage = async (key) => {
    let newKey = key.replace("-", "");
    let data = await AsyncStorage.getItem(newKey);

    return data;
}

export const removeAllItemAsyncStorage = async () => {
    let status = await AsyncStorage.clear();

    return status;
}

export const removeKeyItemAsyncStorage = async (key) => {
    let status = await AsyncStorage.removeItem(key);

    return status;
}

// Show notice dialog
export const showNoticeAlert = (
    title,
    message,
    cancelAble,
    callBack,
    textButton = i18n.t(Constants.TRANSLATE_KEY.close_title)
) => {
    Alert.alert(
        title,
        message,
        [
            // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
            // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            { text: textButton, onPress: callBack }
        ],
        { cancelable: cancelAble }
    );
};

// Show Confirm dialog
export const showConfirmAlert = (
    title,
    message,
    confirmTitle = i18n.t(Constants.TRANSLATE_KEY.confirm_title),
    cancelTitle = i18n.t(Constants.TRANSLATE_KEY.cancel_title),
    cancelAble,
    callbackConfirm,
    callbackCancel
) => {
    Alert.alert(
        title,
        message,
        [
            // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
            { text: confirmTitle, onPress: callbackConfirm },
            { text: cancelTitle, onPress: callbackCancel }
        ],
        { cancelable: cancelAble }
    );
};

// Show indicator progress bar.
export const indicatorProgress = () => (
    <View style={{
        position: "absolute",
        left: 0,
        right: 0,
        width: "100%",
        height: "100%",
        flex: 1,
        zIndex: 99999999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    }} >
        <BallIndicator color='#ffa500' />
    </View>
);

export const showImagePicker = (callbackDone, maxW = 512, maxH = 512) => {
    var options = {
        title: i18n.t(Constants.TRANSLATE_KEY.select_a_photo_title),
        cancelButtonTitle: i18n.t(Constants.TRANSLATE_KEY.cancel_title),
        takePhotoButtonTitle: i18n.t(Constants.TRANSLATE_KEY.take_a_photo_title),
        chooseFromLibraryButtonTitle: i18n.t(Constants.TRANSLATE_KEY.choose_from_gallery_title),
        quality: 1.0,
        maxWidth: maxW,
        maxHeight: maxH,
        allowsEditing: false,
        permissionDenied: {
            title: i18n.t(Constants.TRANSLATE_KEY.permission_denied_title),
            text: i18n.t(Constants.TRANSLATE_KEY.photo_permision_requeried_msg),
            reTryTitle: i18n.t(Constants.TRANSLATE_KEY.retry_title),
            okTitle: i18n.t(Constants.TRANSLATE_KEY.im_sure_title)
        }
    };

    ImagePicker.showImagePicker(options, response => {

        if (response.didCancel) {
            return;
        } else if (response.error) {
            return;
        } else if (response.customButton) {
            return;
        } else {
            if (callbackDone) {
                callbackDone(response);
            }
        }
    });
}

export const getTimeFromDuration = (duration) => {
    // 86400 = 1 day 24 * 1 hour 60 * 1 minute 60
    var days = Math.floor(duration / 86400);
    let remainder = duration % 86400;
    var hours = Math.floor(remainder / 3600);
    remainder = remainder % 3600;
    var minutes = Math.floor(remainder / 60);
    var seconds = remainder % 60;

    if (days < 0) {
        days = 0;
    }
    if (hours < 0) {
        hours = 0;
    }
    if (minutes < 0) {
        minutes = 0;
    }
    if (seconds < 0) {
        seconds = 0;
    }
    return { days, hours, minutes, seconds }
}

export const invalidOrEmptyString = (str) => {
    return (str == null || typeof str == 'undefined' || str.trim().length == 0)
}

export const getSavedLoginUserInfo = async () => {
    if (Constants.userInfo) {
        return Constants.userInfo;
    } else {
        let userInfoJson = await getItemAsyncStorage(Constants.ASYNC_STORAGE_KEY.USER_INFO);

        if (userInfoJson && userInfoJson !== '') {
            let userInfo = JSON.parse(userInfoJson);
            return userInfo;
        }
        return null;
    }
}

export const emailValidator = (e) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e);
}