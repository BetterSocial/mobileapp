import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import GlobalButton from '../../../../components/Button/GlobalButton';

import {fonts} from '../../../../utils/fonts';
import {COLORS} from '../../../../utils/theme';

// data needed name, description, image
const styles = StyleSheet.create({
  buttonFollow: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    backgroundColor: COLORS.holyTosca,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textButtonFollowing: {
    fontSize: 12,
    color: COLORS.holyTosca,
    fontFamily: fonts.inter[600],
    fontWeight: 'bold'
  },
  textButtonFollow: {
    fontSize: 12,
    color: COLORS.white,
    fontFamily: fonts.inter[600],
    fontWeight: 'bold'
  },
  profilepicture: {
    width: 48,
    height: 48,
    borderColor: COLORS.lightgrey,
    borderRadius: 24,
    borderWidth: 1,
    // backgroundColor: COLORS.holyTosca,
    resizeMode: 'cover'
  },
  wrapProfile: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  imageProfile: {
    width: 48,
    height: 48,
    borderRadius: 48
  },
  wrapTextProfile: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 12
  },
  textProfileUsername: {
    fontFamily: fonts.inter[500],
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 16.94
  },
  textProfileFullName: {
    fontSize: 12,
    color: COLORS.gray8,
    fontFamily: fonts.inter[400],
    lineHeight: 18,
    flexWrap: 'wrap'
  },
  buttonFollowing: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.holyTosca,
    borderWidth: 1,
    borderRadius: 8
  },
  card: {
    height: 68,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10
  }
});

const DomainList = (props) => {
  const {item, isHashtag, handleSetFollow, handleSetUnFollow, onPressBody} = props;

  return (
    <View style={styles.card}>
      <GlobalButton onPress={() => onPressBody(item)} buttonStyle={styles.wrapProfile}>
        {!isHashtag ? (
          <React.Fragment>
            {item.image ? (
              <Image
                source={{
                  uri: item.image
                }}
                style={styles.profilepicture}
                width={48}
                height={48}
              />
            ) : (
              <View style={styles.profilepicture} />
            )}
          </React.Fragment>
        ) : null}

        <View style={styles.wrapTextProfile}>
          <Text style={styles.textProfileUsername}>
            {isHashtag && '#'}
            {item.name}
          </Text>
          <Text style={styles.textProfileFullName} numberOfLines={1} ellipsizeMode={'tail'}>
            {item.description ? item.description : ''}
          </Text>
        </View>
      </GlobalButton>
      {item.isunfollowed ? (
        <GlobalButton onPress={handleSetFollow}>
          <View style={styles.buttonFollow}>
            <Text style={styles.textButtonFollow}>{isHashtag ? 'Join' : 'Follow'}</Text>
          </View>
        </GlobalButton>
      ) : (
        <GlobalButton onPress={handleSetUnFollow}>
          <View style={styles.buttonFollowing}>
            <Text style={styles.textButtonFollowing}>{isHashtag ? 'Joined' : 'Following'}</Text>
          </View>
        </GlobalButton>
      )}
    </View>
  );
};

DomainList.propTypes = {
  item: PropTypes.object,
  isHashtag: PropTypes.bool,
  onPressBody: PropTypes.func,
  handleSetFollow: PropTypes.func,
  handleSetUnFollow: PropTypes.func
};

DomainList.defaultProps = {
  handleSetFollow: () => null,
  handleSetUnFollow: () => null,
  onPressBody: () => null
};

export default React.memo(DomainList);
