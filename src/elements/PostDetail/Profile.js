import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconEn from 'react-native-vector-icons/Entypo';
import IconIon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
const Profile = () => {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.profile}>
        <Image
          source={require('../../assets/images/ProfileDefault.png')}
          style={styles.profileImage}
        />
        <View
          style={{
            marginLeft: 10,
            justifyContent: 'center',
          }}>
          <Text style={styles.username}>ayaka_kaminari</Text>
          <Text style={styles.desc}>
            35d ego . <IconIon name="globe-outline" />
            {' . '}
            <IconEn name="stopwatch" /> cambrid
          </Text>
        </View>
      </View>
      <TouchableOpacity>
        <IconEn name="dots-three-horizontal" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileImage: {
    height: 48,
    width: 48,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profile: {
    flexDirection: 'row',
  },
  username: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    color: '#000',
  },
  desc: {
    fontFamily: fonts.inter[400],
    fontSize: 13,
    color: colors.gray,
  },
});
