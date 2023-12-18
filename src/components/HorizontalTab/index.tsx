// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

import CustomPressable from '../CustomPressable';
import {COLORS} from '../../utils/theme';

const {width} = Dimensions.get('screen');

export type HorizontalTabProps = {
  selectedTab: number;
  onSelectedTabChange: (index: number) => void;
  tabs: React.ReactNode[];
};

const HorizontalTab = ({selectedTab, onSelectedTabChange, tabs = []}: HorizontalTabProps) => {
  const styles = StyleSheet.create({
    tabs: {
      width,
      borderBottomColor: COLORS.alto,
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.white,
      display: 'flex'
    },
    tabsFixed: {
      width,
      borderBottomColor: COLORS.alto,
      borderBottomWidth: 1,
      paddingLeft: 20,
      paddingRight: 20,
      flexDirection: 'row',
      position: 'absolute',
      top: 42,
      zIndex: 2000,
      backgroundColor: COLORS.white
    },
    tabItem: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      borderBottomColor: COLORS.holyTosca,
      opacity: 0.1
    },
    activeTabItem: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      borderBottomWidth: 2,
      opacity: 1
    },
    childTabContainer: {
      display: 'flex',
      maxWidth: width / tabs.length
      //   backgroundColor: COLORS.red
    }
  });

  return (
    <View style={styles.tabs}>
      {tabs.map((tab, index) => (
        <CustomPressable
          key={index?.toString()}
          onPress={() => onSelectedTabChange(index)}
          style={
            index === selectedTab
              ? [
                  styles.activeTabItem,
                  {borderBottomColor: index === 0 ? COLORS.blue : COLORS.holyTosca}
                ]
              : styles.tabItem
          }>
          <View style={styles.childTabContainer}>{tab}</View>
        </CustomPressable>
      ))}
    </View>
  );
};

export default HorizontalTab;
