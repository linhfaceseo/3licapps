import React, { Component } from 'react';
import { Modal, StyleSheet, View, Image, StatusBar, TouchableOpacity, Text } from 'react-native';
import PhotoView from "react-native-photo-view";
import Carousel from 'react-native-snap-carousel';
import ColorApp from '../utils/ColorApp';
import Constants from '../utils/Constants';

export default class PhotoDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forceLoad: false,
            itemIndex: this.props.currentIndex ? this.props.currentIndex : 0
        }
    }

    setViewState = (...params) => {
        if (!!this.hadUnmount) return;
        this.setState(...params);
    };

    componentWillUnmount() {
        this.hadUnmount = true;
        StatusBar.setBackgroundColor(ColorApp.bg_app, false);
    }

    componentDidMount() {
        StatusBar.setBackgroundColor(ColorApp.black, false);
    }

    renderItemPhoto({ item, index }) {
        return (
            <PhotoView
                source={{ uri: item.image }}
                minimumZoomScale={1}
                maximumZoomScale={10}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                androidScaleType="fitStart"
                onLoad={() => console.warn("Image loaded!", "Loaded")}
                style={{ width: "100%", height: "100%" }}
            />
        );
    };

    render() {
        let showImage = false;
        let { images } = this.props;
        let caption = '';
        if (images && images.length > 0) {
            showImage = true;
            caption = images[this.state.itemIndex].name;
        }

        return (
            <View style={{ flex: 1, backgroundColor: ColorApp.black, position: 'absolute' }}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.props.showProductOptionModal}
                    onRequestClose={() => {
                    }}
                >
                    <View style={styles.wrapperModal}>
                        {showImage && <Carousel
                            loop={false}
                            animate={false}
                            indicatorAtBottom={true}
                            data={images}
                            renderItem={this.renderItemPhoto}
                            sliderWidth={Constants.deviceW}
                            itemWidth={Constants.deviceW}
                            firstItem={this.props.currentIndex}
                            onSnapToItem={(index) => this.setViewState({ itemIndex: index })}
                        />}

                        <View style={{
                            position: 'absolute',
                            bottom: Constants.isIPhoneX ? 30 : 10,
                            width: '100%'
                        }}>
                            <Text style={{
                                color: ColorApp.white,
                                // fontFamily: Constants.FONT_NAME.LATO_REGULAR,
                                fontSize: 12,
                                textAlign: 'center',
                                paddingLeft: 15,
                                paddingRight: 15
                            }}>
                                {caption}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.props.onCloseImageDetailModel) {
                                    this.props.onCloseImageDetailModel();
                                }
                            }}
                            style={{ position: 'absolute', top: Constants.isIPhoneX ? 35 : 10, right: Constants.isIPhoneX ? 15 : 10, width: 35, height: 35, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 25, height: 25 }}
                                source={require('../images/ic_btn_close_gray.png')}></Image>
                        </TouchableOpacity>

                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapperModal: {
        flex: 1,
        backgroundColor: ColorApp.black
    }
})