/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Easing, StatusBar, View } from 'react-native';
import { EventRegister } from "react-native-event-listeners";
import SplashScreen from 'react-native-smart-splash-screen';
import { createAppContainer, createStackNavigator } from "react-navigation";
import ChatDetailPage from './src/pages/ChatDetailPage';
import GroupMessagePage from './src/pages/GroupMessagePage';
import LoginPage from './src/pages/LoginPage';
import FCMController from './src/pns/FCMController';
import APICommonService from './src/apis/APICommonService';
import ColorApp from './src/utils/ColorApp';
import Constants from './src/utils/Constants';
import * as Util from './src/utils/Util';
import { checkAndAskPNSPermissionFirstTime } from './src/permissionApp/FCMPermission';

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

    // Get saved user info
    // this.getSavedUserInfoLogin();

    this.onCloseSplashScreen();

    // Ask FCM permission
    checkAndAskPNSPermissionFirstTime();
  }

  componentWillUnmount() {
    this.hadUnmount = true;

    // Remove listener
    EventRegister.removeAllListeners();
  }

  getSavedUserInfoLogin = async () => {
    let userInfo = await Util.getSavedLoginUserInfo();
    if (userInfo) {
      Constants.userInfo = userInfo;

      this.onAutoLogin(userInfo);
    } else {
      // Close splash
      this.onCloseSplashScreen();
    }
  }

  setViewState = (...params) => {
    if (!!this.hadUnmount) return;

    this.setState(...params);
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

  onAutoLogin = (userInfo) => {
    APICommonService.login(userInfo.managerEmail, userInfo.password).then(resp => {
      if (resp && resp.success) {
        // Keep user info
        Constants.userInfo = resp.data;

        // Save local storage
        Util.setItemAsyncStorage(Constants.ASYNC_STORAGE_KEY.USER_INFO, JSON.stringify(resp.data));

        EventRegister.emitEvent(Constants.APP_EVENT_KEY.CHANGE_STACK_NOTIFY_KEY, Constants.STACK_SCREEN_KEY.DASHBOARD_STACK_KEY);

        // Close splash
        this.onCloseSplashScreen();
      }
    }).catch(err => {
    }).finally(() => {
      // Close splash
      this.onCloseSplashScreen();
    });
  }

  handleRouteChange = (prevState, currentState, action) => {
  };

  render() {

    const Stack = getStackByName(this.state.currentStackName);

    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={ColorApp.yellowApp}
          barStyle="dark-content"
        />
        <Stack
          onNavigationStateChange={this.handleRouteChange}
          initialStack={true}
        />

        <FCMController />
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