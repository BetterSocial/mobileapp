import * as React from 'react';
import { View, TouchableNativeFeedback, Image, StyleSheet } from 'react-native';
import MemoIcAddCircle from '../../../assets/icons/ic_add_circle';
import { DEFAULT_PROFILE_PIC_PATH } from '../../../utils/constants';
/**
 * @typedef {Object} ProfilePicturePropsParam
 * @property {function} onImageContainerClick
 * @property {String} profilePicPath
 */
/**
 * 
 * @param {ProfilePicturePropsParam} props 
 */
const ProfilePicture = ({ onImageContainerClick, profilePicPath }) => {
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
            />
            {!profilePicPath ? (
                <MemoIcAddCircle
                    width={48}
                    height={48}
                    style={styles.addCircle} />
            ) : (
                <></>
            )}
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