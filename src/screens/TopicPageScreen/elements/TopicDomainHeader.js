import * as React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

import FastImage from 'react-native-fast-image';
import TopicMemberIcon from '../../../assets/images/topic-member-picture.png';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {convertString} from '../../../utils/string/StringUtils';
import {colors} from '../../../utils/colors';
import {Shimmer} from '../../../components/Shimmer/Shimmer';

const TopicDomainHeader = (props) => {
  const {domain, handleOnMemberPress, hideSeeMember, isFollow, memberCount} = props;
  const isUserFollow = props?.initialData?.isFollowing ? props.initialData.isFollowing : isFollow;

  console.log('props?.initialData?.memberCount', props?.initialData?.memberCount);

  const handlePress = () => {
    if (isUserFollow) {
      handleOnMemberPress();
    } else {
      SimpleToast.show('Only community members can see other members', SimpleToast.SHORT);
    }
  };
  return (
    <View>
      <Text style={styles.domainText} numberOfLines={1} ellipsizeMode="tail">
        {`#${convertString(domain, ' ', '')}`}
      </Text>
      <Pressable onPress={handlePress} style={{backgroundColor: 'transparent'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FastImage testID="imageTopicMember" source={TopicMemberIcon} style={styles.member} />
          {props?.initialData?.memberCount === undefined && props.isLoading ? (
            <Shimmer height={10} width={normalize(25)} />
          ) : (
            <Text style={styles.domainMember}>
              {props?.initialData?.memberCount || memberCount}
            </Text>
          )}
          <Text style={styles.domainMember}> Members</Text>
        </View>
        {props?.initialData?.memberCount === undefined && props.isLoading ? (
          <Shimmer height={10} width={normalize(60)} />
        ) : (
          isUserFollow &&
          !hideSeeMember && (
            <Text style={styles.seeMemberText} numberOfLines={1} ellipsizeMode="tail">
              See community member
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
  domainText: {
    fontSize: normalizeFontSize(16),
    fontFamily: fonts.inter[600],
    textAlign: 'left',
    color: colors.black,
    backgroundColor: 'transparent'
  },
  member: {
    width: normalize(16),
    height: normalize(16),
    marginRight: normalize(5)
  },
  domainMember: {
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.inter[400],
    textAlign: 'left',
    color: colors.blackgrey
  },
  seeMemberText: {
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.inter[500],
    textAlign: 'left',
    color: colors.blue1
  }
});

export default TopicDomainHeader;
