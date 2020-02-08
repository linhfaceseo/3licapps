
import RestClient from 'react-native-rest-client';
import Constants from '../utils/Constants';

const API_URL = {
    SERVER_HOST: 'https://3lichat.us/Server/Service/RequestAction.php', // DEV
    //SERVER_HOST: 'https://api.tingkh.com/v1', // LIVE
    GET_ALL_CATEGORIES: '/api/product-categories',
    GET_ALL_PARENT_CATEGORIES: '/api/product-parent-categories',
    GET_ALL_PARENT_CATEGORIES_WITH_CHILD: '/api/product-all-categories',
    GET_HOT_STORES_BY_CATEGORY: '/api/product-categories/<ID>/hot-stores',
    GET_PRODUCTS_BY_CATEGORY: '/api/product-categories',
    GET_PRODUCTS_JUST_ARRIVED: '/api/products/just-arrived',
    GET_PRODUCTS_ALMOST_GONE: '/api/products/almost-gone',
    GET_PRODUCTS_DISCOUNTED: '/api/products/discounted',
    GET_HOME_BANNERS: '/api/home/header-banner/',
    GET_HOT_CARDS: '/api/home/hot-cards',
    GET_FLASH_SALE: '/api/home/flash-sale',
    GET_HOME_PRODUCT: '/api/home/products',
    GET_ALL_PRODUCTS: '/api/products',
    GET_PRODUCT_FILTERS: '/api/products/<KEY>/filters',
    GET_MAY_ALSO_LIKE_PRODUCT: '/api/products/alsolike',
    GET_RELATED_PRODUCT: '/api/products/related/',
    GET_PRODUCT_DETAIL: '/api/products',
    PHONE_REGISTER: '/api/auth/phone-register',
    PHONE_VERIFY: '/api/auth/phone-verify',
    UPDATE_PROFILE: '/api/profile',
    GET_USER_PROFILE: '/api/profile',
    GET_COUNTRIES: '/api/countries',
    POST_TRACKING_EVENT: '/api/tracking/',
    GET_COLLECTIONS: '/api/collections',
    GET_ALL_SHIPPING_ADDRESS: '/api/profile/shipping-address',
    ADD_NEW_SHIPPING_ADDRESS: '/api/profile/shipping-address',
    CREATE_ORDER: '/api/orders',
    GET_ALL_ORDERS: '/api/v2/orders',
    GET_ORDER_DETAIL: '/api/v2/orders',
    GET_SELLER_DETAIL: '/api/sellers',
    UPDATE_INTEREST: '/api/user-profile/update-interests',
    CONFIRM_RECEIVED_ORDER: '/api/order/<ID>/confirm',
    GET_LIST_FOLLOWING_SELLER: '/api/profile/following-sellers',
    GET_RECOMMENDATION_SELLERS: '/api/sellers/recommended-stores',
    UPDATE_FAVORITE_PRODUCT_STATUS: '/api/products/<ID>/like',
    UPDATE_FCM_TOKEN: '/api/pnsTokens',
    START_SINGLE_CHAT: '/api/chat/start-single-chat',
    SEND_MESSAGE_CHAT: '/api/chat/send',
    GET_CHAT_HISTORY: '/api/chat/history/<group_id>',
    GET_GROUP_CHAT: '/api/chat/list-groups-chat-of-member',
    TRACK_READ_LAST_MSG_CHAT: 'api/chat/track-read-chat',
    GET_NOTIFICATIONS_SYSTEM: '/api/notifications',
    UPDATE_READ_STATUS_NOTIFICATION: '/api/notifications/read',
    REMOVE_NOTIFICATION: '/api/notifications/remove',
    REMOVE_ALL_NOTIFICATION: '/api/notifications/remove-all',
    GET_UNREAD_NUMBER_NOTIFICATION: '/api/notifications/count-unread',
    ADD_REVIEW_PRODUCT: '/api/products/<ID>/review',
    GET_ALL_REVIEWS_PRODUCT: '/api/products/<ID>/reviews',
    LOGOUT: '/api/profile/logout',

    LOGIN: 'Login'
}

export const API_KEY = {
    ACCEPT_LANGUAGE_KEY: 'Accept-Language',
    X_TING_FCM_TOKEN_KEY: 'x-ting-fcm-token',
    PUSHING_TOKEN_KEY: 'pushing_toke',
    INTERESTS_KEY: 'interests',
    TYPE_KEY: 'type',
    OFFSET_KEY: 'offset',
    LIMIT_KEY: 'limit',
    PHONE_KEY: 'phone',
    COUNTRY_KEY: 'country',
    REQUEST_ID_KEY: 'requestId',
    PIN_KEY: 'pin',
    USER_NAME_KEY: 'username',
    GENDER_KEY: 'gender',
    DATE_OF_BIRTH_KEY: 'date_of_birth',
    EMAIL_KEY: 'email',
    AUTHORIZATION_KEY: 'Authorization',
    IMAGE_KEY: 'image',
    ADDRESS_KEY: 'address',
    CITY_KEY: 'city',
    TOWN_KEY: 'town',
    COMMUNE_KEY: 'commune',
    REMARK_KEY: 'remark',
    PRODUCTS_KEY: 'products',
    PAYMENT_TYPE_KEY: 'paymentType',
    SHIPPING_ID_KEY: 'shippingId',
    RECEIVER_NAME_KEY: 'receive_name',
    LAT_KEY: 'lat',
    LNG_KEY: 'lng',
    IS_DEFAULT_KEY: 'isDefault',
    PARTNER_ID_KEY: 'partner_id',
    CHAT_BY_KEY: 'chat_by',
    GROUP_ID_KEY: 'group_id',
    MESSAGE_KEY: 'message',
    VENDOR_ID_KEY: 'vendor_id',
    SEND_AT_KEY: 'send_at',
    SEEN_BY_KEY: 'seen_by',
    LAST_MESSAGE_ID_KEY: 'last_message_id',
    IS_MEMBER_KEY: 'is_member',
    LANGUAGE_KEY: 'language',
    IDS_KEY: 'ids',
    RATING_KEY: 'rating',
    DESCRIPTION_KEY: 'description',
    S_KEY: 's',
    SORT_KEY: 'sort',
    SECCOND_RECORD_AUDIO: 'second_record',


    LOGIN_EMAIL_KEY: 'loginEmail',
    LOGIN_PASSWORD_KEY: 'loginPassword',
    TOKEN_DEVICE_KEY: 'tokenDevice',
    ACTION_REQUEST_KEY: 'actionRequest',
    MANAGER_ID_KEY: 'managerID',
    SITE_ID_KEY: 'siteID',

}

class APICommonService extends RestClient {

    constructor() {
        // Initialize with your base URL
        super(API_URL.SERVER_HOST, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Cache-Control': 'no-cache',
                // 'Postman-Token': 'd37b7bbd-5bc1-4882-b262-e74a8e0b5639'
            },
        });
    }

    login = async (email, password) => {
        var params = {};
        params[API_KEY.LOGIN_EMAIL_KEY] = email;
        params[API_KEY.LOGIN_PASSWORD_KEY] = password;
        params[API_KEY.TOKEN_DEVICE_KEY] = Constants.fcmToken;
        params[API_KEY.ACTION_REQUEST_KEY] = API_URL.LOGIN;
        // console.tlog('login params', params);

        var formBody = [];
        for (var property in params) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        console.tlog(formBody);
        formBody = formBody.join("&");


        // params[API_KEY.MANAGER_ID_KEY] = 2;
        // params[API_KEY.SITE_ID_KEY] = 2;
        // params[API_KEY.ACTION_REQUEST_KEY] = 'getConversation';

        //console.tlog('login params ENDCODE', formBody);

        var resp = await this.POST('',params);
        console.tlog('=====',resp);
        return resp;

        // var resp = await fetch(API_URL.SERVER_HOST, {
        //     method: 'POST',
        //     headers: {
        //          'Accept': 'application/json',
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     body: formBody
        // })
        // console.tlog('=====',resp);
        // return resp;
        // .then(resp => {
        //     console.tlog('login params RESP', resp);
        // }).catch(err=>{
        //     console.tlog('login params ERR', err);
        // })
    }

    updateHeader(params) {
        if (params) {
            for (var key in params) {
                this.headers[key] = params[key];
            }
        }
    }

    updateTokenBearer(tokenParam = null) {
        let token = tokenParam;
        if (token === null) {
            if (Constants.userInfoFullData && Constants.userInfoFullData.accessToken) {
                token = Constants.userInfoFullData.accessToken.token;
            }
        }

        if (token && token !== '') {
            var paramsHeader = {};
            paramsHeader[API_KEY.AUTHORIZATION_KEY] = `Bearer ${token}`;
            this.updateHeader(paramsHeader);
        }
    }



    updateInterest = async (interests) => {
        var params = {};
        params[API_KEY.INTERESTS_KEY] = interests;

        var resp = await this.POST(API_URL.UPDATE_INTEREST, params);

        return resp;
    }

    getAllCategories = async () => {
        var resp = await this.GET(API_URL.GET_ALL_CATEGORIES);

        return resp;
    }

    getAllParentCategories = async () => {
        var resp = await this.GET(API_URL.GET_ALL_PARENT_CATEGORIES);

        return resp;
    }

    getAllParentCategoriesWithChild = async () => {
        var resp = await this.GET(API_URL.GET_ALL_PARENT_CATEGORIES_WITH_CHILD);

        return resp;
    }

    getHomeBanners = async () => {
        var resp = await this.GET(API_URL.GET_HOME_BANNERS);

        return resp;
    }

    getHotCards = async () => {
        var resp = await this.GET(API_URL.GET_HOT_CARDS);

        return resp;
    }

    getFlashSales = async () => {
        var resp = await this.GET(API_URL.GET_FLASH_SALE);

        return resp;
    }

    getProductFilters = async (searchText) => {
        let url = `${API_URL.GET_PRODUCT_FILTERS}`;
        url = url.replace('<KEY>', searchText);

        var resp = await this.GET(url);

        return resp;
    }

    getMayAlsoLikeProducts = async (productId) => {
        let url = `${API_URL.GET_MAY_ALSO_LIKE_PRODUCT}/${productId}`;
        var resp = await this.GET(url);

        return resp;
    }

    getRelatedProducts = async (productId) => {
        let url = `${API_URL.GET_RELATED_PRODUCT}/${productId}`;
        var resp = await this.GET(url);

        return resp;
    }

    getProductDetail = async (productId) => {
        let url = `${API_URL.GET_PRODUCT_DETAIL}/${productId}`;

        var resp = await this.GET(url);

        return resp;
    }

    registerPhone = async (phoneNumber, countryId) => {
        var params = {};
        params[API_KEY.PHONE_KEY] = phoneNumber;
        params[API_KEY.COUNTRY_KEY] = countryId;

        var resp = await this.POST(API_URL.PHONE_REGISTER, params);

        return resp;
    }


    updateProfile = async (params, token) => {

        this.updateTokenBearer(token);

        var resp = await this.POST(API_URL.UPDATE_PROFILE, params);

        return resp;
    }

    getUserProfile = async (token) => {
        this.updateTokenBearer(token);

        var resp = await this.GET(API_URL.GET_USER_PROFILE);

        return resp;
    }

    getCountries = async () => {
        var resp = await this.GET(API_URL.GET_COUNTRIES);

        return resp;
    }

    getCollections = async (offset, limit) => {
        var params = {};
        params[API_KEY.OFFSET_KEY] = offset;
        params[API_KEY.LIMIT_KEY] = limit;

        var resp = await this.GET(API_URL.GET_COLLECTIONS, params);

        return resp;
    }

    getProductsByCollectionId = async (collectionId, offset, limit) => {
        var params = {};
        params[API_KEY.OFFSET_KEY] = offset;
        params[API_KEY.LIMIT_KEY] = limit;

        let url = `${API_URL.GET_COLLECTIONS}/${collectionId}`;
        var resp = await this.GET(url, params);

        return resp;
    }

    getAllShippingAddress = async () => {
        this.updateTokenBearer();

        var resp = await this.GET(API_URL.GET_ALL_SHIPPING_ADDRESS);

        return resp;
    }

    addNewShippingAddress = async (receiverName, receiverPhone, address, city, town, commune, lat, lng, remark, isDefault = false, images) => {
        this.updateTokenBearer();

        var params = {};
        params[API_KEY.RECEIVER_NAME_KEY] = receiverName;
        params[API_KEY.PHONE_KEY] = receiverPhone;
        params[API_KEY.ADDRESS_KEY] = address;
        params[API_KEY.CITY_KEY] = city;
        params[API_KEY.TOWN_KEY] = town;
        params[API_KEY.COMMUNE_KEY] = commune;
        params[API_KEY.LAT_KEY] = lat;
        params[API_KEY.LNG_KEY] = lng;
        params[API_KEY.REMARK_KEY] = remark;
        params[API_KEY.IS_DEFAULT_KEY] = isDefault;

        if (images.length > 0) {
            for (let index = 1; index <= images.length; index++) {
                params[`${API_KEY.IMAGE_KEY}${index}`] = images[index - 1].data;
            }
        }

        var resp = await this.POST(API_URL.ADD_NEW_SHIPPING_ADDRESS, params);

        return resp;
    }


    getProductsByCategory = async (categoryId, offset, limit) => {
        var params = {};
        params[API_KEY.OFFSET_KEY] = offset;
        params[API_KEY.LIMIT_KEY] = limit;

        let url = `${API_URL.GET_PRODUCTS_BY_CATEGORY}/${categoryId}`;

        var resp = await this.GET(url, params);

        return resp;
    }


    getListFollowingSeller = async () => {
        var resp = await this.GET(API_URL.GET_LIST_FOLLOWING_SELLER);

        return resp;
    }

    getRecommendationSellers = async () => {
        var resp = await this.GET(API_URL.GET_RECOMMENDATION_SELLERS);

        return resp;
    }

    updateFavProductStatus = async (productId) => {
        let url = API_URL.UPDATE_FAVORITE_PRODUCT_STATUS;
        url = url.replace('<ID>', productId);
        var resp = await this.POST(url);

        return resp;
    }

    updateFCMToken = async () => {
        var resp = await this.POST(API_URL.UPDATE_FCM_TOKEN);
        return resp
    }

    startSingleChat = async (vendorId) => {
        var params = {};
        params[API_KEY.PARTNER_ID_KEY] = vendorId;

        var resp = await this.POST(API_URL.START_SINGLE_CHAT, params);
        return resp
    }

    sendMessage = async (params) => {
        var resp = await this.POST(API_URL.SEND_MESSAGE_CHAT, params);
        return resp
    }

    getGroupChats = async () => {
        var resp = await this.GET(API_URL.GET_GROUP_CHAT);

        return resp;
    }

    getChatHistory = async (groupId, offset, limit) => {
        var params = {};
        params[API_KEY.OFFSET_KEY] = offset;
        params[API_KEY.LIMIT_KEY] = limit;

        let url = `${API_URL.GET_CHAT_HISTORY}`;
        url = url.replace('<group_id>', groupId);

        var resp = await this.GET(url, params);

        return resp;
    }

    getNotificationsSystem = async (type, offset, limit) => {
        var params = {};
        params[API_KEY.TYPE_KEY] = type;
        params[API_KEY.OFFSET_KEY] = offset;
        params[API_KEY.LIMIT_KEY] = limit;

        var resp = await this.GET(API_URL.GET_NOTIFICATIONS_SYSTEM, params);

        return resp;
    }

    updateReadStatusNotification = async (ids) => {
        var params = {};
        params[API_KEY.IDS_KEY] = ids;

        var resp = await this.POST(API_URL.UPDATE_READ_STATUS_NOTIFICATION, params);
        return resp;
    }

    removeNotification = async (ids) => {
        var params = {};
        params[API_KEY.IDS_KEY] = ids;

        var resp = await this.POST(API_URL.REMOVE_NOTIFICATION, params);
        return resp;
    }

    removeAllNotification = async () => {
        var resp = await this.POST(API_URL.REMOVE_ALL_NOTIFICATION);
        return resp;
    }

    getUnreadNumberNotification = async () => {
        var resp = await this.GET(API_URL.GET_UNREAD_NUMBER_NOTIFICATION);

        return resp;
    }

    trackReadLastMsgChat = async (params) => {
        var resp = await this.POST(API_URL.TRACK_READ_LAST_MSG_CHAT, params);
        return resp;
    }

    addReviewProduct = async (productId, rating, description, images) => {
        this.updateTokenBearer();

        var params = {};
        params[API_KEY.RATING_KEY] = rating;
        params[API_KEY.DESCRIPTION_KEY] = description;

        if (images.length > 0) {
            for (let index = 1; index <= images.length; index++) {
                params[`${API_KEY.IMAGE_KEY}${index}`] = images[index - 1].data;
            }
        }

        let url = API_URL.ADD_REVIEW_PRODUCT;
        url = url.replace('<ID>', productId);

        var resp = await this.POST(url, params);

        return resp;
    }

    getAllReviewsProduct = async (productId, offset, limit) => {
        var params = {};
        params[API_KEY.OFFSET_KEY] = offset;
        params[API_KEY.LIMIT_KEY] = limit;

        let url = `${API_URL.GET_ALL_REVIEWS_PRODUCT}`;
        url = url.replace('<ID>', productId);

        var resp = await this.GET(url, params);

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

    postTrackingEvent = async (key, paramsJson) => {
        var resp = await this.POST(API_URL.POST_TRACKING_EVENT + key, paramsJson);
        return resp
    }
};

export default new APICommonService();

