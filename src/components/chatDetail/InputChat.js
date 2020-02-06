import React, { Component } from "react";
import { TextInput } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import Constants from "../../utils/Constants";
import ColorApp from '../../utils/ColorApp';

export default class InputChat extends Component {
    state = {
        text: null,
        height: 37,
    };

    componentDidMount() {
        this.resetListener = EventRegister.addEventListener(
            Constants.APP_EVENT_KEY.RESET_TEXT_INPUT_CHAT,
            () => {
                this.setViewState({ text: '' });
                this.refs["chat-input"].setNativeProps({ text: '' });
            }
        );
    }

    setViewState = (...params) => {
        if (!!this.hadUnmount) return;
        this.setState(...params);
    };


    componentWillUnmount() {
        this.hadUnmount = true;
        if (this.resetListener) {
            EventRegister.removeEventListener(this.resetListener);
        }
        this.resetListener = null;
    }

    onChangeText = text => {
        this.setViewState({ text: text });
        this.props.onChangeText(text);
    };

    onSubmitEditing = () => {
        this.props.submitAction(this.state.text);
    };

    onFocus = event => {
        if (this.props.onFocus) {
            this.props.onFocus(this.refs.input);
        }
    };

    onBlur = () => {
        if (this.props.submitOnBlur) {
            this.onSubmitEditing();
        }
    };

    onLayout = event => {
        if (this.props.onLayout) {
            this.props.onLayout(event);
        }
    };

    render() {
        var hAdjust = this.state.height > 100 ? 100 : this.state.height;
        var padTop = 5; // Android
        if (Constants.isIOS) {
            padTop = 9; // Done
        }

        return (
            <TextInput
                multiline={true}
                placeholder={this.props.placeholder}
                onChangeText={this.onChangeText}
                //onSubmitEditing={this.onSubmitEditing}
                onContentSizeChange={(event) => {
                    this.setViewState({ height: event.nativeEvent.contentSize.height })
                }}
                onLayout={this.onLayout}
                defaultValue={this.props.defaultValue}
                value={this.state.text}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                autoCorrect={true}
                ref={"chat-input"}
                placeholderTextColor={ColorApp.gray165}
                underlineColorAndroid="transparent"
                style={{
                    backgroundColor: "transparent",
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: padTop,
                    paddingBottom: 5,
                    marginLeft: 2,
                    marginRight: 2,
                    height: Math.max(37, hAdjust),
                    fontSize: 14,
                    // fontFamily: Constants.FONT_NAME.LATO_REGULAR,
                    color: ColorApp.blackApp
                }}
            />
        );
    }
}
