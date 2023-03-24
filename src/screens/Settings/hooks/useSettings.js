import React from 'react';
import {useSetRecoilState} from 'recoil';
import {Alert} from 'react-native';
import Toast from 'react-native-simple-toast';
import {InitialStartupAtom} from '../../../service/initialStartup';

import {Context} from '../../../context';
import {removeAllCache} from '../../../utils/cache';
import {resetProfileFeed} from '../../../context/actions/myProfileFeed';
import {setMainFeeds} from '../../../context/actions/feeds';
import {createClient} from '../../../context/actions/createClient';
import {clearLocalStorege} from '../../../utils/token';
import {deleteAccount, removeFcmToken} from '../../../service/users';
import StringConstant from '../../../utils/string/StringConstant';

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

    // setStartupValue({
    //   id: null,
    //   deeplinkProfile: false,
    // })
  };

  const doDeleteAccount = async () => {
    // TODO :change this to delete account API call
    setIsLoadingDeletingAccount(true);
    const response = await deleteAccount();
    handleResponseDelete(response);
  };

  const handleResponseDelete = async (response) => {
    if (response.status === 'success') {
      logout();
      console.log('');
      Toast.show(StringConstant.profileDeleteAccountSuccess, Toast.SHORT);
    }
    setIsLoadingDeletingAccount(false);
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
