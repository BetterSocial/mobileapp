import Toast from 'react-native-simple-toast';

import {blockAnonymous, blockUser, blockDomain} from '../../service/blocking';

const handleMessage = (reason = [], message = '', type = 'user') => {
    let successMessage = `The ${type} was blocked successfully. \nThanks for making BetterSocial better!`
    if(reason.length > 0 || message.length > 0) {
        successMessage = 'Your report was filed & will be investigated'
    }
    return successMessage
}

const uiBlockPostAnonymous = async(postId, source, reason, message, callback) => {
    const data = {
        postId,
        source,
        reason,
        message,
        };
    let result = await blockAnonymous(data);
    console.log(result, 'sunat')

    if (result.code === 200) {
        callback()
        Toast.show(
            handleMessage(reason, message),
            Toast.LONG,
        );
    } else {
        Toast.show(result.message, Toast.LONG);
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
            handleMessage(reason, message),
            Toast.LONG,
        );
    } else {
        Toast.show(result.message, Toast.LONG);
    }
}

const uiBlockDomain = async(domainId, reason, message, source, callback) => {
    const dataBlock = {
        domainId,
        reason,
        message,
        source,
    };
    const result = await blockDomain(dataBlock);
    if (result.code === 200) {
        callback();
        Toast.show(
            handleMessage(reason, message, 'domain'),
            Toast.LONG,
        );
    } else {
        Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
    console.log('result block user ', result);
}


export default {
    uiBlockPostAnonymous,
    uiBlockUser,
    uiBlockDomain
}