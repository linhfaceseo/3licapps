import React, { Component } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Constants from "../../utils/Constants";
import ColorApp from "../../utils/ColorApp";
import i18n from "../../translations/i18n";
import { EventRegister } from "react-native-event-listeners";

export default class HeaderChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOnline: this.props.isOnline
        }
    }

    setViewState = (...params) => {
        if (!!this.hadUnmount) return;
        this.setState(...params);
    };

    componentWillUnmount() {
        this.hadUnmount = true;
        if (this.onlineLst) {
            EventRegister.removeEventListener(this.onlineLst);
        }

        if (this.offlineLst) {
            EventRegister.removeEventListener(this.offlineLst);
        }
    }

    componentDidMount() {
        /* Add event listener when have users online/offline */
        this.onlineLst = EventRegister.addEventListener(Constants.APP_EVENT_KEY.IO_USERS_ONLINE, (usersOnline) => {
            const { chatInfo } = this.props;

            if (!chatInfo.isOnline && usersOnline && usersOnline.length > 0) {
                // Find group user online
                let haveOnline = usersOnline.find(online => online.user_id === chatInfo.msg_GroupChatSocketUser);
                if (haveOnline) {
                    chatInfo.isOnline = true;

                    this.setViewState({
                        isOnline: true
                    });
                }
            }
        });

        /* Add event listener when have users online/offline */
        this.offlineLst = EventRegister.addEventListener(Constants.APP_EVENT_KEY.IO_USER_OFFLINE, (userOffline) => {
            const { chatInfo } = this.props;
            if (chatInfo.isOnline && userOffline.user_id === chatInfo.msg_GroupChatSocketUser) {
                chatInfo.isOnline = false;

                this.setViewState({
                    isOnline: false
                });
            }
        });
    }

    render() {
        const { hideLeft, chatInfo } = this.props;

        let avatar = require('../../images/ic_avatar.png');
        let name = 'User';
        if (chatInfo) {
            name = chatInfo.msg_userPhoneNumber;
        }

        return (
            <View style={[styles.container, {
                paddingTop: Constants.PAD_TOP_HEADER,
            }]}>
                <View style={styles.headerContent}>
                    <Image
                        style={styles.avatar}
                        source={avatar} />
                    <View style={{ justifyContent: 'flex-start' }}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode='tail'
                            style={styles.textHeader}>{name}
                        </Text>
                        <View style={styles.statusWrapper}>
                            <View style={[styles.status, {
                                backgroundColor: this.state.isOnline ? ColorApp.green : ColorApp.gray165
                            }]}></View>
                            <Text style={styles.statusText}>{this.state.isOnline ? i18n.t(Constants.TRANSLATE_KEY.online) : i18n.t(Constants.TRANSLATE_KEY.offline)}</Text>
                        </View>
                    </View>
                </View>

                {!hideLeft && <TouchableOpacity
                    activeOpacity={Constants.OPACITY_BUTTON}
                    onPress={() => {
                        this.props.onBackPress()
                    }}
                    style={styles.item_header}
                >
                    <Image
                        style={this.props.leftStyle ? this.props.leftStyle : styles.icon_header}
                        source={this.props.leftResource ? this.props.leftResource : require('../../images/ic_back.png')}
                    />
                </TouchableOpacity>}
                <View style={{ flex: 1 }}></View>
                {false && <TouchableOpacity
                    activeOpacity={Constants.OPACITY_BUTTON}
                    onPress={this.props.onIconRightOnePress}
                    style={[styles.item_headerRight, {
                        marginRight: this.props.showNotification ? 0 : 10
                    }]}
                >
                    <Image
                        style={this.props.rightStyle ? this.props.rightStyle : styles.icon_logout_black}
                        source={this.props.rightResource ? this.props.rightResource : require('../../images/ic_logout.png')}
                    />

                </TouchableOpacity>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: Constants.HEIGHT_NAVIGATION_BAR,
        flexDirection: "row",
        backgroundColor: ColorApp.bg_app,
        alignItems: 'flex-start'
    },
    headerContent: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: Constants.PAD_TOP_HEADER,
        left: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 50,
        paddingRight: 50,
        flexDirection: 'row',
    },
    item_header: {
        width: 60,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon_header: {
        width: 9,
        height: 15
    },
    textHeader: {
        fontSize: 16,
        // fontFamily: Constants.FONT_NAME.LATO_BOLD,
        color: ColorApp.blackApp
    },
    avatar: {
        marginRight: 15,
        width: 38,
        height: 38,
        resizeMode: 'cover',
        borderRadius: 19,
    },
    status: {
        borderRadius: 8,
        width: 8,
        height: 8,
        backgroundColor: ColorApp.green,
        marginRight: 5,
        marginTop: 5,
    },
    statusWrapper: {
        display: 'flex',
        flexDirection: 'row',
    },
    statusText: {
        fontSize: 12,
        // fontFamily: Constants.FONT_NAME.LATO_REGULAR,
        color: ColorApp.blackApp,
    },
    item_headerRight: {
        paddingLeft: 10,
        paddingRight: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon_logout_black: {
        width: 25,
        height: 25,
    },
})