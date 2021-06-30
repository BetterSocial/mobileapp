import * as React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

import Memoic_globe from '../../../assets/icons/ic_globe';
import MemoPeopleFollow from '../../../assets/icons/Ic_people_follow';
import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import MemoIc_interface from '../../../assets/icons/Ic_interface';
import MemoIc_question_mark from '../../../assets/icons/Ic_question_mark';
import MemoIc_user_group from '../../../assets/icons/Ic_user_group';
import MemoIc_rectangle_gradient from '../../../assets/Ic_rectangle_gradient';
import {fonts} from '../../../utils/fonts';
import Gap from '../../../components/Gap';
import {SIZES, COLORS, FONTS} from '../../utils/theme';
import {SingleSidedShadowBox} from '../../components';

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent placerat erat tellus, non consequat mi sollicitudin quis.';

const Header = ({image, domain, description, followers, onPress}) => (
  <SingleSidedShadowBox>
    <View style={styles.headerDomain}>
      <View style={styles.row}>
        <View style={{flex: 1.3}}>
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
        </View>
        <View style={styles.wrapperHeader}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => onPress(1)}>
            <Text style={{fontSize: 14, color: 'white'}}>Follow</Text>
          </TouchableOpacity>
          <Gap width={SIZES.base} />
          <TouchableOpacity
            style={styles.buttonBlock}
            onPress={() => onPress(0)}>
            <Text style={{fontSize: 14, color: '#FF2E63'}}>Block</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Gap height={SIZES.base} />
      <View style={styles.row}>
        <Text style={{...FONTS.h2, color: '#000000'}}>{domain}</Text>
        <View style={{marginStart: 8, justifyContent: 'center'}}>
          <MemoIc_interface width={20} height={20} />
        </View>
      </View>

      <View style={[styles.row, {alignItems: 'center'}]}>
        <Text
          style={{
            color: '#00ADB5',
            fontFamily: fonts.inter[400],
            fontSize: 16,
            fontWeight: '700',
          }}>
          {followers}k
        </Text>
        <Gap width={4} />
        <Text>Followers</Text>
      </View>
      <Gap height={8} />
      <Text style={{...FONTS.body3}}>{description ? description : lorem}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <MemoIc_rectangle_gradient width={width * 0.75} height={20} />
        <Gap width={4} />
        <MemoIc_question_mark width={16} height={16} />
      </View>
    </View>
  </SingleSidedShadowBox>
);

const styles = StyleSheet.create({
  headerDomain: {
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderTopColor: 'transparent',
    borderBottomColor: COLORS.gray,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  buttonPrimary: {
    height: 32,
    backgroundColor: '#00ADB5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonBlock: {
    flex: 1,
    height: 32,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#FF2E63',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  wrapperHeader: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Header;
