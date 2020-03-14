/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import moment from 'moment';
import React, { Component } from 'react';
import { StatusBar, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import APICommonService from '../apis/APICommonService';
import HeaderNormal from '../components/HeaderNormal';
import firebase from '../pns/firebase';
import i18n from '../translations/i18n';
import ColorApp from '../utils/ColorApp';
import Constants from '../utils/Constants';
import { getParsedDate } from '../utils/TimeHelper';
import * as Util from '../utils/Util';
import { EventRegister } from 'react-native-event-listeners';

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
        if (this.onPNSListener) {
            EventRegister.removeEventListener(this.onPNSListener);
        }

        if (this.onlineLst) {
            EventRegister.removeEventListener(this.onlineLst);
        }

        if (this.offlineLst) {
            EventRegister.removeEventListener(this.offlineLst);
        }
    }

    componentDidMount() {

        StatusBar.setBackgroundColor(ColorApp.bg_app, false);
        /* Send event to tracking online */
        EventRegister.emitEvent(Constants.APP_EVENT_KEY.TRACKING_SOCKET_ADMIN_ONLINE);

        /* Add event listener when have users online/offline */
        this.onlineLst = EventRegister.addEventListener(Constants.APP_EVENT_KEY.IO_USERS_ONLINE, (usersOnline) => {
            this.usersOnline = usersOnline;
            this.processUserOnline();
        });

        /* Add event listener when have users online/offline */
        this.offlineLst = EventRegister.addEventListener(Constants.APP_EVENT_KEY.IO_USER_OFFLINE, (userOffline) => {
            this.processUserOffline(userOffline);
        });

        /* Add event to listener focus to current page */
        this.props.navigation.addListener('didFocus', this.onTabFocus);

        /* Add event to listener new PNS */
        this.onPNSListener = EventRegister.addEventListener(Constants.APP_EVENT_KEY.NEW_NOTIFICATION, (data) => {
            this.processPnsData(data);
        });

        /* Check if user click into pns data chat */
        if (Constants.currentPnsInfo) {
            this.props.navigation.navigate(Constants.PAGE_KEY.CHAT_DETAIL_PAGE_KEY, {
                chatInfo: null,
                pnsInfo: { ...Constants.currentPnsInfo }
            });

            // Reset pnsInfo
            Constants.currentPnsInfo = null;
        }
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
        // this.setViewState({
        //     groupChats: []
        // });

        // Get new data
        if (Constants.userInfo) {
            this.getGroupChats();
        }
    }

    processUserOnline = () => {
        if (this.state.groupChats && this.state.groupChats.length > 0) {
            if (this.usersOnline && this.usersOnline.length > 0) {
                // Update online status
                for (let index = 0; index < this.state.groupChats.length; index++) {
                    let group = this.state.groupChats[index];
                    // Reset first
                    group.isOnline = false;

                    // Find group user online
                    let haveOnline = this.usersOnline.find(online => online.user_id === group.msg_GroupChatSocketUser);
                    if (haveOnline) {
                        group.isOnline = true;
                    }
                }
            } else {
                // Reset online = false
                for (let index = 0; index < this.state.groupChats.length; index++) {
                    this.state.groupChats[index].isOnline = false;
                }
            }

            this.setViewState({
                groupChats: [...this.state.groupChats]
            })
        }
    }

    processUserOffline = (userOffline) => {
        if (this.state.groupChats && this.state.groupChats.length > 0) {
            // Find group user offline
            let haveGroupOffline = this.state.groupChats.find(group => group.msg_GroupChatSocketUser === userOffline.user_id);
            if (haveGroupOffline) {
                haveGroupOffline.isOnline = false;
            }

            this.setViewState({
                groupChats: [...this.state.groupChats]
            })
        }
    }

    processPnsData = (pnsData) => {
        Util.processPNSData(pnsData, true, this.props);
    }

    getGroupChats = (showLoading = true) => {
        if (showLoading) {
            this.setViewState({
                onLoading: true
            });
        }

        APICommonService.getGroupChats().then(resp => {
            console.tlog('resp', resp);
            if (resp.success && resp.data) {

                // Update online status
                this.processUserOnline();

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

            let ColRef = db.collection(group.msg_FireBaseGroupChat);
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
                        console.tlog('dataAdded', data);
                        if (data.msg_send !== Constants.USER_ROLE.MANAGER) {
                            let groupChange = this.state.groupChats.find(item => item.msg_GroupChatID === data.msg_GroupChatID);
                            if (groupChange) {
                                groupChange.msg_number_unread_message_user++;

                                // Update data lastest message
                                groupChange.msg = data.msg;
                                groupChange.msg_time = data.msg_time;
                                groupChange.msg_chatType = data.msg_chatType;
                                groupChange.msg_send = data.msg_send;
                                groupChange.msg_id = data.msg_id;

                                let groups = [...this.state.groupChats];

                                // Re-sort group change to top
                                if (groupChange.msg_GroupChatID !== groups[0].msg_GroupChatID) {
                                    groups = groups.filter(group => group.msg_GroupChatID !== groupChange.msg_GroupChatID);
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
        let numUnread = item.msg_number_unread_message_user || 0;
        let numUnreadDisplay = '';
        if(numUnread > 99) {
            numUnreadDisplay = '99+';
        } else if(numUnread > 0) {
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
                    this.onItemGroupMessageSelect(item);
                }}
                style={styles.msgItem}>
                <View>
                    <View style={{ flexDirection: 'row' }}>

                        <Image
                            style={styles.avatar}
                            source={avatar ? { uri: avatar } : require('../images/ic_avatar.png')} />
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
                        disabled={true}
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

    keyExtractor = (item) => {
        return `${item.msg_GroupChatID}`;
    }

    onItemGroupMessageSelect = (group) => {
        this.props.navigation.push(Constants.PAGE_KEY.CHAT_DETAIL_PAGE_KEY, {
            chatInfo: group
        });
    }

    onIconRightOnePress = () => {
        Util.onLogOut();
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderNormal
                    hideLeft={true}
                    title={i18n.t(Constants.TRANSLATE_KEY.message_title)}
                    customStyleHeader={{ backgroundColor: ColorApp.bg_app }}
                    showRight={true}
                    onIconRightOnePress={this.onIconRightOnePress}
                    navigation={this.props.navigation}
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

