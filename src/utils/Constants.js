import { Platform, StatusBar, Dimensions } from "react-native";
import DeviceInfo from "react-native-device-info";

export default module = {

  fcmToken: '',
  userInfo: null,

  deviceW: getDeviceResolution(true),
  deviceH: getDeviceResolution(false),
  isIOS: checkIOS(),
  uniqueDeviceID: getUniqueDeviceId(),
  isIPhoneX: checkIPhoneX(),
  isAndroidX: checkAndroidX(),
  HEIGHT_NAVIGATION_BAR: checkIPhoneX() ? 106 : checkIOS() ? 76 : 56,
  HEIGHT_BUTTON: 42,
  HEIGHT_BUTTON_SMALL: checkIOS() ? 35 : 40,
  HEIGHT_INPUT: checkIOS() ? 42 : 42,
  BODER_INPUT: checkIOS() ? 21 : 21,
  OPACITY_BUTTON: 0.7,
  PAD_TOP_HEADER: checkIPhoneX() ? 40 : checkIOS() ? 20 : 0,
  PAD_BOTTOM_NORMAL_APP: checkIPhoneX() ? 40 : 20,
  PAD_LEFT_RIGHT_NORMAL_APP: 15,

  // Delay time to load more data
  DELAY_TIME_TO_LOAD_MORE: 300,

  // Save local notification data
  dataNotification: null,
  // Check app already open
  isHomeOnScreen: false,

  // Keep current chat info to check if user have new pns chat
  currentChatInfo: null,

  // Keep current pnsInfo if user not signed up
  currentPnsInfo: null,

  // Check app in foreground or background
  appInBackground: false,

  // Update version code when build
  versionCode: 4,

  DATE_TIME_FORMAT: {
    YYYYMMDDHHMMSS: 'YYYY-MM-DD hh:mm:ss',
    DDMMYYYY: 'DD/MM/YYYY',
    DO_MMMM: 'Do MMMM',
    D_MMMM_YYYY: 'D MMMM, YYYY',
    DD_MMM_YYYY: 'DD MMM, YYYY',
    YYYYMMDD_T_HHMMSS_SSSZ: 'YYYY-MM-DDTHH:mm:ss.SSSz',
  },

  GENDER_KEY: {
    MALE: 'Male',
    FEMALE: 'Female'
  },

  CHAT_TYPE: {
    MESSAGE: 1,
    IMAGE: 2
  },

  USER_ROLE: {
    USER: 'user',
    MANAGER: 'manager'
  },

  OPTION_MENU_CHAT_KEY: {
    TRANSLATE: 0,
    COPY: 1,
    DELETE: 2
  },

  PAGE_KEY: {
    SPLASH_PAGE_KEY: 'SplashPage',
    GROUP_MESSAGE_PAGE_KEY: 'GroupMessagePage',
    CHAT_DETAIL_PAGE_KEY: 'ChatDetailPage',
  },

  STACK_SCREEN_KEY: {
    DASHBOARD_STACK_KEY: 'DashboardStack',
    LOGIN_STACK_KEY: 'LoginStack'
  },

  APP_EVENT_KEY: {
    CHANGE_STACK_NOTIFY_KEY: 'ChangeStackNotify',
    SUCCESS_GET_FCM_TOKEN: 'SUCCESS_GET_FCM_TOKEN',
    RESET_TEXT_INPUT_CHAT: 'ResetTextInputChat',
    PROCESS_PUSH_FROM_FB: 'ProcessPushFromFirebase',
    NEW_NOTIFICATION: 'HaveNewNotification',
    USER_LOGOUT: 'UserLogout',
    EXIT_CURRENT_CHAT_PAGE_FOR_NEW_COMMING_CHAT: 'ExitCurrentChatPageForNewCommingChat',

    // Socket io
    TRACKING_SOCKET_ADMIN_ONLINE: 'TrackingSocketAdminOnline',
    IO_USERS_ONLINE: 'IOUsersOnlineEvent',
    IO_USER_OFFLINE: 'IOUserOfflineEvent',

    // App status
    APP_ACTIVE_FOREGROUND: 'AppInActiveForgroundNotify',
  },

  ASYNC_STORAGE_KEY: {
    ALREADY_USING_APP: 'AlreadyUsingApp3liChat',
    USER_INFO: 'UserInfo3liChat',
    ASK_PERMISSION_PNS_FIRST_TIME: 'AskPermissionPNSFirstTime3liChat',
  },

  TRANSLATE_KEY: {

    confirm_title: 'confirm_title',
    // Login
    login_with_email_title: 'login_with_email_title',
    phone_no_title: 'phone_no_title',
    terms_policy_condition: 'terms_policy_condition',
    sign_up_title: 'sign_up_title',
    close_title:'close_title',
    cancel_title:'cancel_title',
    select_a_photo_title:'select_a_photo_title',
    take_a_photo_title:'take_a_photo_title',
    choose_from_gallery_title:'choose_from_gallery_title',
    permission_denied_title:'permission_denied_title',
    photo_permision_requeried_msg:'photo_permision_requeried_msg',
    retry_title:'retry_title',
    im_sure_title:'im_sure_title',


    // CHAT
    online: 'online',
    offline: 'offline',
    sent_an_image_msg_alias:'sent_an_image_msg_alias',
    message_title: 'message_title',
    enter_your_email_title:'enter_your_email_title',
    enter_your_password: 'enter_your_password',
    signin_title:'signin_title',
    invalid_email_address_msg:'invalid_email_address_msg',
    please_input_password_msg:'please_input_password_msg',
    please_input_email_msg: 'please_input_email_msg',

    go_to_chat_title: 'go_to_chat_title',

    login_err_msg: 'login_err_msg',
    forgot_pass_title: 'forgot_pass_title',

    new_version_available_title: 'new_version_available_title',
    update_title: 'update_title',
    not_now_title: 'not_now_title',
  },

  APP_STATE_KEYS: {
    active: '',
    inactive: 'inactive',
    background: 'background'
  },

  PNS_TYPE_ID: {
    USER_SEND_CHAT_MESSAGE: 'MessageChat'
  },

  FONT_NAME: {
    ROBOTO_REGULAR: checkIOS()
      ? "RobotoRegular"
      : "RobotoRegular",
    LATO_BLACK: checkIOS()
      ? "Lato-Black"
      : "LatoBlack.ttf",
    LATO_BLACK_ITALIC: checkIOS()
      ? "Lato-BlackItalic"
      : "LatoBlackItalic",
    LATO_BOLD: checkIOS()
      ? "Lato-Bold"
      : "LatoBold",
    LATO_BOLD_ITALIC: checkIOS()
      ? "Lato-BoldItalic"
      : "LatoBoldItalic",
    LATO_HAIRLINE: checkIOS()
      ? "Lato-Hairline"
      : "LatoHairline",
    LATO_HAIRLINE_ITALIC: checkIOS()
      ? "Lato-HairlineItalic"
      : "LatoHairlineItalic",
    LATO_HEAVY: checkIOS()
      ? "Lato-Heavy"
      : "LatoHeavy",
    LATO_HEAVY_ITALIC: checkIOS()
      ? "Lato-HeavyItalic"
      : "LatoHeavyItalic",
    LATO_ITALIC: checkIOS()
      ? "Lato-Italic"
      : "LatoItalic",
    LATO_LIGHT: checkIOS()
      ? "Lato-Light"
      : "LatoLight",
    LATO_LIGHT_ITALIC: checkIOS()
      ? "Lato-LightItalic"
      : "LatoLightItalic",
    LATO_MEDIUM: checkIOS()
      ? "Lato-Medium"
      : "LatoMedium",
    LATO_MEDIUM_ITALIC: checkIOS()
      ? "Lato-MediumItalic"
      : "LatoMediumItalic",
    LATO_REGULAR: checkIOS()
      ? "Lato-Regular"
      : "LatoRegular",
    LATO_SEMI_BOLD: checkIOS()
      ? "Lato-Semibold"
      : "LatoSemibold",
    LATO_SEMI_BOLD_ITALIC: checkIOS()
      ? "Lato-SemiboldItalic"
      : "LatoSemiboldItalic",
    LATO_THIN: checkIOS()
      ? "Lato-Thin"
      : "LatoThin",
    LATO_THIN_ITALIC: checkIOS()
      ? "Lato-ThinItalic"
      : "LatoThinItalic",

  }

}

function getDeviceResolution(isWidth) {
  const { width, height } = Dimensions.get('window');
  if (isWidth) {
    return width;
  }
  return height;
}

function checkIOS() {
  return Platform.OS === "ios";
}

function getUniqueDeviceId() {
  var uniqueId = DeviceInfo.getUniqueId();
  return uniqueId;
}

/* Check ipX and ip11 */
function checkIPhoneX() {
  let _isIphoneX = false;
  if (Platform.OS === "ios") {
    let model = DeviceInfo.getModel();
    let indexX = model.toUpperCase().search("X");
    let index11 = model.toUpperCase().search("IPHONE 1");
    if ((indexX >= 0 && indexX < model.length) || (index11 >= 0 && index11 < model.length)) {
      _isIphoneX = true;
    }
  }
  return _isIphoneX;
}

function checkAndroidX() {
  if (Platform.OS === "android") {
    return DeviceInfo.hasNotch() || StatusBar.currentHeight >= 30 // || model == "redmi note 6 pro"
  }

  return false
} 