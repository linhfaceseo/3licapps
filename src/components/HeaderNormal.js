import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GlobalStyles from '../utils/GlobalStyles';
import ColorApp from "./../utils/ColorApp";
import Constants from "./../utils/Constants";


export default class HeaderNormal extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { hideLeft } = this.props;

        return (
            <View style={[styles.container, {
                paddingTop: Constants.PAD_TOP_HEADER,
                ...this.props.hideBoxShadow ? {} : GlobalStyles.boxShadow,
                ...this.props.customStyleHeader,
            }]}>

                <View style={styles.viewTitle}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={[styles.textHeader, this.props.textHeaderStyle]}>{this.props.title ? this.props.title : ''}</Text>
                </View>

                {!hideLeft && <TouchableOpacity
                    activeOpacity={Constants.OPACITY_BUTTON}
                    onPress={() => {
                        this.props.onBackPress()
                    }}
                    style={styles.item_header}
                >
                    <Image
                        style={this.props.leftStyle ? this.props.leftStyle : styles.iconBack}
                        source={this.props.leftResource ? this.props.leftResource : require('./../images/ic_back.png')}
                    />
                </TouchableOpacity>}

                <View style={{ flex: 1 }}></View>

                {this.props.showRight && <TouchableOpacity
                    activeOpacity={Constants.OPACITY_BUTTON}
                    onPress={this.props.onIconRightOnePress}
                    style={[styles.item_headerRight, {
                        marginRight: this.props.showNotification ? 0 : 10
                    }]}
                >
                    <Image
                        style={this.props.rightStyle ? this.props.rightStyle : styles.icon_search_black}
                        source={this.props.rightResource ? this.props.rightResource : require('./../images/ic_search_black.png')}
                    />

                </TouchableOpacity>}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: Constants.HEIGHT_NAVIGATION_BAR,
        flexDirection: "row",
        alignItems: 'center'
    },

    item_header: {
        width: 50,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    item_headerRight: {
        paddingLeft: 10,
        paddingRight: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconBack: {
        width: 7,
        height: 12
    },
    icon_search_black: {
        width: 16,
        height: 16,
    },
    textHeader: {
        fontSize: 16,
        // fontFamily: Constants.FONT_NAME.LATO_BOLD,
        color: ColorApp.blackApp
    },
    viewTitle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: Constants.PAD_TOP_HEADER,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 50,
        paddingRight: 50
    }
});

