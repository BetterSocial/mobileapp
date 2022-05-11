import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import Tooltip from 'react-native-walkthrough-tooltip';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize'
import { TouchableNativeFeedback } from 'react-native';

import ActionButtonGroup from './elements/ActionButtonGroup';
import CredderInfoGroup from './elements/CredderInfoGroup';
import DomainFollowerNumber from './elements/DomainFollowerNumber';
import GlobalButton from '../../../../components/Button/GlobalButton';
import MemoDomainProfilePicture from '../../../../assets/icon/DomainProfilePictureEmptyState';
import MemoIc_interface from '../../../../assets/icons/Ic_interface';
import MemoIc_question_mark from '../../../../assets/icons/Ic_question_mark';
import MemoIc_rectangle_gradient from '../../../../assets/Ic_rectangle_gradient';
import StringConstant from '../../../../utils/string/StringConstant';
import { COLORS, SIZES } from '../../../../utils/theme';
import { Gap, SingleSidedShadowBox } from '../../../../components';
import { colors } from '../../../../utils/colors';
import { fonts, normalize, normalizeFontSize } from '../../../../utils/fonts';
import { getSingularOrPluralText } from '../../../../utils/string/StringUtils';

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent placerat erat tellus, non consequat mi sollicitudin quis.';

const Header = ({
  image,
  domain,
  description,
  followers,
  onPressBlock,
  onPressUnblock,
  handleFollow,
  handleUnfollow,
  follow = false,
  isBlocked,
  item
}) => {
  const openDomainLink = async () => {
    let isURL = await Linking.canOpenURL(`https://${domain}`);
    console.log(isURL);
    if (isURL) {
      Linking.openURL(`https://${domain}`);
    } else {
      SimpleToast.show(StringConstant.domainCannotOpenURL, SimpleToast.SHORT);
    }
  };

  return (
    <View style={styles.headerDomain}>
      <View style={styles.row}>
        <View style={styles.wrapperImage}>
          {image ? (
            <>
              <View style={styles.circleImageWrapper} />
              <Image
                source={{ uri: image }}
                style={[styles.circleImage, StyleSheet.absoluteFillObject]}
              />
            </>
          ) : (
            <MemoDomainProfilePicture />
          )}
        </View>
        <View style={styles.wrapperHeader}>
          <View style={styles.row}>
            <Text style={styles.domainName}>{domain}</Text>
            <View style={{alignSelf: 'center'}}>
              <TouchableOpacity
                style={styles.openInBrowserIcon}
                onPress={openDomainLink}>
                <MemoIc_interface width={17} height={17} />
              </TouchableOpacity>
            </View>
          </View>
          <DomainFollowerNumber followers={followers} />
          <CredderInfoGroup score={item.domain.credderScore}/>
        </View>
      </View>
      <Gap height={normalize(14)} />
      <Text style={styles.domainDescription}>
        {description}
        {/* Lorem Ipsum Dolor sit amet, consectetur adipiscing elit. Praesent placerat erat tellus, non consequat mi sollicitudin quis. */}
      </Text>
      <Gap height={normalize(10)} />
      <ActionButtonGroup 
        follow={follow} 
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        isBlocked={isBlocked}
        onPressBlock={onPressBlock}
        onPressUnblock={onPressUnblock} />
      <Gap height={normalize(12)} />
      {/* <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={{ flex: 1, paddingBottom: 0 }}>
          <MemoIc_rectangle_gradient width={'100%'} height={normalize(18)} />
        </View>
        <Tooltip
          // allowChildInteraction={false}
          isVisible={isTooltipShown}
          placement={'bottom'}
          backgroundColor={'rgba(0,0,0,0)'}
          showChildInTooltip={false}
          onClose={() => setIsTooltipShown(false)}
          contentStyle={styles.tooltipShadowContainer}
          arrowSize={{ width: 0, height: 0 }}
          content={
            <View>
              <Text style={styles.tooltipContent}>
                {description}
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
            <MemoIc_question_mark
              width={normalize(17)}
              height={normalize(17)}
            />
          </TouchableOpacity>
        </Tooltip>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: { flexDirection: 'row', alignItems: 'center' },
  desc: {
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    lineHeight: normalizeFontSize(16),
  },
  containerFollowers: { flexDirection: 'row' },
  followers: {
    color: '#00ADB5',
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(16),
    fontWeight: '700',
  },
  wrapperDomain: { flexDirection: 'row', marginTop: 8 },
  iconDomain: { marginStart: 8, justifyContent: 'center' },
  domain: {
    fontSize: normalizeFontSize(24),
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
  },
  actionText: (color) => ({
    fontSize: normalizeFontSize(14),
    color,
  }),
  headerDomain: {
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopColor: 'transparent',
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.8,
    // shadowRadius: 1,
    paddingTop: 15,
  },
  container: {
    flexDirection: 'row',
  },
  image: { height: '100%', width: '100%', borderRadius: 45 },
  containerImage: { flex: 1.3 },
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
    height: normalize(36),
    backgroundColor: '#00ADB5',
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  wrapperHeader: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 28,
  },
  width: (wid) => ({
    width: wid,
  }),
  height: (height) => ({
    height,
  }),
  wrapperImage: {
    borderRadius: normalize(50),
    borderColor: 'rgba(0,0,0,0.5)',
    width: normalize(100),
    height: normalize(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  followButtonText: {
    fontSize: normalizeFontSize(14),
    color: 'white',
    paddingHorizontal: 25,
  },
  domainName: {
    fontSize: RFValue(20),
    fontFamily: fonts.inter[700],
    lineHeight: RFValue(24.2),
    color: '#000000',
  },
  domainDescription: {
    fontFamily: fonts.inter[400],
    lineHeight: normalizeFontSize(17),
    fontSize: normalizeFontSize(14),
    // lineHeight: 17,
  },
  shadowBox: {
    paddingBottom: 8,
  },
  arrow: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'white',
    top: 23,
    zIndex: 10000000,
    left: 10,
    transform: [{ rotate: '45deg' }],
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  openInBrowserIcon: {
    padding: normalize(4),
    // paddingHorizontal: normalize(12),
    // marginLeft: 5.67,
    marginLeft: 3.67,
    top: 0,
    color: COLORS.bondi_blue
  },
  circleImage: {
    height: normalize(100),
    width: normalize(100),
    alignSelf: 'center',
    borderRadius: normalize(100),
    resizeMode: 'cover',
    zIndex: -10000,
  },
  circleImageWrapper: {
    height: normalize(100),
    width: normalize(100),
    borderRadius: normalize(50),
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
  },
});

export default Header;
