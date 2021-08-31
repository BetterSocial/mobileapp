import * as React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import SimpleToast from 'react-native-simple-toast';

import MemoIc_interface from '../../../assets/icons/Ic_interface';
import MemoIc_question_mark from '../../../assets/icons/Ic_question_mark';
import MemoIc_rectangle_gradient from '../../../assets/Ic_rectangle_gradient';
import {fonts} from '../../../utils/fonts';
import {SIZES, COLORS} from '../../../utils/theme';
import {SingleSidedShadowBox, Gap} from '../../../components';
import StringConstant from '../../../utils/string/StringConstant';
import {Context} from '../../../context';
import {
  followDomain,
  getDomainIdIFollow,
  unfollowDomain,
} from '../../../service/domain';
import {addIFollowByID, setIFollow} from '../../../context/actions/news';
import {TouchableNativeFeedback} from 'react-native';
import {colors} from '../../../utils/colors';
import MemoDomainProfilePicture from '../../../assets/icon/DomainProfilePictureEmptyState';

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent placerat erat tellus, non consequat mi sollicitudin quis.';

const Header = ({image, domain, description, followers, onPress, iddomain}) => {
  let [isTooltipShown, setIsTooltipShown] = React.useState(false);
  const [follow, setFollow] = React.useState(false);
  const [news, dispatch] = React.useContext(Context).news;
  const [dataFollow] = React.useState({
    domainId: iddomain,
    source: 'domain_page',
  });
  let {ifollow} = news;

  const openDomainLink = async () => {
    let isURL = await Linking.canOpenURL(`https://${domain}`);
    console.log(isURL);
    if (isURL) {
      Linking.openURL(`https://${domain}`);
    } else {
      SimpleToast.show(StringConstant.domainCannotOpenURL, SimpleToast.SHORT);
    }
  };
  React.useEffect(() => {
    getIFollow();
  }, [iddomain, ifollow]);
  const getIFollow = async () => {
    if (ifollow.length === 0) {
      let res = await getDomainIdIFollow();
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
      console.log('error follow domain');
    }
  };
  const handleUnFollow = async () => {
    setFollow(false);
    const res = await unfollowDomain(dataFollow);
    if (res.code === 200) {
      let newListFollow = await ifollow.filter(function (obj) {
        return obj.domain_id_followed !== iddomain;
      });
      setIFollow(newListFollow, dispatch);
    } else {
      console.log('error unfollow domain');
    }
  };

  return (
    <SingleSidedShadowBox style={styles.shadowBox}>
      <View style={styles.headerDomain}>
        <View style={styles.row}>
          <View style={styles.wrapperImage}>
            {image ? (
              <Image
                source={{uri: image}}
                style={[
                  {height: '100%', width: '100%', borderRadius: 45},
                  StyleSheet.absoluteFillObject,
                ]}
              />
            ) : (
              <MemoDomainProfilePicture />
            )}
          </View>
          <View style={styles.wrapperHeader}>
            {follow ? (
              <TouchableNativeFeedback onPress={() => handleUnFollow()}>
                <View style={styles.buttonFollowing}>
                  <Text style={styles.textButtonFollowing}>Following</Text>
                </View>
              </TouchableNativeFeedback>
            ) : (
              <TouchableNativeFeedback onPress={() => handleFollow()}>
                <View style={styles.buttonFollow}>
                  <Text style={styles.textButtonFollow}>Follow</Text>
                </View>
              </TouchableNativeFeedback>
            )}
            <Gap width={SIZES.base} />
            <TouchableOpacity
              style={styles.buttonBlock}
              onPress={() => onPress()}>
              <Text style={styles.blockButtonText}>Block</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Gap height={12} />
        <View style={styles.row}>
          <Text style={styles.domainName}>{domain}</Text>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.openInBrowserIcon}
              onPress={openDomainLink}>
              <MemoIc_interface width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
        <Gap height={4} />
        <View style={[styles.row, {alignItems: 'center'}]}>
          <Text style={styles.followersNumber}>{followers}k</Text>
          <Gap width={4} />
          <Text style={styles.followersText}>Followers</Text>
        </View>
        <Gap height={14} />
        <Text style={styles.domainDescription}>
          {description ? description : lorem}
        </Text>
        <Gap height={10} />
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <View style={{flex: 1, paddingBottom: 0}}>
            <MemoIc_rectangle_gradient width={'100%'} height={20} />
          </View>
          <Tooltip
            // allowChildInteraction={false}
            isVisible={isTooltipShown}
            placement={'bottom'}
            backgroundColor={'rgba(0,0,0,0)'}
            showChildInTooltip={false}
            onClose={() => setIsTooltipShown(false)}
            contentStyle={styles.tooltipShadowContainer}
            arrowSize={{width: 0, height: 0}}
            content={
              <View>
                <Text style={styles.tooltipContent}>
                  {description ? description : `${lorem} ${lorem} ${lorem}`}
                </Text>
              </View>
            }>
            <TouchableOpacity
              onPress={() => setIsTooltipShown(true)}
              style={{
                padding: 8,
                paddingBottom: 8,
                paddingTop: 8,
                paddingRight: 12,
              }}>
              <MemoIc_question_mark width={16} height={16} />
            </TouchableOpacity>
          </Tooltip>
        </View>
        <Gap height={16} />
      </View>
    </SingleSidedShadowBox>
  );
};

const styles = StyleSheet.create({
  icon: {flexDirection: 'row', alignItems: 'center'},
  desc: {fontSize: 14, fontFamily: fonts.inter[400], lineHeight: 16},
  containerFollowers: {flexDirection: 'row'},
  followers: {
    color: '#00ADB5',
    fontFamily: fonts.inter[400],
    fontSize: 16,
    fontWeight: '700',
  },
  wrapperDomain: {flexDirection: 'row', marginTop: 8},
  iconDomain: {marginStart: 8, justifyContent: 'center'},
  domain: {
    fontSize: 24,
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
  },
  actionText: (color) => ({
    fontSize: 14,
    color,
  }),
  headerDomain: {
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopColor: 'transparent',
    borderBottomColor: COLORS.gray,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    paddingTop: 15,
    // borderBottomWidth: 16,
  },
  container: {
    flexDirection: 'row',
  },
  image: {height: '100%', width: '100%', borderRadius: 45},
  containerImage: {flex: 1.3},
  boxImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    height: 36,
    backgroundColor: '#00ADB5',
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonBlock: {
    // flex: 1,
    height: 36,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#FF2E63',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  wrapperHeader: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  width: (wid) => ({
    width: wid,
  }),
  height: (height) => ({
    height,
  }),
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  followButtonText: {fontSize: 14, color: 'white', paddingHorizontal: 25},
  blockButtonText: {fontSize: 14, color: '#FF2E63', paddingHorizontal: 25},
  domainName: {
    fontSize: 24,
    fontFamily: fonts.inter[500],
    lineHeight: 29,
    color: '#000000',
  },
  followersNumber: {
    color: '#00ADB5',
    fontFamily: fonts.inter[700],
    fontSize: 14,
    lineHeight: 17,
  },
  followersText: {
    color: COLORS.black,
    fontFamily: fonts.inter[400],
    fontSize: 14,
    lineHeight: 17,
  },
  domainDescription: {
    fontFamily: fonts.inter[400],
    lineHeight: 17,
  },
  shadowBox: {paddingBottom: 8},
  tooltipContent: {
    fontFamily: fonts.inter[400],
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.blackgrey,
  },
  tooltipShadowContainer: {
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,

    elevation: 5,
  },
  arrow: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'white',
    top: 23,
    zIndex: 10000000,
    left: 10,
    transform: [{rotate: '45deg'}],
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  openInBrowserIcon: {padding: 8, paddingHorizontal: 12, top: -3},
  buttonFollowing: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8,
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.bondi_blue,
  },
  buttonFollow: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.bondi_blue,
    color: colors.white,
  },
  textButtonFollow: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.white,
  },
});

export default Header;
