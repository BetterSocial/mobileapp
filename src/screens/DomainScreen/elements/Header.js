import * as React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

import MemoIc_interface from '../../../assets/icons/Ic_interface';
import MemoIc_question_mark from '../../../assets/icons/Ic_question_mark';
import MemoIc_rectangle_gradient from '../../../assets/Ic_rectangle_gradient';
import {fonts} from '../../../utils/fonts';
import {SIZES, COLORS, FONTS} from '../../../utils/theme';
import {SingleSidedShadowBox, Gap} from '../../../components';

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent placerat erat tellus, non consequat mi sollicitudin quis.';

const {width} = Dimensions.get('window');

const Header = ({image, domain, description, followers, onPress}) => (
  <SingleSidedShadowBox style={styles.shadowBox}>
    <View style={styles.headerDomain}>
      <View style={styles.row}>
        <View style={styles.wrapperImage}>
          <Image
            source={{
              uri: image
                ? image
                : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
            }}
            style={[
              {height: '100%', width: '100%', borderRadius: 45},
              StyleSheet.absoluteFillObject,
            ]}
          />
        </View>
        <View style={styles.wrapperHeader}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => onPress(1)}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
          <Gap width={SIZES.base} />
          <TouchableOpacity
            style={styles.buttonBlock}
            onPress={() => onPress(0)}>
            <Text style={styles.blockButtonText}>Block</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Gap height={12} />
      <View style={styles.row}>
        <Text style={styles.domainName}>{domain}</Text>
        <View style={{marginStart: 8, justifyContent: 'center'}}>
          <MemoIc_interface width={20} height={20} />
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
      <Gap height={16} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <MemoIc_rectangle_gradient width={width * 0.75} height={20} />
        <Gap width={8} />
        <MemoIc_question_mark width={16} height={16} />
      </View>
      <Gap height={28} />
    </View>
  </SingleSidedShadowBox>
);

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
});

export default Header;
