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

const Header = ({image, domain, description, followers, onPress}) => (
  <View style={styles.headerDomain}>
    <View style={{flexDirection: 'row'}}>
      <View style={{flex: 1.3}}>
        <View
          style={{
            borderRadius: 45,
            borderWidth: 0.2,
            borderColor: 'rgba(0,0,0,0.5)',
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
        <Gap style={{width: 8}} />
        <TouchableOpacity style={styles.buttonBlock} onPress={() => onPress(0)}>
          <Text style={{fontSize: 14, color: '#FF2E63'}}>Block</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={{flexDirection: 'row', marginTop: 8}}>
      <Text
        style={{
          fontSize: 24,
          fontFamily: fonts.inter[600],
          fontWeight: 'bold',
        }}>
        {domain}
      </Text>
      <View style={{marginStart: 8, justifyContent: 'center'}}>
        <MemoIc_interface width={22} height={22} />
      </View>
    </View>

    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          color: '#00ADB5',
          fontFamily: fonts.inter[400],
          fontSize: 16,
          fontWeight: '700',
        }}>
        {followers}k
      </Text>
      <Gap style={{width: 4}} />
      <Text>Followers</Text>
    </View>
    <Gap style={{height: 8}} />
    <Text style={{fontSize: 14, fontFamily: fonts.inter[400], lineHeight: 16}}>
      {description}
    </Text>
    <Gap style={{height: 8}} />
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <MemoIc_rectangle_gradient width={width * 0.75} height={20} />
      <Gap style={{width: 4}} />
      <MemoIc_question_mark width={16} height={16} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerDomain: {
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: 16,
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
});

export default Header;
