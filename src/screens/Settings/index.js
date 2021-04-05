import React from 'react';
import {
  StatusBar,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import ArrowLeftIcon from '../../assets/icons/images/arrow-left.svg';
import ChevronRightIcon from '../../assets/icons/images/chevron-right.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const width = Dimensions.get('screen').width;
const Settings = () => {
  const navigation = useNavigation();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.floatLeft}>
            <TouchableNativeFeedback onPress={() => navigation.goBack()}>
              <ArrowLeftIcon width={20} height={12} fill="#000" />
            </TouchableNativeFeedback>
          </View>
          <Text style={styles.textSettings}>Settings</Text>
        </View>
        <View style={styles.content}>
          <TouchableNativeFeedback>
            <View style={styles.card}>
              <Text style={styles.textCard}>Blocked list</Text>
              <ChevronRightIcon width={6.67} height={11.67} fill="#000" />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback>
            <View style={styles.card}>
              <Text style={styles.textCard}>Terms and Condition</Text>
              <ChevronRightIcon width={6.67} height={11.67} fill="#000" />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback>
            <View style={styles.card}>
              <Text style={styles.textCard}>Privacy Policy</Text>
              <ChevronRightIcon width={6.67} height={11.67} fill="#000" />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback>
            <View style={styles.card}>
              <Text style={styles.textCard}>Help Center</Text>
              <ChevronRightIcon width={6.67} height={11.67} fill="#000" />
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={styles.footer}>
          <Text style={styles.textVersion}>Version 1.1.0</Text>
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    paddingBottom: 16,
    paddingTop: 16,
    position: 'relative',
  },
  textSettings: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  floatLeft: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  content: {
    padding: 20,
    flexDirection: 'column',
  },
  card: {
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.wildSand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
    paddingBottom: 18,
    marginBottom: 12,
  },
  textCard: {
    fontFamily: fonts.inter[700],
    fontWeight: '800',
    fontSize: 14,
    color: colors.black,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textVersion: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.black,
  },
});
export default Settings;
