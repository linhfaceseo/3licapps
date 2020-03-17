import moment from 'moment';
import React, { Component } from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ColorApp from "../../utils/ColorApp";
import Constants from "../../utils/Constants";
import i18n from '../../translations/i18n';
import { getParsedDate } from '../../utils/TimeHelper';


export default class ItemGroup extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { item } = this.props;

        let avatar = '';
        let name = '';
        let lastMsg = '';
        let numUnread = item.msg_number_unread_message_user || 0;
        let numUnreadDisplay = '';
        if (numUnread > 99) {
            numUnreadDisplay = '99+';
        } else if (numUnread > 0) {
            numUnreadDisplay = `${numUnread}`;
        }
        let sendTime = '';
        let showPageName = false;
        let pageName = item.PageName;
        if (!pageName || pageName === '') {
            pageName = item.PageLink;
        }
        if (pageName && pageName !== '') {
            pageName = pageName.trim();
            showPageName = true;
        }


        if (item.vendor) {
            avatar = item.vendor.image;
            name = item.vendor.name;
        }
        lastMsg = item.msg;
        let chatDate = moment(item.msg_time).toDate();
        sendTime = getParsedDate(chatDate);
        if (item.type === Constants.CHAT_TYPE.IMAGE) {
            lastMsg = i18n.t(Constants.TRANSLATE_KEY.sent_an_image_msg_alias);
        }

        return (
            <TouchableOpacity
                activeOpacity={Constants.OPACITY_BUTTON}
                onPress={() => {
                    if (this.props.onItemGroupMessageSelect) {
                        this.props.onItemGroupMessageSelect(item);
                    }
                }}
                style={styles.msgItem}>
                <View>
                    <View style={{ flexDirection: 'row' }}>

                        <Image
                            style={styles.avatar}
                            source={avatar ? { uri: avatar } : require('../../images/ic_avatar.png')} />
                        <View style={[styles.status, {
                            backgroundColor: item.isOnline ? ColorApp.green : ColorApp.gray165
                        }]} />
                        <View style={{
                            flex: 1,
                            marginRight: 5
                        }}>
                            <Text style={styles.name}>{name}</Text>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={{ marginTop: 5 }}>{lastMsg}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <View style={[styles.outTextNumber, { backgroundColor: numUnread > 0 ? ColorApp.yellowBtn : ColorApp.transparent }]}>
                                <Text style={styles.textNumber}>{numUnreadDisplay}</Text>
                            </View>
                            <Text style={[styles.msgTime, { marginTop: 2 }]}>{sendTime}</Text>
                        </View>
                    </View>
                    {showPageName && <TouchableOpacity
                        disabled={false}
                        activeOpacity={Constants.OPACITY_BUTTON}
                        style={{ marginLeft: 73 }}
                        onPress={() => {
                            if (item.PageLink && item.PageLink !== '') {
                                Linking.openURL(item.PageLink);
                            }
                        }}>
                        <Text
                            numberOfLines={2}
                            style={{ color: ColorApp.blueApp, textDecorationLine: 'underline', fontStyle: 'italic' }}>{pageName}</Text>
                    </TouchableOpacity>}
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    msgItem: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 15,
        paddingLeft: 15,
        borderBottomColor: ColorApp.gray205_207_214,
        borderBottomWidth: 1
    },
    avatar: {
        marginRight: 15,
        width: 58,
        height: 58,
        resizeMode: 'cover',
        borderRadius: 58,
    },
    status: {
        position: 'absolute',
        left: 40,
        bottom: 0,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'white',
        width: 12,
        height: 12,
        backgroundColor: ColorApp.green
    },
    name: {
        fontSize: 16,
        // fontFamily: Constants.FONT_NAME.LATO_BOLD,
        color: ColorApp.blackApp
    },
    outTextNumber: {
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: ColorApp.yellowBtn,
        // alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    textNumber: {
        color: ColorApp.blackApp,
        fontSize: 10,
        textAlign: 'center',
        // fontFamily: Constants.FONT_NAME.LATO_BOLD
    },
    msgTime: {
        color: ColorApp.gray165,
        fontSize: 12,
        // fontFamily: Constants.FONT_NAME.LATO_REGULAR,
    }
});

