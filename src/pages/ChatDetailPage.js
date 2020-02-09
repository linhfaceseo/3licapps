/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import APICommonService, { API_KEY, API_URL } from '../apis/APICommonService';
import BottomChat from '../components/chatDetail/BottomChat';
import HeaderChat from '../components/chatDetail/headerChat';
import ItemMessage from '../components/chatDetail/ItemMessage';
import firebase from '../pns/firebase';
import Constants from '../utils/Constants';
import * as Util from '../utils/Util';
import PhotoDetailModal from './PhotoDetailModel';


const UPLOAD_FILE_TYPE = {
    IMAGE: 'Image',
    FILE: 'File'
}

export default class ChatDetailPage extends Component {

    constructor(props) {
        super(props);
        let params = this.props.navigation.state.params;
        this.chatInfo = null;

        if (params) {
            this.chatInfo = params.chatInfo;
        }

        this.state = {
            onLoading: false,
            messages: [],
            isOnRefreshing: false,
            showImageDetailModel: false
        };

        this.isFirstTimeGetFBData = true;
    }

    setViewState = (...params) => {
        if (!!this.hadUnmount) return;
        this.setState(...params);
    };

    componentDidMount() {

        if (this.chatInfo === null) {
            this.getChatInfo();
        } else {
            this.getChatHistory();

            this.initCollectionRef();
        }
    }
    componentWillUnmount() {
        this.hadUnmount = true;

        this.forceRemoveAllMessages();

        // Reset listener
        if (this.unSubscribe) {
            this.unSubscribe();
        }

        if (this.unSubscribeReadStatus) {
            this.unSubscribeReadStatus();
        }

        // Tracking latest message readed
        if (this.state.messages && this.state.messages.length > 0 &&
            this.chatInfo !== null) {
            this.onTrackReadLatestMsg();
        }
    }

    onBackPress = () => {
        this.props.navigation.goBack();
    }

    /* Tracking latest message readed to count total unread */
    onTrackReadLatestMsg = () => {
        let params = {};
        params[API_KEY.GROUP_ID_KEY] = this.chatInfo._id;
        params[API_KEY.SEEN_BY_KEY] = Constants.userInfo.id;
        params[API_KEY.LAST_MESSAGE_ID_KEY] = this.state.messages[0]._id;
        params[API_KEY.IS_MEMBER_KEY] = true;

        // APICommonService.trackReadLastMsgChat(params).then(resp => {
        // }).catch(err => {
        // }).finally(() => {
        // });
    }

    initCollectionRef = async () => {
        if (!this.ColRef) {
            const db = firebase.firestore();
            this.ColRef = db.collection(this.chatInfo.firebase_path);
            this.ColReadStatusRef = db.collection(this.chatInfo.firebase_read_path);
        }
        if (this.ColRef) {
            this.listenerMessageChange();
        }

        if (this.ColReadStatusRef) {
            this.listenerReadStatus();
        }
    }

    listenerMessageChange = () => {
        this.unSubscribe = this.ColRef.onSnapshot((doc) => {
            if (this.isFirstTimeGetFBData) {
                this.isFirstTimeGetFBData = false;
                return;
            }

            if (doc.docChanges && doc.docChanges.length > 1) {
                return;
            }

            doc.docChanges
                .forEach(element => {
                    if (element.type == 'added') {
                        let data = element.doc.data();

                        // Add message to list
                        let msgs = [...this.state.messages];
                        msgs.splice(0, 0, data);

                        /* Check if partner send message, we reset all unread messages */
                        if (this.chatInfo && data.chat_by === this.vendorInfo.auto_id) {
                            this.chatInfo.number_of_unread = 0;
                        }

                        // Update status read to firebase
                        this.setReadStatusToFirebase();

                        // Update data
                        this.setViewState({
                            messages: msgs
                        });
                    }
                });
        });
    }

    listenerReadStatus = () => {
        this.unSubscribeReadStatus = this.ColReadStatusRef.onSnapshot((doc) => {
            if (this.isFirstTimeGetFBReadStatusData) {
                this.isFirstTimeGetFBReadStatusData = false;
                return;
            }

            if (doc.docChanges && doc.docChanges.length > 1) {
                return;
            }

            doc.docChanges
                .forEach(element => {
                    if (element.type == 'added' || element.type == 'modified' || element.type == 'removed') {
                        // Handle read status if partner online or have action
                        let data = element.doc.data();
                        if (data && data.chat_by === this.vendorInfo.auto_id) {
                            // Reset all un-read message from partner
                            if (this.chatInfo) {
                                this.chatInfo.number_of_unread = 0;
                            }
                            // UPdate view
                            let msgs = [...this.state.messages];
                            this.setViewState({
                                messages: msgs
                            });
                        }

                    }
                });
        });
    }


    forceRemoveAllMessages = () => {
        if (this.chatInfo && this.chatInfo.firebase_path && this.chatInfo.firebase_path !== '') {
            this.deleteCollection(this.chatInfo.firebase_path, 1000);
        }

        if (this.chatInfo && this.chatInfo.firebase_read_path && this.chatInfo.firebase_read_path !== '') {
            this.deleteCollection(this.chatInfo.firebase_read_path, 500);
        }

    }

    deleteCollection = (collectionPath, batchSize) => {
        const db = firebase.firestore();
        let collectionRef = db.collection(collectionPath);
        let query = collectionRef.limit(batchSize);

        return new Promise((resolve, reject) => {
            this.deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
    }

    deleteQueryBatch = (db, query, batchSize, resolve, reject) => {
        query.get()
            .then((snapshot) => {
                // When there are no documents left, we are done
                if (snapshot.size == 0) {
                    return 0;
                }

                // Delete documents in a batch
                let batch = db.batch();
                snapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                return batch.commit().then(() => {
                    return snapshot.size;
                });
            }).then((numDeleted) => {
                if (numDeleted === 0) {
                    resolve();
                    return;
                }
            })
            .catch(reject);
    }

    sendMessage = (msg, type = Constants.CHAT_TYPE.MESSAGE) => {
        if (msg === null || msg === undefined || msg === '' || msg.trim() === '') {
            return;
        }

        // Send to server
        var params = {};
        params[API_KEY.USER_ID_KEY] = this.chatInfo.msg_uid;
        params[API_KEY.PAGE_ID_KEY] = this.chatInfo.msg_pid;
        params[API_KEY.MANAGER_ID_KEY] = this.chatInfo.msg_mng;
        params[API_KEY.TEXT_MESSAGE_KEY] = msg;
        params[API_KEY.USER_SEND_KEY] = Constants.USER_ROLE.MANAGER;
        params[API_KEY.MESSAGE_CHAT_TYPE_KEY] = type;
        params[API_KEY.ACTION_REQUEST_KEY] = API_URL.CHAT;


        APICommonService.sendMessage(params).then(resp => {
            console.tlog('sendMessage RESP', resp);
            if (resp.success) {
                this.addMessageToFirebase(params);
            }
        }).catch(err => {
            console.tlog('sendMessage ERR', err);
        }).finally(() => {
        });
    }

    addMessageToFirebase = (params) => {
        if (!this.ColRef) {
            const db = firebase.firestore();
            this.ColRef = db.collection(this.chatInfo.firebase_path);
        }

        // Save to firebase
        params[API_KEY.SEND_AT_KEY] = new Date().getTime();
        return this.ColRef.add(params);
    }

    setReadStatusToFirebase = () => {
        let params = {};
        params[API_KEY.GROUP_ID_KEY] = this.chatInfo._id;
        params[API_KEY.CHAT_BY_KEY] = Constants.userInfo.id;

        if (!this.ColReadStatusRef) {
            const db = firebase.firestore();
            this.ColReadStatusRef = db.collection(this.chatInfo.firebase_read_path);
        }

        return this.ColReadStatusRef.add(params);
    }

    getChatInfo = () => {
        this.setViewState({
            onLoading: true
        });
        APICommonService.startSingleChat(this.vendorInfo.auto_id).then(resp => {
            if (resp.success) {
                this.chatInfo = resp.data;
                this.getChatHistory();

                this.initCollectionRef();

                // Update status read to firebase
                this.setReadStatusToFirebase();

            } else {
                Util.showNoticeAlert('', resp.message, false, () => {
                    this.onBackPress();
                });
            }

        }).catch(err => {
            Util.showNoticeAlert('', JSON.stringify(err), false, () => {
                this.onBackPress();
            });
        }).finally(() => {
            this.setViewState({
                onLoading: false
            });
        });
    }

    getChatHistory = (offset = 0, loadPrev = false) => {

        /* Check if is loading, skip load data */
        if (!this.isLoading) {
            this.isLoading = true;

            if (!loadPrev) {
                this.setViewState({
                    onLoading: true
                });
            }

            let msgId = '';
            if (this.state.messages && this.state.messages.length > 0) {
                msgId = this.state.messages[this.state.messages.length - 1].msg_id;
            }

            APICommonService.getHistoryMessage(this.chatInfo.msg_uid,
                this.chatInfo.msg_pid,
                this.chatInfo.msg_mng,
                msgId).then(resp => {
                    console.tlog('getChatHistory RESP', resp);
                    if (resp.data && resp.data.length > 0) {
                        if (loadPrev) {
                            let msgTemp = resp.data;
                            msgTemp = [...this.state.messages, ...msgTemp];

                            this.setViewState({
                                messages: msgTemp
                            })
                        } else {
                            this.setViewState({
                                messages: resp.data
                            }, () => {
                                // Tracking latest message readed at the firsttime load message
                                setTimeout(() => {
                                    this.onTrackReadLatestMsg();
                                }, 700);
                            });
                        }
                    }
                }).catch(err => {
                    console.tlog('getChatHistory ERR', err);
                }).finally(() => {
                    this.setViewState({
                        onLoading: false,
                        isOnRefreshing: false
                    });

                    // Reset is loading data
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
        }
    }

    renderListItem = ({ item, index }) => {
        return (
            <ItemMessage
                msg={item}
                viewImageDetail={this.viewImageDetail}
                index={index} />
        );
    }

    keyExtractor = (item) => {
        return `${item.auto_id || item._id || item.id}`;
    }

    onLoadPrevMsg = () => {
        this.setViewState({
            isOnRefreshing: true
        }, () => {
            if (this.interval) {
                clearInterval(this.interval);
            }
            if (!this.isLoading) {
                this.interval = setInterval(() => {
                    this.getChatHistory(this.state.messages.length, true);
                    clearInterval(this.interval);
                }, 500);
            }
        });
    }


    onAddImagePress = () => {
        Keyboard.dismiss();

        Util.showImagePicker((response) => {
            this.processImageData(response);
        }, 512, 512);
    }

    processImageData = (response) => {
        var imgInfo = {
            type: UPLOAD_FILE_TYPE.IMAGE,
            data: response
        }

        this.uploadFileToAmazonS3(imgInfo);
    }

    uploadFileToAmazonS3 = (uploadFile) => {

    }

    viewImageDetail = (msg) => {
        this.imgInfo = msg;

        this.setViewState({
            showImageDetailModel: true
        });
    }

    onCloseImageDetailModel = () => {
        this.setViewState({
            showImageDetailModel: false
        })
    }

    buildImageDetailModel = () => {
        let images = [];
        images.push({ image: this.imgInfo.message });

        return (<PhotoDetailModal
            onCloseImageDetailModel={this.onCloseImageDetailModel}
            images={images} />);
    }

    onIconRightOnePress = () => {
        Util.onLogOut();
    }

    render() {
        let msgRevert = [...this.state.messages];
        // Update unread status -> For my message
        if (msgRevert.length > 0 && this.chatInfo) {
            let count = 0;
            for (let index = 0; index < msgRevert.length; index++) {
                const msg = msgRevert[index];
                if (msg.chat_by === Constants.userInfo.id) {
                    if (count < this.chatInfo.number_of_unread) {
                        count++;
                        msg.is_unread = true;
                    } else {
                        msg.is_unread = false;
                    }
                }
            }
        }

        return (
            <View style={[styles.container]}>
                <HeaderChat
                    onBackPress={this.onBackPress}
                    chatInfo={this.chatInfo}
                    onIconRightOnePress={this.onIconRightOnePress} />

                <TouchableWithoutFeedback
                    style={{ flex: 1, marginBottom: 15 }}
                    onPress={() => {
                        if (!!this.state.isKeyboardShown) {
                            Keyboard.dismiss();
                        }
                    }}
                >
                    <FlatList
                        data={msgRevert}
                        renderItem={this.renderListItem}
                        keyExtractor={this.keyExtractor}
                        showsVerticalScrollIndicator={false}
                        inverted={true}
                        refreshing={this.state.isOnRefreshing}
                        onEndReached={this.onLoadPrevMsg}
                        onEndReachedThreshold={0}
                        windowSize={15}
                        initialNumToRender={5}
                        removeClippedSubviews={true}
                    />
                </TouchableWithoutFeedback>

                {Constants.isIOS ?
                    <KeyboardAvoidingView behavior="padding">
                        <BottomChat
                            sendMessage={this.sendMessage}
                            onAddImagePress={this.onAddImagePress} />
                    </KeyboardAvoidingView>
                    :
                    <View>
                        <BottomChat
                            sendMessage={this.sendMessage}
                            onAddImagePress={this.onAddImagePress} />
                    </View>
                }

                {this.state.showImageDetailModel && this.buildImageDetailModel()}
                {this.state.onLoading && <Util.indicatorProgress />}
            </View >
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

