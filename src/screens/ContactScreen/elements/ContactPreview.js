import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import SeeMore from 'react-native-see-more-inline';
import {SIZES} from '../../../utils/theme';
import MemoIconClose from './IconClose';

const ContactPreview = ({users = [], onPress}) => {
  if (users.length < 1) {
    return null;
  }
  return (
    <ScrollView
      horizontal={true}
      style={{
        paddingHorizontal: 4,
        paddingVertical: 20,
      }}>
      {users.map((item, index) => {
        if (item) {
          return (
            <View
              key={item.user_id}
              style={{
                marginHorizontal: 15,
                width: 50,
              }}>
              <View style={styles.tinyLogo}>
                <Image
                  style={styles.tinyLogo}
                  source={{
                    uri: item.profile_pic_path,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: -1,
                    right: -5,
                  }}>
                  <Pressable onPress={() => onPress(item)}>
                    <MemoIconClose width={24} height={24} />
                  </Pressable>
                </View>
              </View>
              <Text
                numberOfLines={1}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: 6,
                }}>
                {item.username.length < 8
                  ? `${item.username}`
                  : `${item.username.substring(0, 8)}...`}
              </Text>
            </View>
          );
        }
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tinyLogo: {
    width: 54,
    height: 54,
    borderRadius: 54,
  },
});

export default ContactPreview;
