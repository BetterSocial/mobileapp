import * as React from 'react';
import {Dimensions, Keyboard, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {useRoute} from '@react-navigation/core';
import PropTypes from 'prop-types';
import {colors} from '../../../utils/colors';
import {normalizeFontSize} from '../../../utils/fonts';
import {setNavbarTitle} from '../../../context/actions/setMyProfileAction';
import {Context} from '../../../context';
import dimen from '../../../utils/dimen';

const windowWidth = Dimensions.get('window').width;

const DiscoveryTab = ({onChangeScreen, selectedScreen = 0, tabs}) => {
  const [, dispatchNavbar] = React.useContext(Context).profile;
  const route = useRoute();

  const handleTabOnClicked = React.useCallback((index) => {
    Keyboard.dismiss();
    onChangeScreen(index);
  }, []);

  const handleChangeTitle = (index = 0) => {
    const title = ['Search Users', 'Your Communities', 'Your Domains'][index] || '';
    setNavbarTitle(title, dispatchNavbar);
  };

  React.useEffect(() => {
    if (route.name === 'Followings') handleChangeTitle();
  }, []);

  return (
    <View style={styles.tabContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        howsHorizontalScrollIndicator={false}
        horizontal={true}>
        {Object.keys(tabs).map((item, index) => {
          if (route.name === 'Followings' && item === 'News') return null;
          const totalItem = route.name === 'Followings' ? `(${tabs[item]})` : '';
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
                <Text
                  style={index === selectedScreen ? styles.tabItemTextFocus : styles.tabItemText}>
                  {`${item} ${totalItem}`}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    height: dimen.normalizeDimen(38),
    backgroundColor: colors.white
  },
  tabItem: (numTabs) => ({
    width: numTabs === 4 ? undefined : windowWidth / numTabs,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: numTabs === 4 ? 20 : undefined
  }),
  tabItemContainer: {
    alignSelf: 'center'
  },
  tabItemText: {
    color: colors.alto,
    fontWeight: '500',
    fontSize: normalizeFontSize(12.5),
    paddingVertical: 10,
    textAlign: 'center'
  },
  tabItemTextFocus: {
    color: colors.black,
    fontWeight: '500',
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

DiscoveryTab.propTypes = {
  onChangeScreen: PropTypes.func,
  selectedScreen: PropTypes.number,
  tabs: PropTypes.object
};

export default DiscoveryTab;
