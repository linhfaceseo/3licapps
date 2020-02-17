
import RestClient from 'react-native-rest-client';
import Constants from '../utils/Constants';

export const API_URL = {
    SERVER_HOST: 'https://3lichat.us/Server/Service/RequestAction.php', // DEV

    GET_PRODUCT_DETAIL: '/api/products',
    LOGOUT: '/api/profile/logout',
    LOGIN: 'Login',
    GET_CONVERSATION: 'getConversation',
    GET_ONE_CONVERSATION: 'getOneConversation',
    GET_MESSAGE: 'getMessage',
    CHAT: 'Chat',
    CHECK_READED_MESSAGE: 'checkReadedMessage'
}

export const API_KEY = {
    LOGIN_EMAIL_KEY: 'loginEmail',
    LOGIN_PASSWORD_KEY: 'loginPassword',
    TOKEN_DEVICE_KEY: 'tokenDevice',
    ACTION_REQUEST_KEY: 'actionRequest',
    MANAGER_ID_KEY: 'managerID',
    SITE_ID_KEY: 'siteID',
    USER_ID_KEY: 'userID',
    PAGE_ID_KEY: 'pageID',
    MESSAGE_ID_KEY: 'messageID',
    MSG_ID_KEY: 'msg_id',
    MESSAGE_CHAT_TYPE_KEY: 'msgType',
    TEXT_MESSAGE_KEY: 'textMes',
    USER_SEND_KEY: 'msg_send',
    GROUP_ID_KEY: 'groupID',
    SEND_AT_KEY: 'send_at',
    USER_SEEN_KEY: 'userSeen'
}

class APICommonService extends RestClient {

    constructor() {
        // Initialize with your base URL
        super(API_URL.SERVER_HOST, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Cache-Control': 'no-cache',
            },
        });
    }

    updateHeader(params) {
        if (params) {
            for (var key in params) {
                this.headers[key] = params[key];
            }
        }
    }

    login = async (email, password) => {
        var params = {};
        params[API_KEY.LOGIN_EMAIL_KEY] = email;
        params[API_KEY.LOGIN_PASSWORD_KEY] = password;
        params[API_KEY.TOKEN_DEVICE_KEY] = Constants.fcmToken;
        params[API_KEY.ACTION_REQUEST_KEY] = API_URL.LOGIN;

        console.tlog('params', params);
        var resp = await this.POST('?', params);
        return resp;
    }

    getGroupChats = async () => {
        if (Constants.userInfo) {
            var params = {};
            params[API_KEY.MANAGER_ID_KEY] = Constants.userInfo.managerID;
            params[API_KEY.SITE_ID_KEY] = Constants.userInfo.managerOfSite;
            params[API_KEY.ACTION_REQUEST_KEY] = API_URL.GET_CONVERSATION;

            console.tlog('params', params);
            var resp = await this.POST('?', params);
            return resp;
        } else {
            return null;
        }
    }

    getConversationInfo = async (userID, pageID) => {
        let managerID = '';
        if (Constants.userInfo) {
            managerID = Constants.userInfo.managerID;
        }
        var params = {};
        params[API_KEY.USER_ID_KEY] = userID;
        params[API_KEY.PAGE_ID_KEY] = pageID;
        params[API_KEY.MANAGER_ID_KEY] = managerID;
        params[API_KEY.ACTION_REQUEST_KEY] = API_URL.GET_ONE_CONVERSATION;

        console.tlog('params', params);
        var resp = await this.POST('?', params);
        return resp;

    }

    getHistoryMessage = async (userID, pageID, managerID, messageID = '') => {
        var params = {};
        params[API_KEY.USER_ID_KEY] = userID;
        params[API_KEY.PAGE_ID_KEY] = pageID;
        params[API_KEY.MANAGER_ID_KEY] = managerID;
        params[API_KEY.MESSAGE_ID_KEY] = messageID;
        params[API_KEY.ACTION_REQUEST_KEY] = API_URL.GET_MESSAGE;

        console.tlog('params', params);
        var resp = await this.POST('?', params);
        return resp;
    }

    sendMessage = async (params) => {
        console.tlog('params', params);
        var resp = await this.POST('?', params);
        return resp;
    }

    trackReadLastMsgChat = async (params) => {
        console.tlog('params', params);
        var resp = await this.POST('?', params);
        return resp;
    }

    logOut = async () => {
        var resp = await this.POST(API_URL.LOGOUT);

        // Remove bearer header 
        var paramsHeader = {};
        paramsHeader[API_KEY.AUTHORIZATION_KEY] = ``;
        this.updateHeader(paramsHeader);

        return resp;

    }
};

export default new APICommonService();

