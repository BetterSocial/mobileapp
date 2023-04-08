import * as React from 'react';
import {Dimensions, Keyboard, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {colors} from '../../../utils/colors';
import {fonts, normalizeFontSize} from '../../../utils/fonts';

const {width} = Dimensions.get('screen');

const DiscoveryTab = ({onChangeScreen, selectedScreen = 0}) => {
  const handleTabOnClicked = React.useCallback((index) => {
    Keyboard.dismiss();
    onChangeScreen(index);
  }, []);

  const tabs = ['Users', 'Communities', 'Domains', 'News'];
  return (
    <>
      <ScrollView
        horizontal={true}
        style={styles.tabContainer}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {tabs.map((item, index) => (
          <Pressable
            key={`tabItem-${item}`}
            android_ripple={{
              color: colors.gray1
            }}
            style={styles.tabItem(index)}
            onPress={() => handleTabOnClicked(index)}>
            <View style={styles.tabItemContainer}>
              <Text style={index === selectedScreen ? styles.tabItemTextFocus : styles.tabItemText}>
                {item}
              </Text>
              <View style={index === selectedScreen ? styles.underlineFocus : {}}></View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    height: 48,
    backgroundColor: colors.white
  },
  tabItem: (index) => ({
    flex: 1,
    width: width / 4,
    justifyContent: 'center',
    height: '100%',
    paddingLeft: index !== 1 ? 20 : 0
  }),
  tabItemContainer: {
    alignSelf: 'flex-start'
  },
  tabItemText: {
    color: colors.alto,
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(12.5),
    // lineHeight: 16.94,
    paddingVertical: 10,
    textAlign: 'left'
  },
  tabItemTextFocus: {
    color: colors.black,
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(12.5),
    lineHeight: 16.94,
    textAlign: 'left',
    paddingVertical: 10
  },
  underlineFocus: {
    borderBottomColor: colors.bondi_blue,
    borderBottomWidth: 2,
    top: 0,
    position: 'relative'
  }
});

export default DiscoveryTab;
