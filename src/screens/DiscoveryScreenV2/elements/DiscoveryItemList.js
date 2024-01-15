import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View} from 'react-native';
import {fonts} from '../../../utils/fonts';
import MemoDomainProfilePicture from '../../../assets/icon/DomainProfilePictureEmptyState';
import {COLORS} from '../../../utils/theme';
import ProfilePicture from '../../ProfileScreen/elements/ProfilePicture';

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
    isDomain,
    withKarma
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
    return (
      <ProfilePicture
        profilePicPath={item.image}
        karmaScore={item.karmaScore}
        size={51}
        width={3}
        withKarma={withKarma}
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
    color: COLORS.blueOnboarding,
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
    backgroundColor: COLORS.signed_primary
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
    color: COLORS.signed_primary
  },
  textButtonFollow: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: COLORS.white
  },
  profilepicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'cover',
    borderColor: COLORS.lightgrey,
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
    color: COLORS.black,
    lineHeight: 16.94
  },
  textProfileFullName: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.blackgrey,
    flexWrap: 'wrap',
    lineHeight: 18,
    marginTop: 4
  },
  domainDescription: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.blackgrey,
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
    borderColor: COLORS.signed_primary,
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
    borderColor: COLORS.signed_primary,
    borderWidth: 1
  },
  textButtonBlock: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: COLORS.white
  },
  textButtonBlockUser: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: COLORS.signed_primary
  },
  buttonBlock: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.redalert,
    borderRadius: 8,
    backgroundColor: COLORS.redalert
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
