import * as React from 'react';
import {Dimensions, Keyboard, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {useRoute} from '@react-navigation/core';
import {colors} from '../../../utils/colors';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {setNavbarTitle} from '../../../context/actions/setMyProfileAction';
import {Context} from '../../../context';

const {width} = Dimensions.get('screen');

const DiscoveryTab = ({onChangeScreen, selectedScreen = 0, tabs}) => {
  const route = useRoute();
  const [, dispatchNavbar] = React.useContext(Context).profile;
  const handleTabOnClicked = React.useCallback((index) => {
    Keyboard.dismiss();
    onChangeScreen(index);
  }, []);

  const changePlaceHolder = (index = 0) => {
    switch (index) {
      case 0:
        setNavbarTitle('Search users', dispatchNavbar);
        break;
      case 1:
        setNavbarTitle('Your Communities', dispatchNavbar);
        break;
      case 2:
        setNavbarTitle('Your Domains', dispatchNavbar);
        break;
      default:
    }
  };

  React.useEffect(() => {
    if (route.name === 'Followings') changePlaceHolder();
  }, []);

  return (
    <>
      <ScrollView
        horizontal={true}
        style={styles.tabContainer}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {Object.keys(tabs).map((item, index) => {
          if (route.name === 'Followings' && item === 'News') return null;
          return (
            <Pressable
              key={`tabItem-${item}`}
              android_ripple={{
                color: colors.gray1
              }}
              style={styles.tabItem(index)}
              onPress={() => {
                handleTabOnClicked(index);
                if (route.name === 'Followings') changePlaceHolder(index);
              }}>
              <View style={styles.tabItemContainer}>
                <Text
                  style={index === selectedScreen ? styles.tabItemTextFocus : styles.tabItemText}>
                  {`${item} ${route.name === 'Followings' ? `(${tabs[item]})` : ''}`}
                </Text>
                <View style={index === selectedScreen ? styles.underlineFocus : {}}></View>
              </View>
            </Pressable>
          );
        })}
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
    // width: width / 4 + 10,
    justifyContent: 'center',
    height: '100%',
    paddingLeft: 20
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
