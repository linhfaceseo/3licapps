/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import moment from 'moment';
import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HeaderNormal from '../components/HeaderNormal';
import APICommonService from '../apis/APICommonService';
import ColorApp from '../utils/ColorApp';
import Constants from '../utils/Constants';
import { getParsedDate } from '../utils/TimeHelper';
import * as Util from '../utils/Util';
import firebase from '../pns/firebase';
import i18n from '../translations/i18n';

export default class GroupMessagePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onLoading: false,
            isOnRefreshing: false,
            groupChats: []
        };
    }

    setViewState = (...params) => {
        if (!!this.hadUnmount) return;
        this.setState(...params);
    };

    componentWillUnmount() {
        this.hadUnmount = true;
    }

    componentDidMount() {
        /* Add event to listener focus to current page */
        this.props.navigation.addListener('didFocus', this.onTabFocus);
    }

    onTabFocus = () => {
        // Reset all firebase listener
        if (this.allRefs && this.allRefs.length > 0) {
            for (let index = 0; index < this.allRefs.length; index++) {
                const ref = this.allRefs[index].ref;
                if (ref) {
                    ref();
                }
            }
        }

        // Update view first
        this.setViewState({
            groupChats: []
        });

        // Get new data
        if (Constants.userInfo) {
            this.getGroupChats();
        }
    }


    onBackPress = () => {
        this.props.navigation.goBack();
    }

    onSearchPress = () => { }

    getGroupChats = (showLoading = true) => {
        if (showLoading) {
            this.setViewState({
                onLoading: true
            });
        }

        APICommonService.getGroupChats().then(resp => {
            if (resp.success && resp.data) {
                this.setViewState({
                    groupChats: resp.data
                });

                if (resp.data.length > 0) {
                    this.initCollectionRef(resp.data);
                }
            } else {
                Util.showNoticeAlert('', resp.message, false);
            }

        }).catch(err => {
            Util.showNoticeAlert('', JSON.stringify(err), false);
        }).finally(() => {
            this.setViewState({
                onLoading: false,
                isOnRefreshing: false
            });
        });
    }

    initCollectionRef = async (groups) => {
        const db = firebase.firestore();
        this.allRefs = [];
        for (let index = 0; index < groups.length; index++) {
            const group = groups[index];

            let ref = null;
            this.allRefs.push({ ref: ref, isFirstTime: true });

            let ColRef = db.collection(group.firebase_path);
            if (ColRef) {
                this.listenerMessageChange(index, ColRef);
            }
        }
    }

    listenerMessageChange = (index, ColRef) => {
        this.allRefs[index].ref = ColRef.onSnapshot((doc) => {
            if ((doc.docChanges && doc.docChanges.length > 1) || this.allRefs[index].isFirstTime) {
                this.allRefs[index].isFirstTime = false;
                return;
            }

            doc.docChanges
                .forEach(element => {
                    if (element.type == 'added') {
                        let data = element.doc.data();
                        if (data.chat_by !== Constants.userInfo.id) {
                            let groupChange = this.state.groupChats.find(item => item._id === data.group_id);
                            if (groupChange) {
                                groupChange.number_of_unread++;
                                groupChange.last_message = data;
                                let groups = [...this.state.groupChats];

                                // Re-sort group change to top
                                if (groupChange._id !== groups[0]._id) {
                                    groups = groups.filter(group => group._id !== groupChange._id);
                                    groups.splice(0, 0, groupChange);
                                }

                                this.setViewState({
                                    groupChats: groups
                                })
                            }
                        }
                    }
                });
        });
    }

    _onRefresh = () => {
        this.setViewState({
            isOnRefreshing: true
        }, () => {
            this.getGroupChats(false);
        });
    }

    renderListItem = ({ item }) => {
        let avatar = '';
        let name = '';
        let lastMsg = '';
        let numUnread = item.number_of_unread || 0;
        let sendTime = '';

        if (item.vendor) {
            avatar = item.vendor.image;
            name = item.vendor.name;
        }
        if (item.last_message) {
            lastMsg = item.last_message.message;
            //sendTime = TimeHelper.convertTimeStampToStringDate(item.last_message.send_at, Constants.DATE_TIME_FORMAT.DDMMYYYY)
            let chatDate = moment(item.last_message.send_at).toDate();
            sendTime = getParsedDate(chatDate);
            if (item.last_message.type === Constants.CHAT_TYPE.IMAGE) {
                lastMsg = i18n.t(Constants.TRANSLATE_KEY.sent_an_image_msg_alias);
            }
        }

        return (
            <TouchableOpacity
                activeOpacity={Constants.OPACITY_BUTTON}
                onPress={() => {
                    this.onItemGroupMessageSelect(item);
                }}
                style={styles.msgItem}>
                <View style={{ flexDirection: 'row' }}>

                    <Image
                        style={styles.avatar}
                        source={{ uri: avatar }} />
                    <View style={styles.status} />
                    <View style={{
                        flex: 1,
                        marginRight: 5
                    }}>
                        <Text style={styles.name}>{name}</Text>
                        <Text numberOfLines={2} ellipsizeMode='tail' style={{ marginTop: 5 }}>{lastMsg}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <View style={[styles.outTextNumber, { backgroundColor: numUnread > 0 ? ColorApp.yellowBtn : ColorApp.transparent }]}>
                            <Text style={styles.textNumber}>{numUnread > 0 ? numUnread : ''}</Text>
                        </View>
                        <Text style={[styles.msgTime, { marginTop: 2 }]}>{sendTime}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    keyExtractor = (item) => {
        return `${item._id}`;
    }

    onItemGroupMessageSelect = (group) => {
        this.props.navigation.push(Constants.PAGE_KEY.CHAT_DETAIL_PAGE_KEY, {
            vendorInfo: group.vendor,
            chatInfo: group
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderNormal
                    onBackPress={this.onBackPress}
                    hideLeft={this.props.hideLeft}
                    onIconRightOnePress={this.onSearchPress}
                    title={i18n.t(Constants.TRANSLATE_KEY.message_title)}
                    customStyleHeader={{ backgroundColor: ColorApp.yellowApp }}
                    showRight={false}
                    showNotification={true}
                    navigation={this.props.navigation}
                    hideBoxShadow={true}
                />

                <View style={[{ flex: 1 }]}>
                    {Constants.userInfo && <FlatList
                        data={this.state.groupChats}
                        renderItem={this.renderListItem}
                        keyExtractor={this.keyExtractor}
                        showsVerticalScrollIndicator={false}
                        refreshing={this.state.isOnRefreshing}
                        onRefresh={this._onRefresh}
                    />}
                </View>
                {this.state.onLoading && <Util.indicatorProgress />}
            </View >
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
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
        width: 18,
        height: 18,
        borderRadius: 18,
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

