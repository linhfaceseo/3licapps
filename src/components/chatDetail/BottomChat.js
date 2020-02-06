import React, { Component } from "react";
import { Image, Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import ColorApp from "../../utils/ColorApp";
import Constants from "../../utils/Constants";
import InputChat from "./InputChat";

export default class BottomChat extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    setViewState = (...params) => {
        if (!!this.hadUnmount) return;
        this.setState(...params);
    };

    componentWillUnmount() {
        this.hadUnmount = true;
    }

    render() {

        return (
            <View
                style={{
                    flexDirection: "row",
                    paddingTop: 15,
                    paddingBottom: 15,
                    marginBottom: Constants.isIPhoneX ? 40 : 0,
                    backgroundColor: ColorApp.grayBackground,
                    alignItems: "center"
                }}
            >
                {/* Button emoji */}
                {/* <TouchableOpacity
                    style={styles.btnEmoji}
                >
                    <Image
                        style={styles.emoji_ic}
                        source={require("./../../images/ic_emoji.png")}
                    />
                </TouchableOpacity> */}

                <View style={{ flex: 1 }}>

                    <InputChat
                        onChangeText={text => {
                            this.mCurrentText = text;
                        }}
                        submitAction={text => {
                            this.mCurrentText = text;
                            Keyboard.dismiss();
                        }}
                        defaultValue={this.mCurrentText || ""}
                        placeholder="Type a message here..."
                        // onFocus={this._onMessageInputFocus}
                        showBorderInput={true}
                    />
                </View>
                {/* Add file */}
                <TouchableOpacity
                    activeOpacity={Constants.OPACITY_BUTTON}
                    onPress={() => {
                        if (this.props.onAddImagePress) {
                            this.props.onAddImagePress();
                        }
                    }}>
                    <Image
                        style={styles.iconAddFile}
                        source={require("./../../images/ic_plus_gray.png")}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={Constants.OPACITY_BUTTON}
                    onPress={() => {
                        const tmpText =
                            this.mCurrentText && typeof this.mCurrentText !== "undefined"
                                ? this.mCurrentText + ""
                                : "";
                        this.mCurrentText = "";

                        if (tmpText.length > 0 && this.props.sendMessage) {
                            this.props.sendMessage(tmpText);

                            EventRegister.emitEvent(Constants.APP_EVENT_KEY.RESET_TEXT_INPUT_CHAT, {});
                        }
                    }}>
                    <Image
                        style={styles.send_ic}
                        source={require("./../../images/ic_send_msg_black.png")}
                    />
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: Constants.HEIGHT_NAVIGATION_BAR,
        flexDirection: "row"
    },
    iconAddFile: {
        width: 18,
        height: 18,
        marginRight: 15,
        marginLeft: 10
    },
    record_ic: {
        width: 24,
        height: 24,
        marginRight: 4,
        marginLeft: 11
    },
    emoji_ic: {
        width: 22,
        height: 22,
        marginRight: 4,
        marginLeft: 12
    },
    send_ic: {
        width: 24,
        height: 18,
        marginLeft: 7,
        marginRight: 14
    },
});

