import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Gap from '../../components/Gap';
import GlobalButton from '../../components/Button/GlobalButton';
import MemoIc_rectangle_gradient from '../../assets/Ic_rectangle_gradient';
import {Avatar} from '../../components';
import {COLORS, FONTS, SIZES} from '../../utils/theme';
import {Context} from '../../context';
import {FeedCredderRating} from '../../components/CredderRating';
import {calculateTime} from '../../utils/time';
import {fonts} from '../../utils/fonts';
import {setDomainData, setProfileDomain} from '../../context/actions/domainAction';

const Header = ({image, domain, time, item}) => {
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
          domain: item.domain.name
        }
      }
    });
  };

  return (
    <GlobalButton testID="headerBtn" buttonStyle={styles.noPl} onPress={onHeaderPressed}>
      <View style={styles.container}>
        <Avatar image={image} style={styles.avatar} />
        <Gap width={8} />
        <View style={styles.row}>
          <View style={styles.domainNameContainer}>
            <Text style={styles.domain} numberOfLines={1}>
              {domain}
            </Text>
            <View style={styles.point} />
            <Text style={styles.domainPostDate} numberOfLines={1}>
              {/* {new Date(time).toLocaleDateString()} */}
              {calculateTime(time)}
            </Text>
            <View style={styles.point} />
            <FeedCredderRating
              containerStyle={{height: 16, alignSelf: 'center'}}
              score={item?.domain?.credderScore}
              scoreSize={12}
              iconSize={16}
            />
          </View>
          {/* <MemoIc_rectangle_gradient width={SIZES.width * 0.43} height={20} /> */}
        </View>
      </View>
    </GlobalButton>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 24,
    height: 24,
    alignSelf: 'center'
  },
  container: {
    flexDirection: 'row',
    // paddingHorizontal: SIZES.base,
    // marginLeft: 12,
    paddingTop: 8.5,
    paddingBottom: 8.5,
    display: 'flex'
  },
  domain: {
    lineHeight: 14.52,
    fontSize: 12,
    fontFamily: fonts.inter[600],
    flexShrink: 1
  },
  domainNameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  domainPostDate: {
    lineHeight: 14.52,
    fontSize: 12,
    fontFamily: fonts.inter[400],
    color: COLORS.gray
  },
  wrapperItem: {backgroundColor: 'white', marginBottom: 16},
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 46,
    width: 46,
    borderRadius: 45
  },
  wrapperText: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderColor: COLORS.anon_primary,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5
  },
  point: {
    width: 3,
    height: 3,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 1
  },
  noPl: {
    padding: 0
  },
  row: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8
  }
});

export default React.memo(Header);
