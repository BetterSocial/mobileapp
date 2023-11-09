import React from 'react';
import {Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/core';
import {Context} from '../../../context';
import StringConstant from '../../../utils/string/StringConstant';
import {deleteComment} from '../../../service/comment';

const useCommentAction = () => {
  const [profile] = React.useContext(Context).profile;
  const {params} = useRoute();
  const {goBack} = useNavigation();
  const showAlertDelete = (item, backToPrevPage, callback) => {
    if (profile.myProfile?.user_id === item?.user?.id || item?.is_you) {
      Alert.alert(null, StringConstant.feedDeleteCommentConfirmation, [
        {
          text: 'No, cancel',
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => onDeleteCommentClicked(item, backToPrevPage, callback)
        }
      ]);
    }
  };
  const onDeleteCommentClicked = async (item, backToPrevPage, callback) => {
    try {
      const response = await deleteComment(item?.id);

      if (response?.success) {
        if (params.getComment && typeof params.getComment === 'function') {
          params.getComment();
        }
        if (backToPrevPage) {
          goBack();
        }
        if (callback && typeof callback === 'function') {
          callback();
        }
      }
    } catch (e) {
      if (__DEV__) {
        console.log(e, 'eman');
      }
    }
  };

  return {
    showAlertDelete
  };
};

export default useCommentAction;
