import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

import TopicMemberIcon from '../../../assets/images/topic-member-picture.png';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {convertString} from '../../../utils/string/StringUtils';
import {colors} from '../../../utils/colors';

const TopicDomainHeader = (props) => {
  const {handleOnMemberPress, hideSeeMember, isFollow, memberCount, topicDetail} = props;
  const handlePress = () => {
    if (isFollow) {
      handleOnMemberPress();
    } else {
      SimpleToast.show('Only community members can see other members', SimpleToast.SHORT);
    }
  };

  return (
    <View>
      <Text style={styles.domainText} numberOfLines={1} ellipsizeMode="tail">
        {`#${convertString(topicDetail?.name, ' ', '')}`}
      </Text>
      <Pressable onPress={handlePress} style={{backgroundColor: 'transparent'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image testID="imageTopicMember" source={TopicMemberIcon} style={styles.member} />
          <Text style={styles.domainMember}>{memberCount} Members</Text>
        </View>
        {isFollow && !hideSeeMember && (
          <Text style={styles.seeMemberText} numberOfLines={1} ellipsizeMode="tail">
            See community member
          </Text>
        )}
      </Pressable>
    </View>
  );
};

TopicDomainHeader.propTypes = {
  handleOnMemberPress: PropTypes.func,
  hideSeeMember: PropTypes.bool,
  isFollow: PropTypes.bool,
  memberCount: PropTypes.number,
  topicDetail: PropTypes.object
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
