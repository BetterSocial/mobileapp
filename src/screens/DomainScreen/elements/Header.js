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
import Gap from '../../../components/Gap';

const {width} = Dimensions.get('window');

const Header = ({image, domain, description, followers, onPress}) => (
  <View style={styles.headerDomain}>
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <View style={styles.boxImage}>
          <Image
            source={{
              uri: image
                ? image
                : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
            }}
            style={[styles.image, StyleSheet.absoluteFillObject]}
          />
        </View>
      </View>
      <View style={styles.wrapperHeader}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => onPress(1)}>
          <Text style={styles.actionText('white')}>Follow</Text>
        </TouchableOpacity>
        <Gap style={styles.width(8)} />
        <TouchableOpacity style={styles.buttonBlock} onPress={() => onPress(0)}>
          <Text style={styles.actionText('#FF2E63')}>Block</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.wrapperDomain}>
      <Text style={styles.domain}>{domain}</Text>
      <View style={styles.iconDomain}>
        <MemoIc_interface width={22} height={22} />
      </View>
    </View>

    <View style={styles.containerFollowers}>
      <Text style={styles.followers}>{followers}k</Text>
      <Gap style={styles.width(4)} />
      <Text>Followers</Text>
    </View>
    <Gap style={styles.height(8)} />
    <Text style={styles.desc}>{description}</Text>
    <Gap style={styles.height(8)} />
    <View style={styles.icon}>
      <MemoIc_rectangle_gradient width={width * 0.75} height={20} />
      <Gap style={styles.width(4)} />
      <MemoIc_question_mark width={16} height={16} />
    </View>
  </View>
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
    paddingHorizontal: 16,
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

  width: (wid) => ({
    width: wid,
  }),
  height: (height) => ({
    height,
  }),
});

export default Header;
