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
  },

  ASYNC_STORAGE_KEY: {
    ALREADY_USING_APP: 'AlreadyUsingAppTing',
    USER_INFO: 'UserInfoTing',
    ASK_PERMISSION_PNS_FIRST_TIME: 'AskPermissionPNSFirstTimeTing',
  },

  TRANSLATE_KEY: {
    using_location_title: 'using_location_title',
    using_location_message: 'using_location_message',
    request_write_storage_permission_title: 'request_write_storage_permission_title',
    write_external_storage_permission_message: 'write_external_storage_permission_message',
    request_record_permission_audio_title: 'request_record_permission_audio_title',
    record_audio_permission_message: 'record_audio_permission_message',
    select_language_title: 'select_language_title',
    welcome_to_ting_msg: 'welcome_to_ting_msg',

    confirm_title: 'confirm_title',
    // Login
    login_with_phone_no_title: 'login_with_phone_no_title',
    phone_no_title: 'phone_no_title',
    next_title: 'next_title',
    terms_policy_condition: 'terms_policy_condition',
    version: 'version',
    phone_verification: 'phone_verification',
    input_code_here: 'input_code_here',
    done_title: 'done_title',
    not_a_robot_title: 'not_a_robot_title',
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
    total_items: 'total_items',
    track_order: 'track_order',
    order_again: 'order_again',
    confirm_received: 'confirm_received',
    sent_an_image_msg_alias:'sent_an_image_msg_alias',
    message_title: 'message_title',
    enter_your_email_title:'enter_your_email_title',
    enter_your_password: 'enter_your_password',
    signin_title:'signin_title',
    invalid_email_address_msg:'invalid_email_address_msg',
    please_input_password_msg:'please_input_password_msg',
    please_input_email_msg: 'please_input_email_msg'

  },

  APP_STATE_KEYS: {
    active: '',
    inactive: 'inactive',
    background: 'background'
  },

  PNS_TYPE_ID: {
    ACCEPTED_BY_VENDOR: 'ACCEPTED_BY_VENDOR',
    REJECT_BY_VENDOR: 'REJECT_BY_VENDOR',
    START_PICKING_UP_BY_DRIVER: 'START_PICKING_UP_BY_DRIVER',
    PICKED_UP_FROM_VENDOR_AND_TRANSIT_TO_USER_BY_DRIVER: 'PICKED_UP_FROM_VENDOR_AND_TRANSIT_TO_USER_BY_DRIVER',
    CANCEL_BY_DRIVER: 'CANCEL_BY_DRIVER',
    REJECTED_BY_DRIVER: 'REJECTED_BY_DRIVER',
    DELIVERED_TO_BUYER_BY_DRIVER: 'DELIVERED_TO_BUYER_BY_DRIVER',
    FAILURE_OF_DELIVERY: 'FAILURE_OF_DELIVERY'
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