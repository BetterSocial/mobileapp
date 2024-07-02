import PropTypes from 'prop-types';
import * as React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import CommunityIcon from '../../../assets/icon/CommunityIcon';
import {Shimmer} from '../../../components/Shimmer/Shimmer';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {convertString} from '../../../utils/string/StringUtils';
import {COLORS} from '../../../utils/theme';

const TopicDomainHeader = (props) => {
  const {domain, handleOnMemberPress, hideSeeMember, isFollow, memberCount, followType, isPreview} =
    props;

  const handlePress = () => {
    if (isFollow) {
      handleOnMemberPress();
    } else {
      SimpleToast.show('Only community members can see other members', SimpleToast.SHORT);
    }
  };
  const shouldDisplay = !(props.topicDetail?.cover_path?.length > 0)
    ? false
    : props.hasSearch
    ? props.topicDetail?.cover_path?.length > 0
    : props.isHeaderHide;

  return (
    <View>
      <Text
        style={[
          styles.domainText(shouldDisplay),
          isPreview ? {fontSize: normalizeFontSize(12)} : {}
        ]}
        numberOfLines={1}
        ellipsizeMode="tail">
        {`#${convertString(domain, ' ', '')}`}
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: normalize(1)}}>
        <CommunityIcon
          color={shouldDisplay ? COLORS.white : undefined}
          style={{
            marginRight: normalize(5),
            height: normalize(8)
          }}
          width={isPreview ? 9 : 16}
          height={isPreview ? 9 : 16}
        />
        {memberCount === undefined && props.isLoading ? (
          <Shimmer height={10} width={normalize(25)} />
        ) : (
          <Text
            style={[
              styles.domainMember(shouldDisplay),
              isPreview ? {fontSize: normalizeFontSize(9)} : {}
            ]}>
            {memberCount}
          </Text>
        )}
        <Text
          style={[
            styles.domainMember(shouldDisplay),
            isPreview ? {fontSize: normalizeFontSize(9)} : {}
          ]}>
          {' '}
          Members
        </Text>
      </View>
      {props?.initialData?.memberCount === undefined && props.isLoading ? (
        <Shimmer height={10} width={normalize(60)} />
      ) : (
        isFollow &&
        !hideSeeMember && (
          <Pressable onPress={handlePress} style={{backgroundColor: COLORS.transparent}}>
            <Text
              style={[
                styles.seeMemberText(followType),
                isPreview ? {fontSize: normalizeFontSize(9)} : {}
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              See community members
            </Text>
          </Pressable>
        )
      )}
    </View>
  );
};

TopicDomainHeader.propTypes = {
  domain: PropTypes.string.isRequired,
  handleOnMemberPress: PropTypes.func,
  hideSeeMember: PropTypes.bool,
  isFollow: PropTypes.bool,
  memberCount: PropTypes.number,
  isLoading: PropTypes.bool,
  followType: PropTypes.string
};

const styles = StyleSheet.create({
  domainText: (isHeaderHide) => ({
    fontSize: normalizeFontSize(16),
    fontFamily: fonts.inter[600],
    textAlign: 'left',
    color: isHeaderHide ? COLORS.white : COLORS.black,
    backgroundColor: COLORS.transparent
  }),
  member: {
    width: normalize(16),
    height: normalize(16),
    marginRight: normalize(5)
  },
  domainMember: (isHeaderHide) => ({
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.inter[400],
    textAlign: 'left',
    color: isHeaderHide ? COLORS.white : COLORS.gray410
  }),
  seeMemberText: (followType) => ({
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.inter[500],
    textAlign: 'left',
    color: followType === 'incognito' ? COLORS.anon_primary : COLORS.blue,
    marginTop: normalize(1)
  })
});

export default TopicDomainHeader;
