import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import GlobalButton from '../../../../components/Button/GlobalButton';
import {colors} from '../../../../utils/colors';
import {fonts} from '../../../../utils/fonts';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../../utils/constants';
// data needed name, description, image
const styles = StyleSheet.create({
  buttonBlockUser: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: colors.bondi_blue,
    borderWidth: 1
  },
  textButtonBlock: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.white
  },
  textButtonBlockUser: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.bondi_blue
  },
  profilepicture: {
    width: 48,
    height: 48,
    // backgroundColor: colors.bondi_blue,
    borderRadius: 24,
    resizeMode: 'cover',
    borderColor: colors.lightgrey,
    borderWidth: 1
  },
  wrapProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    paddingVertical: 11
  },
  imageProfile: {
    width: 48,
    height: 48,
    borderRadius: 48
  },
  wrapTextProfile: {
    marginLeft: 12,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  textProfileUsername: {
    fontFamily: fonts.inter[500],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black
  },
  textProfileFullName: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    flexWrap: 'wrap'
  },
  buttonBlock: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.blockColor,
    borderRadius: 8,
    backgroundColor: colors.blockColor
  },
  card: {
    height: 68,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 10
  }
});

const BlockedList = (props) => {
  const {item, isHashtag, handleSetBlock, handleSetUnblock, onPressBody} = props;

  const hanldeImage = (uri) => {
    return (
      <View style={[styles.profilepicture, {backgroundColor: colors.gray1}]}>
        <Image
          source={{
            uri: uri || DEFAULT_PROFILE_PIC_PATH
          }}
          style={styles.profilepicture}
          width={48}
          height={48}
          testID="images"
        />
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <GlobalButton testID="pressbody" onPress={() => onPressBody(item)} style={styles.wrapProfile}>
        {!isHashtag ? <React.Fragment>{hanldeImage(item.image)}</React.Fragment> : null}

        <View style={styles.wrapTextProfile}>
          <Text testID="name" style={styles.textProfileUsername}>
            {isHashtag && '#'}
            {item.name || 'Anonymous'}
          </Text>
          <Text
            testID="desc"
            style={styles.textProfileFullName}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {item.description ? item.description : ''}
          </Text>
        </View>
      </GlobalButton>
      {item.isUnblocked ? (
        <GlobalButton testID="isUnblock" onPress={handleSetBlock}>
          <View style={styles.buttonBlockUser}>
            <Text style={styles.textButtonBlockUser}>Block</Text>
          </View>
        </GlobalButton>
      ) : (
        <GlobalButton testID="isBlock" onPress={handleSetUnblock}>
          <View style={styles.buttonBlock}>
            <Text style={styles.textButtonBlock}>Blocked</Text>
          </View>
        </GlobalButton>
      )}
    </View>
  );
};

BlockedList.propTypes = {
  item: PropTypes.object,
  onPressList: PropTypes.func,
  isHashtag: PropTypes.bool,
  onPressBody: PropTypes.func
};

BlockedList.defaultProps = {
  onPressList: () => {},
  handleSetBlock: () => {},
  handleSetUnblock: () => {},
  onPressBody: () => {}
};

export default BlockedList;
