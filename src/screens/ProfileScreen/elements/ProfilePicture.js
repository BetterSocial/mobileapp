import * as React from 'react';
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native';

import Image from '../../../components/Image';
import MemoIcAddCircle from '../../../assets/icons/ic_add_circle';
import { DEFAULT_PROFILE_PIC_PATH } from '../../../utils/constants';
import FastImage from 'react-native-fast-image';

/**
 * @typedef {Object} ProfilePicturePropsParam
 * @property {function} onImageContainerClick
 * @property {String} profilePicPath
 * @property {Boolean} disabledAddIcon
 */
/**
 *
 * @param {ProfilePicturePropsParam} props
 */
const ProfilePicture = ({ onImageContainerClick, profilePicPath, disabledAddIcon = false}) => {
    const __renderAddIcon = () => {
        if(!profilePicPath || !disabledAddIcon) return <></>

        return <MemoIcAddCircle width={48} height={48} style={styles.addCircle} />
    }
    return <View style={styles.wrapImageProfile}>
        <TouchableNativeFeedback onPress={onImageContainerClick}>
            <View style={styles.profileImageContainer}>
            <Image
                style={styles.profileImage}
                source={{
                uri: profilePicPath
                    ? `${profilePicPath}`
                    : DEFAULT_PROFILE_PIC_PATH,
                }}
                resizeMode={FastImage.resizeMode.stretch}
            />
            { __renderAddIcon() }
            </View>
        </TouchableNativeFeedback>
    </View>
}

let styles = StyleSheet.create({
    addCircle: {position: 'absolute', top: 25, left: 25},
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        // marginBottom: 12
    },
    profileImageContainer: {
        width: 100,
        borderRadius: 100,
    },
    wrapImageProfile: {
        marginTop: 14,
        flexDirection: 'column',
    },
})

export default ProfilePicture
