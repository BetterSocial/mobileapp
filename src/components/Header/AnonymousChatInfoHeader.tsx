import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

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
    backgroundColor: 'white'
    // padding: 10
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
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
    fontWeight: 'bold',
    marginRight: 15
  },
  gap: {width: 20, height: 12},
  buttonBackContainer: {
    width: '100%'
  },
  buttonBackContainerIos: {
    paddingVertical: 16,
    width: '100%'
  },
  backPadding: {
    paddingRight: 15,
    paddingVertical: 35,
    paddingLeft: 20,
    position: 'absolute',
    left: 0,
    alignSelf: 'center',
    zIndex: 10
  },
  flex: {
    flex: 1
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
