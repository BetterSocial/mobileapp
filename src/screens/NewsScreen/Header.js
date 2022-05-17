import * as React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CredderRating from '../../components/CredderRating';
import Gap from '../../components/Gap';
import GlobalButton from '../../components/Button/GlobalButton';
import MemoIc_rectangle_gradient from '../../assets/Ic_rectangle_gradient';
import { Avatar } from '../../components';
import { COLORS, FONTS, SIZES } from '../../utils/theme';
import { Context } from '../../context';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { setDomainData, setProfileDomain } from '../../context/actions/domainAction';

const Header = ({ image, domain, time, item }) => {
  const [domainStore, dispatchDomain] = React.useContext(Context).domains;
  const navigation = useNavigation();
  const onHeaderPressed = () => {
    if (item.domain.name !== domainStore.selectedLastDomain) {
      setProfileDomain({}, dispatchDomain);
      setDomainData([], dispatchDomain);
    }
    navigation.push('DomainScreen', {
      item: {
        ...item,
        og: {
          domain: item.domain.name,
        },
      },
    });
  };

  return (
    <GlobalButton buttonStyle={styles.noPl} onPress={onHeaderPressed}>
      <View style={styles.container}>
        <Avatar image={image} style={styles.avatar} />
        <Gap width={8} />
        <View style={styles.row}>
          <View style={styles.domainNameContainer}>
            <Text style={styles.domain} numberOfLines={1}>{domain}</Text>
            <View style={styles.point} />
            <Text style={styles.domainPostDate} numberOfLines={1}>
              {new Date(time).toLocaleDateString()}
            </Text>
          </View>
          {/* <MemoIc_rectangle_gradient width={SIZES.width * 0.43} height={20} /> */}
        </View>
        <CredderRating containerStyle={{ height: 28, alignSelf: 'center' }} score={item?.domain?.credderScore} />
      </View>
    </GlobalButton>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 36,
    height: 36,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.base,
    marginLeft: 12,
    marginTop: 4,
    display: 'flex',
  },
  domain: {
    lineHeight: 14.52,
    fontSize: 14,
    fontFamily: fonts.inter[600],
    flexShrink: 1,
  },
  domainNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  domainPostDate: {
    lineHeight: 14.52,
    fontSize: 14,
    fontFamily: fonts.inter[400],
    color: colors.gray,
  },
  wrapperItem: { backgroundColor: 'white', marginBottom: 16 },
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 46,
    width: 46,
    borderRadius: 45,
  },
  wrapperText: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#00ADB5',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  noPl: {
    paddingLeft: 0
  },
  row: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  }
});

export default Header;
