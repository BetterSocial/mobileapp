import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ArrowLeftIcon from '../../../assets/icons/images/arrow-left.svg';
import SettingIcon from '../../../assets/icons/images/setting.svg';
import ShareIcon from '../../../assets/icons/images/share.svg';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';

const ProfileHeader = ({
    onShareClicked = () => {},
    onSettingsClicked = () => {},
    username = "",
    hideSetting = false,
    showArrow = false,
}) => {
    const navigation = useNavigation()
    const __renderSettings = () => {
        if(hideSetting) return null

        return (
            <TouchableNativeFeedback onPress={onSettingsClicked}>
                <SettingIcon
                    width={20}
                    height={20}
                    fill={colors.black}
                />
            </TouchableNativeFeedback>
        )
    }

    const __renderBackArrow = () => {
        if(!showArrow) return <></>

        return (
            <View style={styles.wrapNameAndbackButton}>
                <TouchableNativeFeedback onPress={() => navigation.goBack()}>
                <ArrowLeftIcon width={20} height={12} fill="#000" />
                </TouchableNativeFeedback>
            </View>
        )
    }

    return (
        <View style={styles.header}>
            { __renderBackArrow() }
            <Text style={styles.textUsername}>{username}</Text>
            <View style={styles.wrapHeaderButton}>
                <View style={ hideSetting ? styles.btnShareWithoutSetting : styles.btnShare}>
                    <TouchableNativeFeedback onPress={onShareClicked}>
                    <ShareIcon
                        width={20}
                        height={20}
                        fill={colors.black}
                    />
                    </TouchableNativeFeedback>
                </View>

                { __renderSettings() }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnShare: {marginRight: 20},
    btnShareWithoutSetting: {},
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
        flex: 1,
    },
    wrapHeaderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    wrapNameAndbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
})

export default ProfileHeader
