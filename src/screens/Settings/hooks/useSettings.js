import React from 'react';
import Toast from 'react-native-simple-toast';
import {Alert} from 'react-native';
import {useSetRecoilState} from 'recoil';

import StringConstant from '../../../utils/string/StringConstant';
import {Context} from '../../../context';
import {InitialStartupAtom} from '../../../service/initialStartup';
import {clearLocalStorege} from '../../../utils/token';
import {createClient} from '../../../context/actions/createClient';
import {deleteAccount, removeFcmToken} from '../../../service/users';
import {removeAllCache} from '../../../utils/cache';
import {resetProfileFeed} from '../../../context/actions/myProfileFeed';
import {setMainFeeds} from '../../../context/actions/feeds';

const useSettings = () => {
  const [isLoadingDeletingAccount, setIsLoadingDeletingAccount] = React.useState(false);

  const [clientState, dispatch] = React.useContext(Context).client;
  const {client} = clientState;
  const setStartupValue = useSetRecoilState(InitialStartupAtom);

  const [, myProfileDispatch] = React.useContext(Context).myProfileFeed;
  const [, feedDispatch] = React.useContext(Context).feeds;

  const logout = async () => {
    await removeFcmToken();
    removeAllCache();
    resetProfileFeed(myProfileDispatch);
    setMainFeeds([], feedDispatch);
    client?.disconnectUser();
    createClient(null, dispatch);
    clearLocalStorege();
  };

  const handleResponseDelete = async (response) => {
    if (response.status === 'success') {
      logout();
      console.log('');
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
