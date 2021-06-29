import * as React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import CheckIcon from '../../../../assets/icons/check.svg';
import AddIcon from '../../../../assets/icons/add.svg';

const ItemUser = ({photo, username, bio, followed, onPress}) => {
  // console.log('render Item');
  return (
    <View style={styles.containerCard}>
      <View style={styles.cardLeft}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: photo,
            // uri: item.profile_pic_path,
          }}
        />
        <View style={styles.containerTextCard}>
          <Text style={styles.textFullName}>{username}</Text>
          <Text style={styles.textUsername}>{bio ? bio : ''}</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
        {followed ? (
          <TouchableOpacity
            onPress={onPress}
            style={styles.followAction(32, 32)}>
            <CheckIcon width={32} height={32} fill="#23C5B6" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onPress}
            style={styles.followAction(32, 32)}>
            <AddIcon width={20} height={20} fill="#000000" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default ItemUser;
const styles = StyleSheet.create({
  containerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 4,
    marginBottom: 8,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tinyLogo: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
  containerTextCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 8,
  },
  textFullName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
    lineHeight: 21,
    alignSelf: 'flex-start',
  },
  containerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followAction: (width, height) => ({
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  }),
});
