import ColorApp from '../utils/ColorApp';
import Constants from '../utils/Constants';

export default {
    boxShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: Constants.isIOS ? 2 : 1
        },
        shadowOpacity: Constants.isIOS ? 0.1 : 0.22,
        elevation: Constants.isIOS ? 5 : 3,
        shadowRadius: Constants.isIOS ? 2.62 : 2.22,
        backgroundColor: ColorApp.white
    },

    padLeftRightNormal: {
        paddingLeft: Constants.PAD_LEFT_RIGHT_NORMAL_APP,
        paddingRight: Constants.PAD_LEFT_RIGHT_NORMAL_APP
    },
    styleCircle: {
        width: 14,
        height: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: ColorApp.white
    },
    wrapperStyleCircle: {
        flexDirection: "row",
        position: "absolute",
        right: 6,
        bottom: 6
    },
    line_separate: {
        height: 1,
        backgroundColor: ColorApp.gray165_02
    },
    line_separate_small: {
        height: 2,
        backgroundColor: ColorApp.gray237
    },
    line_separate_normal: {
        height: 6,
        backgroundColor: ColorApp.gray237
    },
    line_separate_large: {
        height: 12,
        backgroundColor: ColorApp.gray237
    },
    lineDashedCheckout: { width: "100%", borderWidth: 1, borderColor: ColorApp.gray165, borderStyle: "dashed", borderRadius: 1 },
    btnNextCheckOut: {
        borderRadius: 4,
        marginLeft: 30,
        marginRight: 30,
        marginTop: 25,
        height: 42,
        backgroundColor: ColorApp.yellowBtn,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Constants.PAD_BOTTOM_CHECKOUT_BUTTON
    },
    textButtonCheckout: {
        fontSize: 12,
        color: ColorApp.blackApp,
        // fontFamily: Constants.FONT_NAME.LATO_SEMI_BOLD
    },
    lineHorizontalRecommendation: {
        height: 2,
        width: 20,
        backgroundColor: ColorApp.gray165
    },
    textNoItem: {
        // fontFamily: Constants.FONT_NAME.LATO_REGULAR,
        fontSize: 14,
        color: ColorApp.gray165
    },
    textRecommendation: {
        // fontFamily: Constants.FONT_NAME.LATO_SEMI_BOLD,
        fontSize: 12,
        color: ColorApp.blackApp,
        paddingLeft: 10, 
        paddingRight: 10
    }
}