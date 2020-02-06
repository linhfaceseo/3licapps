import React, { Component } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Constants from "../../utils/Constants";
import ColorApp from "../../utils/ColorApp";
import i18n from "../../translations/i18n";

export default class HeaderChat extends Component {

	constructor(props){
		super(props);
	}

	render() {
		const { hideLeft, vendorInfo } = this.props;

        let avatar = '';
        let name = '';

        if (vendorInfo) {
            avatar = vendorInfo.image;
            name = vendorInfo.name;
        }

		return(
			<View style={[styles.container, {
                paddingTop: Constants.PAD_TOP_HEADER,
            }]}>
				<View style={styles.headerContent}>
					<Image
                        style={styles.avatar}
                        source={{ uri: avatar }} />
					<View style={{justifyContent:'flex-start'}}>
						<Text
							numberOfLines={1}
							ellipsizeMode='tail'
							style={styles.textHeader}>{name}
						</Text>
						<View style={styles.statusWrapper}>
							<View style={styles.status}></View>
							<Text style={styles.statusText}>{i18n.t(Constants.TRANSLATE_KEY.online)}</Text>
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

			</View>
		)
	}
}

const styles = StyleSheet.create({
	headerWrapper: {
		flex:1,
	},
	container: {
        width: '100%',
        height: Constants.HEIGHT_NAVIGATION_BAR,
		flexDirection: "row",
		backgroundColor: ColorApp.yellowApp,
		alignItems:'flex-start'
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
		flexDirection:'row',
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
    viewTitle: {
        width: '100%',
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 50,
        paddingRight: 50
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
		marginRight:5,
		marginTop: 5,
	},
	statusWrapper: {
		display:'flex',
		flexDirection:'row',
	},
	statusText: {
		fontSize: 12,
		// fontFamily: Constants.FONT_NAME.LATO_REGULAR,
		color: ColorApp.blackApp,
	}
})