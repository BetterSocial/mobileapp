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
  const showAlertDelete = (item, backToPrevPage) => {
    console.log(item, 'nana');
    if (profile.myProfile?.user_id === item?.user_id || item?.is_you) {
      Alert.alert(null, StringConstant.feedDeleteCommentConfirmation, [
        {
          text: 'No, cancel',
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => onDeleteCommentClicked(item, backToPrevPage)
        }
      ]);
    }
  };

  const onDeleteCommentClicked = async (item, backToPrevPage) => {
    const response = await deleteComment(item?.id);
    if (response?.success) {
      if (params.getComment && typeof params.getComment === 'function') {
        await params.getComment();
      }
      if (backToPrevPage) {
        goBack();
      }
    }
  };

  return {
    showAlertDelete
  };
};

export default useCommentAction;
