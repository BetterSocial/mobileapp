import React from 'react';
import Toast from 'react-native-simple-toast';
import {Alert} from 'react-native';
import {useSetRecoilState} from 'recoil';

import StorageUtils from '../../../utils/storage';
import StringConstant from '../../../utils/string/StringConstant';
import useResetContext from '../../../hooks/context/useResetContext';
import {Context} from '../../../context';
import {InitialStartupAtom} from '../../../service/initialStartup';
import {clearLocalStorege} from '../../../utils/token';
import {createClient} from '../../../context/actions/createClient';
import {deleteAccount, removeFcmToken} from '../../../service/users';
import {feedChatAtom} from '../../../models/feeds/feedsNotification';
import {removeAllCache} from '../../../utils/cache';
import {resetProfileFeed} from '../../../context/actions/myProfileFeed';
import {setMainFeeds} from '../../../context/actions/feeds';

const useSettings = () => {
  const [isLoadingDeletingAccount, setIsLoadingDeletingAccount] = React.useState(false);

  const [clientState, dispatch] = React.useContext(Context).client;
  const {client} = clientState;
  const setStartupValue = useSetRecoilState(InitialStartupAtom);
  const setFeedChatData = useSetRecoilState(feedChatAtom);

  const [, myProfileDispatch] = React.useContext(Context).myProfileFeed;
  const [, feedDispatch] = React.useContext(Context).feeds;

  const {resetAllContext, resetLocalDB} = useResetContext();

  const logout = async () => {
    try {
      StorageUtils.clearAll();
      await removeFcmToken();
      removeAllCache();
      resetProfileFeed(myProfileDispatch);
      setMainFeeds([], feedDispatch);
      resetAllContext();
      resetLocalDB();
      client?.disconnectUser();
      createClient(null, dispatch);
      clearLocalStorege();
      setFeedChatData([]);
    } catch (e) {
      console.log('error', e);
    }
  };

  const handleResponseDelete = async (response) => {
    if (response.status === 'success') {
      logout();
      Toast.show(StringConstant.profileDeleteAccountSuccess, Toast.SHORT);

      setStartupValue({
        id: null,
        deeplinkProfile: false
      });
    }
    setIsLoadingDeletingAccount(false);
  };

  const doDeleteAccount = async () => {
    setIsLoadingDeletingAccount(true);
    const response = await deleteAccount();
    handleResponseDelete(response);
  };

  const showDeleteAccountAlert = () => {
    Alert.alert(
      StringConstant.profileDeleteAccountAlertTitle,
      StringConstant.profileDeleteAccountAlertMessage,
      [
        {text: StringConstant.profileDeleteAccountAlertCancel, onPress: () => {}, style: 'default'},
        {
          text: StringConstant.profileDeleteAccountAlertSubmit,
          onPress: doDeleteAccount,
          style: 'destructive'
        }
      ]
    );
  };

  return {
    logout,
    isLoadingDeletingAccount,
    setIsLoadingDeletingAccount,
    client,
    setStartupValue,
    myProfileDispatch,
    feedDispatch,
    dispatch,
    doDeleteAccount,
    showDeleteAccountAlert,
    handleResponseDelete
  };
};

export default useSettings;
