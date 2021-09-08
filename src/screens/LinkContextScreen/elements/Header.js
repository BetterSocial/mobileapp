import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import MemoDomainProfilePicture from '../../../assets/icon/DomainProfilePictureEmptyState';
import MemoFollowDomain from '../../../assets/icon/IconFollowDomain';
import Memoic_globe from '../../../assets/icons/ic_globe';
import MemoPeopleFollow from '../../../assets/icons/Ic_people_follow';
import MemoIc_rectangle_gradient from '../../../assets/Ic_rectangle_gradient';
import {Gap} from '../../../components';
import {fonts} from '../../../utils/fonts';
import {COLORS, SIZES} from '../../../utils/theme';

const Header = ({
  item,
  image,
  name,
  time,
  onFollowDomainPressed,
  showBackButton,
}) => {
  const navigation = useNavigation();

  let onHeaderClicked = () => {
    navigation.push('DomainScreen', {
      item: {
        ...item,
        og: {
          domain: item.domain.name,
        },
      },
    });
  };

  let onNavigationBack = () => {
    navigation.goBack();
  };

  return (
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
              source={{uri: image}}
              style={[styles.image, StyleSheet.absoluteFillObject]}
            />
          ) : (
            <MemoDomainProfilePicture width="47" height="47" />
          )}
        </View>
        <Gap width={SIZES.base} />
        <View style={{flex: 1}}>
          <Text style={styles.headerDomainName}>{name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.headerDomainDate}>
              {new Date(time).toLocaleDateString()}
            </Text>
            <View style={styles.point} />
            <Memoic_globe height={13} width={13} />
            <View style={styles.point} />

            <MemoPeopleFollow height={13} width={12} />
            <Gap style={{width: 4}} />
            <Text
              style={{
                color: '#828282',
                fontSize: 12,
                fontFamily: fonts.inter[700],
              }}>
              12k
            </Text>
          </View>
          <Gap height={8} />
          <View style={styles.domainIndicatorContainer}>
            <MemoIc_rectangle_gradient width={SIZES.width * 0.43} height={4} />
          </View>
        </View>
      </Pressable>
      <View style={{justifyContent: 'center'}}>
        <TouchableOpacity onPress={onFollowDomainPressed}>
          <View style={styles.wrapperText}>
            <MemoFollowDomain />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingRight: 20,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray1,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: COLORS.white,
  },
  wrapperImage: (showBackButton = true) => {
    return {
      borderRadius: 45,
      borderWidth: 0.2,
      borderColor: 'rgba(0,0,0,0.5)',
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: showBackButton ? 0 : 20,
    };
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 45,
  },
  headerDomainName: {
    fontSize: 14,
    fontFamily: fonts.inter[600],
    lineHeight: 16.9,
    color: '#000000',
  },
  headerDomainDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: '#828282',
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
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#00ADB5',
    width: 36,
    height: 36,
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
