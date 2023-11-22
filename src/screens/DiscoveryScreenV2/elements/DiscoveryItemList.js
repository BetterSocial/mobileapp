import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from 'react-native';

import MemoDomainProfilePicture from '../../../assets/icon/DomainProfilePictureEmptyState';
import TopicsProfilePictureEmptyState from '../../../assets/icon/TopicsProfilePictureEmptyState';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const renderDefaultImage = (DefaultImage) => {
  if (DefaultImage) {
    return <DefaultImage />;
  }
  return <MemoDomainProfilePicture width={48} height={48} />;
};

const DomainList = (props) => {
  const {
    item,
    isHashtag,
    handleSetFollow,
    handleSetUnFollow,
    handleSetBlock,
    handleSetUnblock,
    onPressBody,
    DefaultImage,
    isCommunity,
    isBlockedSection
  } = props;

  const renderButonAction = () => {
    if (isBlockedSection) {
      if (item.isUnblocked) {
        return (
          <TouchableNativeFeedback testID="isUnblock" onPress={handleSetBlock}>
            <View style={styles.followContainer}>
              <View style={styles.buttonBlockUser}>
                <Text style={styles.textButtonBlockUser}>Block</Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        );
      }
      return (
        <TouchableNativeFeedback testID="isBlock" onPress={handleSetUnblock}>
          <View style={styles.followContainer}>
            <View style={styles.buttonBlock}>
              <Text style={styles.textButtonBlock}>Blocked</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      );
    }
    if (item.isunfollowed) {
      return (
        <TouchableNativeFeedback onPress={handleSetFollow}>
          <View style={styles.followContainer}>
            <View style={styles.buttonFollow}>
              <Text style={styles.textButtonFollow}>{isCommunity ? 'Join' : 'Follow'}</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      );
    }
    return (
      <TouchableNativeFeedback onPress={handleSetUnFollow}>
        <View style={styles.followContainer}>
          <View style={styles.buttonFollowing}>
            <Text style={styles.textButtonFollowing}>{isCommunity ? 'Joined' : 'Following'}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="pressbody"
        onPress={() => onPressBody(item)}
        style={styles.wrapProfile}>
        <View style={styles.card}>
          {!isHashtag ? (
            <React.Fragment>
              {item.image && typeof item.image === 'string' && item.image.length > 0 ? (
                <Image
                  testID="images"
                  source={{
                    uri: item.image
                  }}
                  style={styles.profilepicture}
                  width={48}
                  height={48}
                />
              ) : DefaultImage ? (
                <TopicsProfilePictureEmptyState />
              ) : (
                <View testID="noimage">{renderDefaultImage(DefaultImage)}</View>
              )}
            </React.Fragment>
          ) : null}

          <View style={isHashtag ? styles.wrapTextProfileTopic : styles.wrapTextProfile}>
            <Text testID="name" numberOfLines={1} style={styles.textProfileUsername}>
              {isHashtag && '#'}
              {item.name}
            </Text>

            {item.description !== null && (
              <Text
                testID="desc"
                style={item.isDomain ? styles.textProfileFullName : styles.domainDescription}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {item.description ? item.description : ''}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
      {renderButonAction()}
    </View>
  );
};

// data needed name, description, image
const styles = StyleSheet.create({
  buttonFollow: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.bondi_blue
  },
  container: {
    height: 64,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.bondi_blue
  },
  textButtonFollow: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.white
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
    marginEnd: 4
  },
  imageProfile: {
    width: 48,
    height: 48,
    borderRadius: 48
  },
  wrapTextProfile: {
    marginLeft: 12,
    flexDirection: 'column',
    flex: 1
    // justifyContent: 'space-between',
  },
  wrapTextProfileTopic: {
    flexDirection: 'column',
    flex: 1
    // justifyContent: 'space-between',
  },
  textProfileUsername: {
    fontFamily: fonts.inter[500],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
    lineHeight: 16.94
    // backgroundColor: 'red',
  },
  textProfileFullName: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    flexWrap: 'wrap',
    lineHeight: 18,
    // backgroundColor: 'green',
    marginTop: 4
  },
  domainDescription: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    flexWrap: 'wrap',
    lineHeight: 18,
    // backgroundColor: 'green',
    marginTop: 4
  },
  buttonFollowing: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8
  },
  card: {
    height: 64,
    // height: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 20
    // backgroundColor: 'red'
    // marginVertical: 10,
  },
  followContainer: {
    paddingRight: 20,
    paddingLeft: 8,
    height: '100%',
    justifyContent: 'center'
    // backgroundColor: 'blue'
  },
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
  }
});

DomainList.propTypes = {
  item: PropTypes.object,
  isHashtag: PropTypes.bool,
  isDomain: PropTypes.bool,
  onPressBody: PropTypes.func,
  DefaultImage: PropTypes.element,
  isCommunity: PropTypes.bool,
  handleSetFollow: PropTypes.func,
  handleSetUnFollow: PropTypes.func,
  isBlockedSection: PropTypes.bool,
  handleSetBlock: PropTypes.func,
  handleSetUnblock: PropTypes.func
};

DomainList.defaultProps = {
  handleSetFollow: () => null,
  handleSetUnFollow: () => null,
  onPressBody: () => null
};

export default React.memo(DomainList);
