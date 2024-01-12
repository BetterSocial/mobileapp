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
import {colors} from '../../../utils/colors';
import {fonts, normalize} from '../../../utils/fonts';
import {CircleGradient} from '../../../components/Karma/CircleGradient';
import MemoDomainProfilePicture from '../../../assets/icon/DomainProfilePictureEmptyState';

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
    isBlockedSection,
    isDomain
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

  const renderProfilePicture = () => {
    if (item.karmaScore) {
      return (
        <CircleGradient
          testId="images"
          fill={item.karmaScore}
          size={normalize(51)}
          width={normalize(3)}>
          <Image
            testId="images"
            source={{
              uri: item.image
            }}
            style={styles.profilepicture}
            width={48}
            height={48}
          />
        </CircleGradient>
      );
    }
    return (
      <Image
        testId="images"
        source={{
          uri: item.image
        }}
        style={styles.profilepicture}
        width={48}
        height={48}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="pressbody"
        onPress={() => onPressBody(item)}
        style={styles.wrapProfile}>
        <View style={styles.card} testID="images">
          {!isHashtag ? (
            <React.Fragment>
              {item.image && typeof item.image === 'string' && item.image.length > 0 ? (
                renderProfilePicture()
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

            {((!!item.user_id_follower && !!item.description) || isDomain) && (
              <Text
                testID="desc"
                style={item.isDomain ? styles.textProfileFullName : styles.domainDescription}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {item.description ? item.description : ''}
              </Text>
            )}
            {item.comumnityInfo?.length > 0 && !item.user_id_follower && item.isUser && (
              <View style={styles.communityTextContainer} testID="communityDesc">
                <Text style={styles.textProfileFullName} numberOfLines={1} ellipsizeMode="tail">
                  Also in{' '}
                  <Text style={styles.communityText}>
                    {`${item.comumnityInfo
                      .slice(0, 3)
                      .map((community) => `#${community}`)
                      .join(', ')}`}
                  </Text>
                </Text>
              </View>
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
  communityTextContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  communityText: {
    color: colors.primaryBlue,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    flexWrap: 'wrap',
    lineHeight: 18,
    marginTop: 4
  },
  buttonFollow: {
    width: normalize(65),
    height: normalize(34),
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
    borderRadius: 24,
    resizeMode: 'cover',
    borderColor: colors.lightgrey,
    borderWidth: 1,
    marginLeft: 2,
    marginTop: 2
  },
  wrapProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flex: 1
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
  },
  wrapTextProfileTopic: {
    flexDirection: 'column',
    flex: 1
  },
  textProfileUsername: {
    fontFamily: fonts.inter[500],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
    lineHeight: 16.94
  },
  textProfileFullName: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    flexWrap: 'wrap',
    lineHeight: 18,
    marginTop: 4
  },
  domainDescription: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    flexWrap: 'wrap',
    lineHeight: 18,
    marginTop: 4
  },
  buttonFollowing: {
    width: normalize(65),
    height: normalize(34),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8
  },
  card: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 20
  },
  followContainer: {
    paddingRight: normalize(20),
    paddingLeft: normalize(8),
    height: '100%',
    justifyContent: 'center'
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
