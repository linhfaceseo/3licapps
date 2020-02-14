/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import APICommonService from '../apis/APICommonService';
import HeaderNormal from '../components/HeaderNormal';
import i18n from '../translations/i18n';
import ColorApp from '../utils/ColorApp';
import Constants from '../utils/Constants';
import * as Util from './../utils/Util';


class LoginPage extends Component {

  constructor(props) {
    super(props);

    this.email = '';
    this.password = '';


    this.state = {
      onLoading: false
    };

  }

  componentDidMount() {
    Constants.isHomeOnScreen = true;

    /* Listener when finish get FCM token */
    EventRegister.addEventListener(Constants.APP_EVENT_KEY.SUCCESS_GET_FCM_TOKEN, () => {
      this.getSavedUserInfoLogin();
    });

    /* Add event to listener new PNS */
    this.onPNSListener = EventRegister.addEventListener(Constants.APP_EVENT_KEY.NEW_NOTIFICATION, (data) => {
      this.processPnsData(data);
    });
  }

  setViewState = (...params) => {
    if (!!this.hadUnmount) return;
    this.setState(...params);
  };

  componentWillUnmount() {
    this.hadUnmount = true;
  }

  processPnsData = (pnsData) => {
    let pnsInfo = pnsData.push_info;
    let userInteraction = pnsData.userInteraction;
    console.tlog('pnsData', pnsData);

    let title = '';
    let message = '';
    let data = pnsInfo;
    if (pnsInfo.data) {
        data = pnsInfo.data;
    }

    if (data) {
        title = data.title;
        message = data.body;

        if (data.push_type === Constants.PNS_TYPE_ID.USER_SEND_CHAT_MESSAGE) {
            if (userInteraction) {
                // this.props.navigation.navigate(Constants.PAGE_KEY.MY_ORDER_PAGE_KEY);
                let chatInfo = { order_id: data.order_id, needToGetDetail: true }
                this.props.navigation.push(Constants.PAGE_KEY.CHAT_DETAIL_PAGE_KEY, chatInfo);
            } else {
                Util.showNoticeAlert(title, message, false, () => { });
                // Util.showConfirmAlert(title, message,
                //     i18n.t(Constants.TRANSLATE_KEY.order_detail_title),
                //     i18n.t(Constants.TRANSLATE_KEY.close_title),
                //     false, () => {
                //         let orderInfo = { order_id: data.order_id, needToGetDetail: true }
                //         this.props.navigation.push(Constants.PAGE_KEY.MY_ORDER_DETAIL_PAGE_KEY, orderInfo);
                //     });
            }

        } else {
            Util.showNoticeAlert(title, message, false, () => { });
        }
    }
}

  getSavedUserInfoLogin = async () => {
    let userInfo = await Util.getSavedLoginUserInfo();
    if (userInfo) {
      Constants.userInfo = userInfo;

      this.email = userInfo.managerEmail;
      this.password = userInfo.password;

      this.callSignWithEmail();
    } else {
      this.setViewState({
        onLoading: false
      });
    }
  }

  onLoginPress = () => {
    if (this.isValidData()) {
      this.callSignWithEmail();
    }
  }

  isValidData = () => {
    if (!this.email || this.email.trim === '') {
      Util.showNoticeAlert('', i18n.t(Constants.TRANSLATE_KEY.please_input_email_msg));
      return false;
    }
    if (!this.password || this.password.trim === '') {
      Util.showNoticeAlert('', i18n.t(Constants.TRANSLATE_KEY.please_input_password_msg));
      return false;
    }

    if (!Util.emailValidator(this.email)) {
      Util.showNoticeAlert('', i18n.t(Constants.TRANSLATE_KEY.invalid_email_address_msg));
      return false;
    }

    return true;
  }

  callSignWithEmail = (autoLogin = false) => {
    this.setViewState({
      onLoading: true
    });

    APICommonService.login(this.email, this.password).then(resp => {
      console.tlog('resp', resp);
      if (resp && resp.success) {
        // Set pass
        resp.data.password = this.password;

        // Keep user info
        Constants.userInfo = resp.data;

        // Save local storage
        Util.setItemAsyncStorage(Constants.ASYNC_STORAGE_KEY.USER_INFO, JSON.stringify(resp.data));

        EventRegister.emitEvent(Constants.APP_EVENT_KEY.CHANGE_STACK_NOTIFY_KEY, Constants.STACK_SCREEN_KEY.DASHBOARD_STACK_KEY);
      } else {
        if (!autoLogin) {
          Util.showNoticeAlert('', JSON.stringify(resp), false);
        }
      }
    }).catch(err => {
      if (!autoLogin) {
        Util.showNoticeAlert('ERROR', JSON.stringify(err), false);
      }
    }).finally(() => {
      this.setViewState({
        onLoading: false
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <HeaderNormal
          hideLeft={true}
          title={''}
          showRight={false}
          hideBoxShadow={true} />

        <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}>

            <View style={{ minHeight: Constants.deviceH - 120, alignItems: 'center' }}>
              <Image
                source={require('./../images/ic_logo.png')}
                style={styles.imgLogo} />

              <Text style={styles.textTitle}>
                {i18n.t(Constants.TRANSLATE_KEY.login_with_phone_no_title)}
              </Text>

              <View style={{ width: '100%' }}>
                <TextInput
                  underlineColorAndroid={"transparent"}
                  onChangeText={text => {
                    this.email = text;
                  }}
                  keyboardType={'email-address'}
                  autoCorrect={false}
                  autoFocus={false}
                  placeholder={i18n.t(Constants.TRANSLATE_KEY.enter_your_email_title)}
                  placeholderTextColor={ColorApp.blackApp}
                  style={[styles.styleInput, { marginLeft: 35, marginRight: 35 }]}
                />

                <TextInput
                  underlineColorAndroid={"transparent"}
                  onChangeText={text => {
                    this.password = text;
                  }}
                  secureTextEntry={true}
                  autoCorrect={false}
                  autoFocus={false}
                  placeholder={i18n.t(Constants.TRANSLATE_KEY.enter_your_password)}
                  placeholderTextColor={ColorApp.blackApp}
                  style={[styles.styleInput, { marginLeft: 35, marginRight: 35, marginTop: 15 }]}
                />
              </View>

              <View style={[styles.viewInput, { marginTop: 45 }]}>
                <TouchableOpacity
                  activeOpacity={Constants.OPACITY_BUTTON}
                  onPress={() => {
                    this.onLoginPress();
                  }}
                  style={styles.btnSignIn}>
                  <Text style={styles.textButton}>{i18n.t(Constants.TRANSLATE_KEY.signin_title).toUpperCase()}</Text>
                </TouchableOpacity>

              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>

        {this.state.onLoading && <Util.indicatorProgress />}
      </View>


    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorApp.yellowApp
  },

  styleInput: {
    borderColor: ColorApp.gray165, borderWidth: 0.5, borderRadius: 4, padding: 5,
    // fontFamily: Constants.FONT_NAME.LATO_REGULAR,
    textAlignVertical: 'top',
    fontSize: 12,
    height: 42,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12,
    color: ColorApp.blackApp,
  },

  imgLogo: {
    width: 137,
    height: 91,
    marginTop: Constants.isIPhoneX ? 127 : 85,
    marginBottom: Util.scaledSize(48)
  },

  textTitle: {
    fontSize: 16,
    // fontFamily: Constants.FONT_NAME.LATO_BLACK,
    marginBottom: 28,
    color: ColorApp.blackApp
  },
  textError: {
    fontSize: 16,
    // fontFamily: Constants.FONT_NAME.LATO_BLACK,
    paddingTop: 5,
    paddingBottom: 5,
    color: ColorApp.red
  },
  viewInput: {
    marginLeft: 35,
    marginRight: 35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorApp.white,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: ColorApp.grayApp
  },
  btnSignIn: {
    flex: 1,
    height: Constants.HEIGHT_BUTTON,
    backgroundColor: ColorApp.blackApp,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textButton: {
    fontSize: 14,
    color: ColorApp.white,
    // fontFamily: Constants.FONT_NAME.LATO_SEMI_BOLD
  },

  hyperlink: {
    color: ColorApp.blackApp,
    fontSize: Util.scaledSize(12),
    textDecorationLine: "underline",
    // fontFamily: Constants.FONT_NAME.LATO_BOLD
  },
  hyperlinkText: {
    fontSize: Util.scaledSize(12),
    color: ColorApp.blackApp,
    alignSelf: "center",
    textAlign: 'center',
    //lineHeight: 20,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 30,
    // fontFamily: Constants.FONT_NAME.LATO_REGULAR,
    marginBottom: Constants.isIPhoneX ? 20 : 0
  },
  webviewRecaptcha: {
    width: '100%',
    height: 70,
    marginTop: 20,
    backgroundColor: ColorApp.yellowApp
  },

  styletextBottom: {
    fontSize: Util.scaledSize(12),
    color: ColorApp.blackApp,
    alignSelf: "center",
    textAlign: 'center',
    paddingLeft: 35,
    paddingRight: 35,
    // fontFamily: Constants.FONT_NAME.LATO_REGULAR,
  },

  styletextLink: {
    // fontFamily: Constants.FONT_NAME.LATO_BOLD,
    textDecorationLine: 'underline'
  }

});

export default LoginPage;

