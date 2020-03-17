/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Easing, StatusBar, View, Linking } from 'react-native';
import { EventRegister } from "react-native-event-listeners";
import SplashScreen from 'react-native-smart-splash-screen';
import { createAppContainer, createStackNavigator } from "react-navigation";
import ChatDetailPage from './src/pages/ChatDetailPage';
import GroupMessagePage from './src/pages/GroupMessagePage';
import LoginPage from './src/pages/LoginPage';
import { checkAndAskPNSPermissionFirstTime } from './src/permissionApp/FCMPermission';
import FCMController from './src/pns/FCMController';
import ColorApp from './src/utils/ColorApp';
import Constants from './src/utils/Constants';
import *as Util from './src/utils/Util';
import SocketListener from './src/socketIO/SocketListener';
import APICommonService, { API_KEY, API_URL } from './src/apis/APICommonService';
import i18n from './src/translations/i18n';
import RNExitApp from "react-native-exit-app";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentStackName: Constants.STACK_SCREEN_KEY.LOGIN_STACK_KEY
    }
  }

  componentDidMount() {
    /* Listener event to change stack */
    this.changeStackListener = EventRegister.addEventListener(Constants.APP_EVENT_KEY.CHANGE_STACK_NOTIFY_KEY, (stackName) => {
      this.setViewState({
        currentStackName: stackName
      });
    });

    this.onCloseSplashScreen();

    // Check new version app
    this.onCheckNewVersionApp();
  }

  componentWillUnmount() {
    this.hadUnmount = true;

    // Remove listener
    EventRegister.removeAllListeners();
  }

  setViewState = (...params) => {
    if (!!this.hadUnmount) return;

    this.setState(...params);
  }

  onCheckNewVersionApp = () => {
    // Check new version app
    let params = {};
    params[API_KEY.CURRENT_VERSION_KEY] = Constants.versionCode
    params[API_KEY.PLAT_FORM_KEY] = Constants.isIOS ? 'ios' : 'android'

    params[API_KEY.ACTION_REQUEST_KEY] = API_URL.CHECK_NEW_VERSION_APP;

    APICommonService.checkNewVersionApp(params).then(resp => {
      console.tlog('onCheckNewVersionApp', resp);
      if (resp && resp.success && resp.data && resp.data.newVersionAvailable) {
        let headerTitle = i18n.t(Constants.TRANSLATE_KEY.new_version_available_title);
        let updateTitle = i18n.t(Constants.TRANSLATE_KEY.update_title);
        let cancelTitle = i18n.t(Constants.TRANSLATE_KEY.not_now_title);
        if (resp.data.forceUpdate) {
          Util.showNoticeAlert(
            headerTitle,
            resp.data.msg || 'Bugs and stability fixes',
            false,
            () => {
              if (resp.data.url && resp.data.url !== '') {
                Linking.openURL(resp.data.url).then(() => {
                  RNExitApp.exitApp();
                });
              } else {
                RNExitApp.exitApp();
              }
            },
            updateTitle
          );
        } else {
          Util.showConfirmAlert(
            headerTitle,
            resp.data.msg || 'Bugs and stability fixes',
            updateTitle,
            cancelTitle,
            false,
            // Confirm
            () => {
              if (resp.data.url && resp.data.url !== '') {
                Linking.openURL(resp.data.url).then(() => {
                  RNExitApp.exitApp();
                });
              }
            },
            // Cancel
            () => {
              // Ask FCM permission
              checkAndAskPNSPermissionFirstTime();
            }
          );
        }
      } else {
        // Ask FCM permission
        checkAndAskPNSPermissionFirstTime();
      }
    }).catch(err => {
      console.tlog('onCheckNewVersionApp ERR', JSON.stringify(err));

      // Ask FCM permission
      checkAndAskPNSPermissionFirstTime();
    });
  }

  onCloseSplashScreen = () => {
    setTimeout(() => {
      SplashScreen.close({
        animationType: SplashScreen.animationType.fade,
        duration: 0,
        delay: 0
      });
    }, 1000);
  }

  handleRouteChange = (prevState, currentState, action) => {
  };

  render() {

    const Stack = getStackByName(this.state.currentStackName);

    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={ColorApp.bg_app}
          barStyle="dark-content"
        />
        <Stack
          onNavigationStateChange={this.handleRouteChange}
          initialStack={true}
        />

        <FCMController />
        <SocketListener />
      </View>
    );
  }
}

const getStackByName = stack => {
  switch (stack) {
    case Constants.STACK_SCREEN_KEY.DASHBOARD_STACK_KEY:
      return HomeStack;

    case Constants.STACK_SCREEN_KEY.LOGIN_STACK_KEY:
      return LoginStack;

    default:
      return LoginStack;
  }
};

export default App;


const LoginStack = createAppContainer(createStackNavigator(
  {
    LoginPage: { name: Constants.PAGE_KEY.LOGIN_PAGE_KEY, screen: LoginPage }
  },
  {
    headerMode: 'none',
    transitionConfig
  }
));

const HomeStack = createAppContainer(createStackNavigator({
  GroupMessagePage: { name: Constants.PAGE_KEY.GROUP_MESSAGE_PAGE_KEY, screen: GroupMessagePage },
  ChatDetailPage: { name: Constants.PAGE_KEY.CHAT_DETAIL_PAGE_KEY, screen: ChatDetailPage },
},
  {
    headerMode: 'none',
    transitionConfig
  })
);

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps

      const thisSceneIndex = scene.index
      const width = layout.initWidth

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [width, 0],
      })

      return { transform: [{ translateX }] }
    },
  }
}