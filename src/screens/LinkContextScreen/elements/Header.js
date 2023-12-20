import * as React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MemoDomainProfilePicture from '../../../assets/icon/DomainProfilePictureEmptyState';
import MemoFollowDomain from '../../../assets/icon/IconFollowDomain';
import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import MemoIc_rectangle_gradient from '../../../assets/Ic_rectangle_gradient';
import MemoPeopleFollow from '../../../assets/icons/Ic_people_follow';
import MemoUnfollowDomain from '../../../assets/icon/IconUnfollowDomain';
import Memoic_globe from '../../../assets/icons/ic_globe';
import { COLORS, SIZES } from '../../../utils/theme';
import { Context } from '../../../context';
import { FeedCredderRating } from '../../../components/CredderRating';
import { Gap } from '../../../components';
import { addIFollowByID, setIFollow } from '../../../context/actions/news';
import { calculateTime } from '../../../utils/time';
import {
  followDomain,
  getDomainIdIFollow,
  unfollowDomain,
} from '../../../service/domain';
import { fonts, normalizeFontSize } from '../../../utils/fonts';

const Header = ({
  item,
  image,
  name,
  time,
  showBackButton,
  follow,
  setFollow,
}) => {
  const iddomain = item.content.domain_page_id;
  const navigation = useNavigation();
  const [dataFollow] = React.useState({
    domainId: iddomain,
    source: 'domain_page',
  });

  const [news, dispatch] = React.useContext(Context).news;
  const { ifollow } = news;

  const onHeaderClicked = () => {
    navigation.push('DomainScreen', {
      item: {
        ...item,
        og: {
          domain: item.domain.name,
        },
      },
    });
  };

  const onNavigationBack = () => {
    navigation.goBack();
  };

  const getIFollow = async () => {
    if (ifollow.length === 0) {
      const res = await getDomainIdIFollow();
      setIFollow(res.data, dispatch);
    } else {
      setFollow(JSON.stringify(ifollow).includes(iddomain));
    }
  };

  const handleFollow = async () => {
    setFollow(true);
    const res = await followDomain(dataFollow);
    if (res.code === 200) {
      addIFollowByID(
        {
          domain_id_followed: iddomain,
        },
        dispatch,
      );
    } else {
      setFollow(false);
    }
  };
  const handleUnFollow = async () => {
    setFollow(false);
    const res = await unfollowDomain(dataFollow);
    if (res.code === 200) {
      const newListFollow = await ifollow.filter((obj) => obj.domain_id_followed !== iddomain);
      setIFollow(newListFollow, dispatch);
    } else {
      setFollow(true);
    }
  };

  const onFollowDomainPressed = () => {
    follow ? handleUnFollow() : handleFollow();
  };

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
      <Pressable onPress={onHeaderClicked} style={styles.leftRowContainer}>
        {showBackButton && (
          <TouchableOpacity
            onPress={onNavigationBack}
            style={styles.backbutton}>
            <MemoIc_arrow_back width={18} height={18} />
          </TouchableOpacity>
        )}
        <View style={styles.wrapperImage(showBackButton)}>
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
        <View style={styles.headerDomainInfoContainer}>
          <Text style={styles.headerDomainName} numberOfLines={1}>{name}</Text>
          <View style={styles.headerDomainDateContainer}>
            <Text style={styles.headerDomainDate} numberOfLines={1}>
              {calculateTime(time)}
            </Text>
            <View style={styles.point} />
            <MemoPeopleFollow height={13} width={12} />
            <Gap style={{ width: 3.33 }} />
            <Text style={styles.headerFollowerText}>12k</Text>
            <View style={styles.point} />
            <FeedCredderRating
              containerStyle={styles.credderRating}
              scoreSize={normalizeFontSize(12)}
              scoreStyle={{marginTop: normalizeFontSize(1.5)}}
              score={item?.domain?.credderScore}
              iconSize={16} />
          </View>
        </View>
      </Pressable>
      <View style={{ justifyContent: 'center' }}>
        <TouchableOpacity onPress={onFollowDomainPressed}>
          {follow ? (
            <View style={styles.wrapperTextUnFollow}>
              <MemoUnfollowDomain />
            </View>
          ) : (
            <View style={styles.wrapperText}>
              <MemoFollowDomain />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  credderRating: {
    height: 16,
    alignSelf: 'center',
    marginRight: 8,
  },
  headerDomainInfoContainer: {
    flex: 1,
    // alignContent: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerDomainDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    display: 'flex',
    // flex: 1,
    flexDirection: 'row',
    paddingRight: 20,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray1,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: COLORS.white,
  },
  wrapperImage: (showBackButton = true) => ({
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: showBackButton ? 0 : 20,
  }),
  image: {
    height: 48,
    width: 48,
    borderRadius: 45,
  },
  headerDomainName: {
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[600],
    lineHeight: normalizeFontSize(16.9),
    color: COLORS.black,
  },
  headerDomainDate: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(18),
    color: COLORS.blackgrey,
    flexShrink: 1,
  },
  headerFollowerText: {
    color: COLORS.blackgrey,
    fontSize: 12,
    fontFamily: fonts.inter[700],
  },
  domainItemTitle: {
    fontSize: 16,
    fontFamily: fonts.inter[700],
    lineHeight: 24,
  },
  point: {
    width: 3,
    height: 3,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  domainIndicatorContainer: {
    marginLeft: -4,
  },
  wrapperText: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderColor: COLORS.holyTosca,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  wrapperTextUnFollow: {
    backgroundColor: COLORS.holyTosca,
    borderRadius: 8,
    borderColor: COLORS.holyTosca,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  leftRowContainer: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },
  backbutton: {
    padding: 16,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
});

export default Header;
