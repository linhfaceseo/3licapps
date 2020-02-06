/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import HeaderNormal from '../components/HeaderNormal';
import APICommonService from '../apis/APICommonService';
import i18n from '../translations/i18n';
import ColorApp from '../utils/ColorApp';
import Constants from '../utils/Constants';
import * as Util from './../utils/Util';


class LoginPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      onLoading: false,
      messageErrorPhone: '',
    };

  }

  componentDidMount() {
  }

  setViewState = (...params) => {
    if (!!this.hadUnmount) return;
    this.setState(...params);
  };

  componentWillUnmount() {
    this.hadUnmount = true;
  }

  onBackPress = () => {
    this.props.navigation.goBack();
  }

  onLoginPress = () => {
    // if (this.mobilePhone && this.mobilePhone.length >= 6) {
    //   this.setViewState({
    //     messageErrorPhone: "",
    //     onLoading: true
    //   });
    //   this.callSignInPhoneNumber();
    // } else {
    //   this.setViewState({ messageErrorPhone: i18n.t(Constants.TRANSLATE_KEY.please_enter_at_least_6_characters) })
    // }
  }

  callSignInPhoneNumber = () => {
    APICommonService.registerPhone("", "").then(resp => {
      
      if (resp.success) {
      } else {
        Util.showNoticeAlert('', resp.message, false);
      }
    }).catch(err => {
      Util.showNoticeAlert('', JSON.stringify(err), false);
    }).finally(() => {
      this.setViewState({
        onLoading: false
      })
    });
  }

  render() {
    let emptyPhone = true;
    if (this.mobilePhone && this.mobilePhone !== '') {
      emptyPhone = false;
    }
    return (
      <View style={styles.container}>

        <HeaderNormal
          onBackPress={this.onBackPress}
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

              <TextInput
                underlineColorAndroid={"transparent"}
                onChangeText={text => {
                  this.receiverName = text;
                }}
                autoCorrect={false}
                autoFocus={false}
                placeholder={i18n.t(Constants.TRANSLATE_KEY.enter_name_hint)}
                placeholderTextColor={ColorApp.gray165}
                style={[styles.styleInput]}
              />
              {this.state.messageErrorPhone !== '' && <Text style={styles.textError}>
                {this.state.messageErrorPhone}
              </Text>}

              <View style={[styles.viewInput, { marginTop: 45 }]}>
                <TouchableOpacity
                  activeOpacity={emptyPhone ? 1 : Constants.OPACITY_BUTTON}
                  onPress={() => {
                    if (!emptyPhone) {
                      this.onLoginPress();
                    }
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
    flex: 1
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

