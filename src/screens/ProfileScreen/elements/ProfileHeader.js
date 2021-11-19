import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

import SettingIcon from '../../../assets/icons/images/setting.svg';
import ShareIcon from '../../../assets/icons/images/share.svg';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';

const ProfileHeader = ({
    onShareClicked = () => {},
    onSettingsClicked = () => {},
    username = "",
}) => {
    return (
        <View style={styles.header}>
            <Text style={styles.textUsername}>{username}</Text>
            <View style={styles.wrapHeaderButton}>
            <View style={styles.btnShare}>
                <TouchableNativeFeedback onPress={onShareClicked}>
                <ShareIcon
                    width={20}
                    height={20}
                    fill={colors.black}
                />
                </TouchableNativeFeedback>
            </View>
            <TouchableNativeFeedback onPress={onSettingsClicked}>
                <SettingIcon
                width={20}
                height={20}
                fill={colors.black}
                />
            </TouchableNativeFeedback>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        paddingLeft: 20,
        paddingRight: 20,
    },
    textUsername: {
      fontFamily: fonts.inter[800],
      fontWeight: 'bold',
      fontSize: 18,
      lineHeight: 22,
      color: colors.black,
    },
    wrapHeaderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 50,
    },

    btnShare: {marginRight: 20},
})

export default ProfileHeader
