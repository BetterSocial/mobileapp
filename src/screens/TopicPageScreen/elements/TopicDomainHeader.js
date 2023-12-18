import PropTypes from 'prop-types';
import * as React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import CommunityIcon from '../../../assets/icon/CommunityIcon';
import {Shimmer} from '../../../components/Shimmer/Shimmer';
import {colors} from '../../../utils/colors';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {convertString} from '../../../utils/string/StringUtils';
import {COLORS} from '../../../utils/theme';

const TopicDomainHeader = (props) => {
  const {domain, handleOnMemberPress, hideSeeMember, isFollow, memberCount} = props;
  const isUserFollow = props?.initialData?.isFollowing ? props.initialData.isFollowing : isFollow;

  const handlePress = () => {
    if (isUserFollow) {
      handleOnMemberPress();
    } else {
      SimpleToast.show('Only community members can see other members', SimpleToast.SHORT);
    }
  };
  return (
    <View
      style={{
        alignContent: 'flex-start',
        alignItems: 'flex-start'
      }}>
      <Text
        style={styles.domainText(props.isHeaderHide || props.hasSearch)}
        numberOfLines={1}
        ellipsizeMode="tail">
        {`#${convertString(domain, ' ', '')}`}
      </Text>
      <Pressable onPress={handlePress} style={{backgroundColor: 'transparent'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: normalize(1)}}>
          <CommunityIcon
            color={props.isHeaderHide || props.hasSearch ? '#FFFFFF' : undefined}
            style={{
              marginRight: normalize(5),
              height: normalize(8)
            }}
          />
          {props?.initialData?.memberCount === undefined && props.isLoading ? (
            <Shimmer height={10} width={normalize(25)} />
          ) : (
            <Text style={styles.domainMember(props.isHeaderHide || props.hasSearch)}>
              {props?.initialData?.memberCount || memberCount}
            </Text>
          )}
          <Text style={styles.domainMember(props.isHeaderHide || props.hasSearch)}> Members</Text>
        </View>
        {props?.initialData?.memberCount === undefined && props.isLoading ? (
          <Shimmer height={10} width={normalize(60)} />
        ) : (
          isUserFollow &&
          !hideSeeMember && (
            <Text
              style={styles.seeMemberText(props.isHeaderHide)}
              numberOfLines={1}
              ellipsizeMode="tail">
              See community members
            </Text>
          )
        )}
      </Pressable>
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
  seeMemberText: () => ({
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.inter[500],
    textAlign: 'left',
    color: COLORS.blue,
    marginTop: normalize(1)
  })
});

export default TopicDomainHeader;
