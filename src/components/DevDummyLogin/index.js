import * as React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';

import { COLORS } from '../../utils/theme';
import { Context } from '../../context';
import { ENABLE_DEV_ONLY_FEATURE } from '../../utils/constants';
import { removeLocalStorege, setAccessToken, setRefreshToken, setUserId } from '../../utils/token';
import { setDataHumenId } from '../../context/actions/users';
import { verifyUser } from '../../service/users';

const heightBs = Dimensions.get('window').height * 0.6

const DevDummyLogin = () => {
    const [loading, setLoading] = React.useState(false);
    const [isShown, setIsShown] = React.useState(true)
    const dummyLoginRbSheetRef = React.useRef(null)
    const navigation = useNavigation()

    const [, dispatch] = React.useContext(Context).users;

    const dummyLogin = (appUserId) => {
        if (ENABLE_DEV_ONLY_FEATURE) {
            dummyLoginRbSheetRef.current.close();
        }
        setLoading(true);
        let data = { appUserId, countryCode: 'ID' }
        setDataHumenId(data, dispatch);
        verifyUser(appUserId)
            .then(async (response) => {
                setLoading(false);
                if (response.data) {
                    setAccessToken(response.token);
                    setRefreshToken(response.refresh_token);
                    setTimeout(() => {
                        navigation.dispatch(StackActions.replace('HomeTabs'));
                    }, 100);
                } else {
                    removeLocalStorege('userId');
                    navigation.dispatch(StackActions.replace('ChooseUsername'));
                }
                setUserId(appUserId);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    };

    if (ENABLE_DEV_ONLY_FEATURE && isShown) return <View style={S.devTrialView}>
        <Button
            title="Dev Dummy Onboarding"
            onPress={() => {
                setDataHumenId('ASDF-GHJK-QWER-1234', dispatch)
                navigation.navigate('ChooseUsername')
            }}
        />
        <Button
            title="Dev Dummy Login"
            onPress={() => dummyLoginRbSheetRef.current.open()}
        />
        <Button
            title="Close Dev Menu"
            onPress={() => setIsShown(false)}
        />
        <RBSheet height={heightBs} ref={dummyLoginRbSheetRef}>
            <Text>Choose an account you wish to login</Text>
            <TouchableOpacity onPress={() => dummyLogin('HQEGNQCHA8J1OIX4G2CP')}>
                <View style={S.divider} />
                <Text style={S.dummyAccountItem}>
                    fajarism : HQEGNQCHA8J1OIX4G2CP
                </Text>
                <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('HQEGNQCHA8J1OIX4G2CQ')}>
                <Text style={S.dummyAccountItem}>
                    Fajar_alter : HQEGNQCHA8J1OIX4G2CQ
                </Text>
                <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('COBA-LAGI-AJA')}>
                <Text style={S.dummyAccountItem}>
                    Fajarcobalagi : COBA-LAGI-AJA
                </Text>
                <View style={S.divider} />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => dummyLogin('KVL1JKD8VG6KMHUZ0RY8')}> */}
            <TouchableOpacity onPress={() => dummyLogin('KVL1JKD8VG6KMHUZ0RY5')}>
                <Text style={S.dummyAccountItem}>
                    bas_v1-4 : KVL1JKD8VG6KMHUZ0RY5
                </Text>
                <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('1G1H-1TUHI-7U9H7-572G21')}>
                <Text style={S.dummyAccountItem}>
                    usupsuparma : P19FGPQGMSZ5VSHA0YSQ
                </Text>
                <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('TVGBYD1BI9YMXMAA6CQS')}>
                <Text style={S.dummyAccountItem}>
                    busanid : TVGBYD1BI9YMXMAA6CQS
                </Text>
                <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('GWJ47ZY9PQNQO6MFX2HC')}>
                <Text style={S.dummyAccountItem}>
                    agitfirst : GWJ47ZY9PQNQO6MFX2HC
                </Text>
                <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('TVGBYD1BI9YMXMAA6CU53')}>
                <Text style={S.dummyAccountItem}>
                    usupsu: TVGBYD1BI9YMXMAA6CU53
                </Text>
                <View style={S.divider} />
            </TouchableOpacity>
        </RBSheet>
    </View>

    return <></>
}

const S = StyleSheet.create({
    devTrialView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 999,
        backgroundColor: 'red',
    },
    dummyLoginButton: {},
    dummyAccountItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    divider: {
        width: '100%',
        backgroundColor: COLORS.gray,
        height: 2,
    },
})

export default DevDummyLogin