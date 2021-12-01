import Toast from 'react-native-simple-toast';

import {blockAnonymous, blockUser} from '../../service/blocking';

const uiBlockPostAnonymous = async(postId, source, reason, message, callback) => {
    const data = {
        postId,
        source,
        reason,
        message,
        };
    let result = await blockAnonymous(data);
    if (result.code === 201) {
        callback()
        Toast.show(
            'The user was blocked successfully. \nThanks for making BetterSocial better!',
            Toast.LONG,
        );
    } else {
        Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
}

const uiBlockUser = async(postId, userId, source, reason, message, callback) => {
    const data = {
        userId,
        postId,
        source,
        reason,
        message,
    };
    let result = await blockUser(data);
    if (result.code === 200) {
        callback()
        Toast.show(
            'The user was blocked successfully. \nThanks for making BetterSocial better!',
            Toast.LONG,
        );
    } else {
        Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
}

export default {
    uiBlockPostAnonymous,
    uiBlockUser
}