import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import dimen from '../../utils/dimen';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

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
    backgroundColor: COLORS.almostBlack,
    height: 50
    // padding: 10
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: COLORS.black,
    fontFamily: fonts.poppins[600],
    fontSize: 14,
    fontWeight: 'bold'
  },
  textIos: {
    color: COLORS.black,
    fontFamily: fonts.poppins[600],
    fontSize: 16,
    fontWeight: 'bold'
  },
  gap: {width: dimen.normalizeDimen(42)},
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
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center'
    // backgroundColor: 'blue'
  },
  flex: {
    alignItems: 'center',
    justifyContent: 'center',

    width: '100%'
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: dimen.normalizeDimen(55)
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
          <View style={styles.textContainer}>
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
    </View>
  );

  return <View style={{...styles.container, ...containerStyle}}>{renderHeader()}</View>;
};

export default React.memo(AnonymousChatInfoHeader);
