import * as React from 'react';
import PropTypes from 'prop-types';
import SimpleToast from 'react-native-simple-toast';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {convertString} from '../../../utils/string/StringUtils';
import {COLORS} from '../../../utils/theme';
import CommunityIcon from '../../../assets/icon/CommunityIcon';
import {Shimmer} from '../../../components/Shimmer/Shimmer';

const TopicDomainHeader = (props) => {
  const {domain, handleOnMemberPress, hideSeeMember, isFollow, memberCount} = props;

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
      <Text style={styles.domainText(shouldDisplay)} numberOfLines={1} ellipsizeMode="tail">
        {`#${convertString(domain, ' ', '')}`}
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: normalize(1)}}>
        <CommunityIcon
          color={shouldDisplay ? '#FFFFFF' : undefined}
          style={{
            marginRight: normalize(5),
            height: normalize(8)
          }}
        />
        {memberCount === undefined && props.isLoading ? (
          <Shimmer height={10} width={normalize(25)} />
        ) : (
          <Text style={styles.domainMember(shouldDisplay)}>{memberCount}</Text>
        )}
        <Text style={styles.domainMember(shouldDisplay)}> Members</Text>
      </View>
      {props?.initialData?.memberCount === undefined && props.isLoading ? (
        <Shimmer height={10} width={normalize(60)} />
      ) : (
        isFollow &&
        !hideSeeMember && (
          <Pressable onPress={handlePress} style={{backgroundColor: 'transparent'}}>
            <Text style={styles.seeMemberText} numberOfLines={1} ellipsizeMode="tail">
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
  isLoading: PropTypes.bool
};

const styles = StyleSheet.create({
  domainText: (isHeaderHide) => ({
    fontSize: normalizeFontSize(16),
    fontFamily: fonts.inter[600],
    textAlign: 'left',
    color: isHeaderHide ? COLORS.white : COLORS.black,
    backgroundColor: 'transparent'
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
    color: isHeaderHide ? COLORS.white : COLORS.blackgrey
  }),
  seeMemberText: {
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.inter[500],
    textAlign: 'left',
    color: COLORS.signed_primary
  }
});

export default TopicDomainHeader;
