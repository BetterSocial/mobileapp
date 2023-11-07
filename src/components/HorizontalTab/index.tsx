import * as React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

import CustomPressable from '../CustomPressable';
import {colors} from '../../utils/colors';

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
      borderBottomColor: colors.alto,
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      display: 'flex'
    },
    tabsFixed: {
      width,
      borderBottomColor: colors.alto,
      borderBottomWidth: 1,
      paddingLeft: 20,
      paddingRight: 20,
      flexDirection: 'row',
      position: 'absolute',
      top: 42,
      zIndex: 2000,
      backgroundColor: colors.white
    },
    tabItem: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      borderBottomColor: colors.bondi_blue,
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
      //   backgroundColor: colors.red
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
                  {borderBottomColor: index === 0 ? colors.darkBlue : colors.black}
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
