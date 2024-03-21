import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import IconCheckCircleOutline from '../../../assets/icon/IconCheckCircleOutline';
import IconIncognito from '../../../assets/icon/IconIncognito';
import dimen from '../../../utils/dimen';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import ProfilePicture from '../../ProfileScreen/elements/ProfilePicture';

type UserItemProps = {
  type: 'signed' | 'incognito';
  username: string;
  profilePicture: string;
  isFollowing: boolean;
  onPress?: () => void;
};

const UserItem = ({type, username, profilePicture, isFollowing, onPress}: UserItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: dimen.normalizeDimen(14),
        paddingHorizontal: dimen.normalizeDimen(20),
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 1
      }}>
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <View
            style={{
              marginRight: 8
            }}>
            {type === 'signed' ? (
              <ProfilePicture
                size={20}
                width={0}
                profilePicPath={profilePicture}
                anonBackgroundColor=""
                anonEmojiCode=""
              />
            ) : (
              <IconIncognito color={COLORS.white} />
            )}
          </View>
          <Text
            style={{
              fontFamily: fonts.inter[400],
              fontSize: 14,
              color: COLORS.black
            }}>
            {type === 'signed' ? `as @${username}` : 'Incognito'}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fonts.inter[400],
            fontSize: 12,
            color: COLORS.blackgrey,
            marginTop: 4,
            lineHeight: 18
          }}>
          {type === 'signed'
            ? 'You’ll be visible as a community member.'
            : 'You’ll be a hidden member of the community.'}
        </Text>
      </View>
      {isFollowing && (
        <IconCheckCircleOutline
          color={type === 'signed' ? COLORS.signed_primary : COLORS.anon_primary}
        />
      )}
    </TouchableOpacity>
  );
};

export default UserItem;
