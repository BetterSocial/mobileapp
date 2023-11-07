import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import dimen from '../../utils/dimen';

export interface AnonymousChatInfoHeaderProps {
  title: string;
  onPress: () => void;
  titleStyle?: any;
  containerStyle?: any;
  isCenter?: boolean;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 50
    // padding: 10
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: colors.black,
    fontFamily: fonts.poppins[600],
    fontSize: 14,
    fontWeight: 'bold'
  },
  textIos: {
    color: colors.black,
    fontFamily: fonts.poppins[600],
    fontSize: 16,
    fontWeight: 'bold'
  },
  gap: {width: 20, height: 12},
  buttonBackContainer: {
    width: '100%'
  },
  buttonBackContainerIos: {
    width: '100%'
  },
  backPadding: {
    left: 0,
    position: 'absolute',
    zIndex: 1,
    height: dimen.normalizeDimen(50),
    width: dimen.normalizeDimen(50),
    justifyContent: 'center',
    alignItems: 'center'
  },
  flex: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: dimen.normalizeDimen(40)
  }
});

const AnonymousChatInfoHeader = ({
  title,
  onPress,
  titleStyle = {},
  containerStyle = {},
  isCenter
}: AnonymousChatInfoHeaderProps) => {
  const renderHeader = () => (
    <View style={styles.buttonBackContainerIos}>
      <View style={styles.content}>
        <TouchableOpacity testID="backButton" style={styles.backPadding} onPress={onPress}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <View style={styles.flex}>
          <Text
            numberOfLines={1}
            style={{
              ...styles.textIos,
              ...titleStyle,
              fontSize: 20,
              textAlign: isCenter ? 'center' : 'left'
            }}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{...styles.container, ...containerStyle}}>
      {renderHeader()}
      <View style={styles.gap} />
    </View>
  );
};

export default React.memo(AnonymousChatInfoHeader);
