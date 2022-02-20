import * as React from 'react';

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { fonts, normalize, normalizeFontSize } from '../../../utils/fonts';
import theme, { COLORS, FONTS, SIZES } from '../../../utils/theme';

import { Gap } from '../../../components';
import MemoDomainProfilePicture from '../../../assets/icon/DomainProfilePictureEmptyState';
import MemoFollowDomain from '../../../assets/icon/IconFollowDomain';
import MemoIc_rectangle_gradient_mini from '../../../assets/Ic_rectangle_gradient_mini';
import MemoPeopleFollow from '../../../assets/icons/Ic_people_follow';
import MemoUnfollowDomain from '../../../assets/icon/IconUnfollowDomain';
import Memoic_globe from '../../../assets/icons/ic_globe';
import NewsEmptyState from '../../../assets/images/news-empty-state.png';
import { colors } from '../../../utils/colors';
import dimen from '../../../utils/dimen';

const RenderItemHeader = ({ item, image, follow= false, handleFollow= () => {}, handleUnfollow=() => {} }) => {
    const getname = (i) => {
        try {
            return i.domain.name;
        } catch (error) {
            return 'undenfined';
        }
    };
    
    const gettime = (d) => {
        try {
            return d.time;
        } catch (error) {
            return new Date().toUTCString();
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.wrapperImage}>
            {image ? (
                <Image
                    source={{ uri: image }}
                    style={[styles.image, StyleSheet.absoluteFillObject]}
                />
            ) : (
                <MemoDomainProfilePicture width="47" height="47" />
            )}
            </View>
            <Gap width={SIZES.base} />
            <View style={{ flex: 1 }}>
            <Text style={styles.headerDomainName}>{getname(item)}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.headerDomainDate}>
                    {new Date(gettime(item)).toLocaleDateString()}
                </Text>
                <View style={styles.point} />
                <Memoic_globe height={normalize(13)} width={normalize(13)} />
                <View style={styles.point} />

                <MemoPeopleFollow height={normalize(13)} width={normalize(12)} />
                <Gap style={{ width: 4 }} />
                <Text
                style={{
                    color: '#828282',
                    fontSize: normalizeFontSize(12),
                    fontFamily: fonts.inter[700],
                }}>
                12k
                </Text>
            </View>
            <Gap height={normalize(8)} />
            <View style={styles.domainIndicatorContainer}>
                <MemoIc_rectangle_gradient_mini
                width={normalize(SIZES.width * 0.43)}
                height={4}
                />
            </View>
            </View>
            <View style={{ justifyContent: 'center' }}>
            {follow ? (
                <TouchableOpacity onPress={handleUnfollow}>
                <View style={styles.wrapperTextUnFollow}>
                    <MemoUnfollowDomain />
                </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={handleFollow}>
                <View style={styles.wrapperText}>
                    <MemoFollowDomain />
                </View>
                </TouchableOpacity>
            )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.gray1,
        paddingBottom: 8,
        paddingTop: 8,
    },
    wrapperImage: {
        borderRadius: normalize(45),
        borderWidth: 0.2,
        borderColor: 'rgba(0,0,0,0.5)',
        width: normalize(48),
        height: normalize(48),
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: normalize(48),
        width: normalize(48),
        borderRadius: normalize(45),
    },
    headerDomainName: {
        fontSize: normalizeFontSize(14),
        fontFamily: fonts.inter[600],
        lineHeight: normalizeFontSize(16.9),
        color: '#000000',
    },
    headerDomainDate: {
        fontFamily: fonts.inter[400],
        fontSize: normalizeFontSize(12),
        lineHeight: normalizeFontSize(18),
        color: '#828282',
    },
    point: {
        width: 3,
        height: 3,
        borderRadius: 4,
        backgroundColor: colors.gray,
        marginLeft: 8,
        marginRight: 8,
    },
    domainItemTitle: {
        fontSize: normalizeFontSize(16),
        fontFamily: fonts.inter[700],
        lineHeight: normalizeFontSize(24),
    },
    domainItemDescription: {
        fontFamily: fonts.inter[400],
        fontSize: normalizeFontSize(16),
        lineHeight: normalizeFontSize(24),
    },
    domainIndicatorContainer: {
        marginLeft: -4,
        justifyContent: 'flex-start',
    },
    wrapperTextUnFollow: {
        backgroundColor: '#00ADB5',
        borderRadius: 8,
        borderColor: '#00ADB5',
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
    },
    wrapperText: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: '#00ADB5',
        width: normalize(36),
        height: normalize(36),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: normalize(0.5),
    },
})

export default RenderItemHeader