import moment from "moment";
import React, { Component } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImageLoad from 'react-native-image-placeholder';
import { CustomCachedImage } from "react-native-img-cache";
import ColorApp from "../../utils/ColorApp";
import Constants from "../../utils/Constants";
import { getParsedDate } from '../../utils/TimeHelper';

export default class ItemMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forceLoad: false
        }
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

    _onOpenImageDetail = msg => {
        if (this.props.viewImageDetail) {
            this.props.viewImageDetail(msg);
        }
    };

    render() {
        let { msg } = this.props;

        let isMine;
        let chatTime;
        let message;
        let isShowText;
        let isShowAttachment;
        let imgType;
        let isUnread;
        let borderView = 10;

        message = msg.msg;

        if (msg.msg_send === Constants.USER_ROLE.MANAGER) {
            isMine = true;
            isUnread = msg.msg_status;
        }

        isShowAttachment =
            msg.type !== null && typeof msg.type !== "undefined" && msg.type >= 2;

        if (msg.type === Constants.CHAT_TYPE.IMAGE) {
            imgType = true;
        } else {
            isShowText = true;
        }

        let chatDate = moment(msg.msg_time).toDate();
        chatTime = getParsedDate(chatDate);

        return (
            <View style={styles.row_item}>
                <View
                    style={[
                        styles.row_item,
                        {
                            flexDirection: isMine ? "row" : "row",
                            justifyContent: !isMine ? "flex-start" : "flex-end"
                        }
                    ]}
                >
                    <View
                        style={[
                            styles.messageContainer,
                            {
                                justifyContent: !isMine ? "flex-start" : "flex-end",
                                marginLeft: isMine ? 50 : 0,
                                marginRight: isMine ? 0 : 50
                            }
                        ]}
                    >
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: !isMine ? "flex-start" : "flex-end",
                                flex: 1
                            }}
                        >

                            <View
                                style={{
                                    marginLeft: 20,
                                    marginRight: 10
                                }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        borderTopLeftRadius: isShowAttachment && imgType || isMine ? borderView : 0,
                                        borderTopRightRadius: isShowAttachment && imgType || !isMine ? borderView : 0,
                                        borderBottomLeftRadius: borderView,
                                        borderBottomRightRadius: borderView,
                                        overflow: 'hidden',
                                        borderWidth: 0,
                                        borderColor: 'transparent',
                                        backgroundColor: isMine ? 'rgba(201,201,201,0.3)' : ColorApp.yellowBtn
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.chat_content,
                                            {
                                                marginLeft: !isMine ? 0 : 0,
                                                marginBottom: !isMine ? 0 : 0,
                                                backgroundColor: 'transparent',
                                                paddingLeft: (isShowAttachment && imgType) ? 3 : 18,
                                                paddingRight: (isShowAttachment && imgType) ? 3 : 6
                                            },
                                        ]}
                                    >
                                        {isShowText && (
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                ref={"tv_message"}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: "left",
                                                        fontSize: 14,
                                                        color: ColorApp.blackApp,
                                                        // fontFamily: Constants.FONT_NAME.LATO_REGULAR,
                                                        paddingRight: 12
                                                    }}
                                                    styleName="multiline"
                                                >
                                                    {message}
                                                </Text>

                                            </TouchableOpacity>
                                        )}

                                        {isShowAttachment &&
                                            imgType && (
                                                <TouchableOpacity
                                                    activeOpacity={Constants.OPACITY_BUTTON}
                                                    onPress={() => this._onOpenImageDetail(msg)}
                                                >
                                                    <View
                                                        style={{
                                                            borderTopLeftRadius: borderView,
                                                            borderTopRightRadius: borderView,
                                                            borderBottomLeftRadius: borderView,
                                                            borderBottomRightRadius: borderView,
                                                            overflow: 'hidden'
                                                        }}>

                                                        <CustomCachedImage
                                                            component={ImageLoad}
                                                            source={{ uri: msg.message }}
                                                            isShowActivity={false}
                                                            style={styles.imgThumb}
                                                        />

                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                    </View>
                                </View>
                                {<View
                                    style={{
                                        flexDirection: "row",
                                        marginTop: 6,
                                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                                        marginRight: (isShowAttachment && imgType) ? 3 : 0
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: ColorApp.gray165,
                                            // fontFamily: Constants.FONT_NAME.LATO_REGULAR,
                                            textAlign: isMine ? 'right' : 'left',
                                        }}
                                    >
                                        {chatTime}
                                    </Text>

                                    {isMine && (
                                        <Image
                                            source={
                                                isUnread
                                                    ? require("./../../images/ic_unread_status.png")
                                                    : require("./../../images/ic_sent_status.png")
                                            }
                                            style={styles.ic_readed}
                                        />
                                    )}
                                </View>}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    messageContainer: {
        paddingRight: 0,
        minWidth: 70,
        flexDirection: "row",
        alignContent: "center",
        marginRight: 50,
        flex: 1
    },
    row_item: {
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 5,
        alignContent: "flex-end",
        alignItems: "flex-end"
    },

    group_avatar: {
        width: 44,
        height: 44,
        borderRadius: 22
    },
    ic_readed: {
        width: 17,
        height: 10,
        marginLeft: 5,
        marginTop: 2
    },

    chat_content: {
        flexDirection: "column",
        minHeight: 30,
        padding: 8,
        //borderRadius: 3.5
    },
    imgThumb: {
        width: 204,
        height: 153,
        resizeMode: "cover",
        alignSelf: "flex-start"
    }
});
