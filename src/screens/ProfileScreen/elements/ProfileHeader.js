import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ArrowLeftIcon from '../../../assets/icons/images/arrow-left.svg';
import SettingIcon from '../../../assets/icons/images/setting.svg';
import ShareIcon from '../../../assets/icons/images/share.svg';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import GlobalButton from '../../../components/Button/GlobalButton';

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
            <TouchableOpacity onPress={onSettingsClicked}>
                <SettingIcon
                    width={20}
                    height={20}
                    fill={colors.black}
                />
            </TouchableOpacity>
        )
    }

    const __renderBackArrow = () => {
        if(!showArrow) return <></>

        return (
            <View style={styles.wrapNameAndbackButton}>
                <GlobalButton buttonStyle={styles.noPl} onPress={() => navigation.goBack()}>
                <ArrowLeftIcon width={20} height={12} fill="#000" />
                </GlobalButton>
            </View>
        )
    }

    return (
        <View style={styles.header}>
            { __renderBackArrow() }
            <Text numberOfLines={1} style={styles.textUsername}>{username}</Text>
            <View style={styles.wrapHeaderButton}>
                <View style={ hideSetting ? styles.btnShareWithoutSetting : styles.btnShare}>
                    <TouchableOpacity onPress={onShareClicked}>
                    <ShareIcon
                        width={20}
                        height={20}
                        fill={colors.black}
                    />
                    </TouchableOpacity>
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
    noPl: {
        paddingLeft: 0
    }
})

export default React.memo (ProfileHeader)
