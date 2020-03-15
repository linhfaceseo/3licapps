/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { FlatList, StatusBar, StyleSheet, View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import APICommonService from '../apis/APICommonService';
import ItemGroup from '../components/groupListChat/ItemGroup';
import HeaderNormal from '../components/HeaderNormal';
import firebase from '../pns/firebase';
import i18n from '../translations/i18n';
import ColorApp from '../utils/ColorApp';
import Constants from '../utils/Constants';
import * as Util from '../utils/Util';

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
            this.processUserOnline(this.state.groupChats);
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

        // Get new data
        if (Constants.userInfo) {
            this.getGroupChats();
        }
    }

    processUserOnline = (groups) => {
        if (groups && groups.length > 0) {
            let groupChatCopy = [...groups];
            if (this.usersOnline && this.usersOnline.length > 0) {
                // Update online status
                for (let index = 0; index < groupChatCopy.length; index++) {
                    let group = groupChatCopy[index];
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
                for (let index = 0; index < groupChatCopy.length; index++) {
                    groupChatCopy[index].isOnline = false;
                }
            }

            this.setViewState({
                groupChats: groupChatCopy
            });
        }
    }

    processUserOffline = (userOffline) => {
        if (this.state.groupChats && this.state.groupChats.length > 0) {
            let groupChatCopy = [...this.state.groupChats];
            // Find group user offline
            let haveGroupOffline = groupChatCopy.find(group => group.msg_GroupChatSocketUser === userOffline.user_id);
            if (haveGroupOffline) {
                haveGroupOffline.isOnline = false;
            }

            this.setViewState({
                groupChats: groupChatCopy
            });
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
                if (resp.data.length > 0) {
                    this.initCollectionRef(resp.data);
                }

                // Update online status
                this.processUserOnline(resp.data);

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
        return (
            <ItemGroup
                item={item}
                onItemGroupMessageSelect={this.onItemGroupMessageSelect} />
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
    }
});

