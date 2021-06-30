import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import MemoIc_search from '../../assets/icons/Ic_search';
import {fonts} from '../../utils/fonts';
import {COLORS, FONTS, SIZES} from '../../utils/theme';

const Search = ({onPress}) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapperSearch}>
        <TextInput
          multiline={false}
          placeholder={'Search News'}
          style={styles.input}
        />
        <View style={styles.wrapperIcon}>
          <MemoIc_search width={20} height={20} />
        </View>
      </View>
      {/* <TouchableOpacity style={styles.wrapperButton} onPress={onPress}>
        <Text style={{color: COLORS.holyTosca, ...FONTS.h3}}>New Post</Text>
        <View>
          <MemoIc_pencil height={18} width={18} />
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 46,
    backgroundColor: 'white',
    marginBottom: SIZES.base,
    marginHorizontal: SIZES.base,
  },
  wrapperSearch: {
    flex: 3,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 8,
    borderRadius: SIZES.radius,
  },
  wrapperButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginEnd: SIZES.base,
  },
  input: {
    marginHorizontal: 16,
    flex: 1,
    paddingStart: 20,
    fontFamily: fonts.inter[400],
  },
  wrapperIcon: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});

export default Search;
