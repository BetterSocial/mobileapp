import React from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import MemoIconClose from './IconClose';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import dimen from '../../../utils/dimen';

const ContactPreview = ({users = [], onPress}) => {
  if (users.length < 1) {
    return null;
  }
  return (
    <ScrollView horizontal={true} style={styles.container}>
      {users.map((item) => {
        if (item) {
          return (
            <View
              key={item.user_id}
              style={{
                marginHorizontal: 15,
                width: 50
              }}>
              <View style={styles.tinyLogo}>
                <Image
                  style={styles.tinyLogo}
                  source={{
                    uri: item.profile_pic_path
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: -1,
                    right: -5
                  }}>
                  <Pressable onPress={() => onPress(item)}>
                    <MemoIconClose width={24} height={24} fill={COLORS.signed_primary} />
                  </Pressable>
                </View>
              </View>
              <Text numberOfLines={1} style={styles.username}>
                {item.username.length < 8
                  ? `${item.username}`
                  : `${item.username.substring(0, 8)}...`}
              </Text>
            </View>
          );
        }

        return <></>;
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: dimen.normalizeDimen(4),
    paddingTop: dimen.normalizeDimen(16),
    paddingBottom: dimen.normalizeDimen(8),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray210
  },
  tinyLogo: {
    width: 54,
    height: 54,
    borderRadius: 54
  },
  username: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 6,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.white
  }
});

export default ContactPreview;
