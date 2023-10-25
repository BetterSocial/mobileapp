import * as React from 'react';
import {Dimensions, Keyboard, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {useRoute} from '@react-navigation/core';
import {colors} from '../../../utils/colors';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {setNavbarTitle} from '../../../context/actions/setMyProfileAction';
import {Context} from '../../../context';

const windowWidth = Dimensions.get('window').width;

const DiscoveryTab = ({onChangeScreen, selectedScreen = 0, tabs}) => {
  const [, dispatchNavbar] = React.useContext(Context).profile;
  const route = useRoute();

  const handleTabOnClicked = React.useCallback((index) => {
    Keyboard.dismiss();
    onChangeScreen(index);
  }, []);

  const handleChangeTitle = (index = 0) => {
    const title = ['Search users', 'Your Communities', 'Your Domains'][index] || '';
    setNavbarTitle(title, dispatchNavbar);
  };

  React.useEffect(() => {
    if (route.name === 'Followings') handleChangeTitle();
  }, []);

  return (
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
            android_ripple={{color: colors.gray1}}
            style={[
              styles.tabItem(route.name === 'Followings' ? 3 : 4),
              index === selectedScreen ? styles.underlineFocus : {}
            ]}
            onPress={() => {
              handleTabOnClicked(index);
              handleChangeTitle(index);
            }}>
            <View style={styles.tabItemContainer}>
              <Text style={index === selectedScreen ? styles.tabItemTextFocus : styles.tabItemText}>
                {`${item} ${route.name === 'Followings' ? `(${tabs[item]})` : ''}`}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    height: 48,
    backgroundColor: colors.white
  },
  tabItem: (tabs) => ({
    width: windowWidth / tabs,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }),
  tabItemContainer: {
    alignSelf: 'center'
  },
  tabItemText: {
    color: colors.alto,
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(12.5),
    paddingVertical: 10,
    textAlign: 'center'
  },
  tabItemTextFocus: {
    color: colors.black,
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(12.5),
    lineHeight: 16.94,
    textAlign: 'center',
    paddingVertical: 10
  },
  underlineFocus: {
    borderBottomColor: colors.bondi_blue,
    borderBottomWidth: 2
  }
});

export default DiscoveryTab;
