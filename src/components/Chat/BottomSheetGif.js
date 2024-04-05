import * as React from 'react';
import PropsTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {debounce} from 'lodash';

import {fonts, normalizeFontSize} from '../../utils/fonts';
import {BottomSheet} from '../BottomSheet';
import MemoIcSearch from '../../assets/icons/Ic_search';
import dimen from '../../utils/dimen';
import IconClear from '../../assets/icon/IconClear';
import {getGifFeatured} from '../../service/gif';
import {COLORS} from '../../utils/theme';

const {height: heightScreen, width: widthScreen} = Dimensions.get('window');

const BottomSheetGif = React.forwardRef((props, ref) => {
  const {onCancel, onSelect} = props;
  const [searchText, setSearchText] = React.useState('');
  const [list, setList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const onLoad = async (search) => {
    setIsLoading(true);
    try {
      const result = await getGifFeatured(search);
      if (result.code === 200) {
        setList(result.data);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const searchGIF = React.useCallback(
    debounce((search) => {
      onLoad(search);
    }, 500),
    []
  );

  const handleChangeText = (text) => {
    setSearchText(text);
    if (text?.trim()?.length > 2) {
      searchGIF(text);
    }
  };

  const handleOnClearText = () => {
    setSearchText('');
    searchGIF('');
  };

  React.useEffect(() => {
    onLoad('');
  }, []);

  return (
    <BottomSheet
      ref={ref}
      closeOnPressMask={true}
      height={heightScreen - 75}
      viewstyle={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.wrapperSearch}>
          <View style={styles.wrapperIcon}>
            <MemoIcSearch width={16.67} height={16.67} fill={COLORS.gray310} />
          </View>
          <TextInput
            value={searchText}
            onChangeText={handleChangeText}
            multiline={false}
            returnKeyType="search"
            placeholder="Search"
            placeholderTextColor={COLORS.gray400}
            style={styles.input}
            keyboardAppearance="dark"
          />

          <TouchableOpacity
            delayPressIn={0}
            onPress={handleOnClearText}
            style={styles.clearIconContainer}
            android_ripple={{
              color: COLORS.gray1,
              borderless: true,
              radius: 35
            }}>
            <View style={styles.wrapperDeleteIcon}>
              <IconClear width={9} height={10} fill={COLORS.gray400} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.wrapperButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={list}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={index}
            style={{width: widthScreen / 2, height: widthScreen / 2}}
            onPress={() => onSelect(item.media_formats.gif.url, item.media_formats.tinygif.url)}>
            <FastImage
              source={{uri: item.media_formats.tinygif.url}}
              style={{width: '100%', height: '100%'}}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl tintColor={COLORS.white} refreshing={isLoading} onRefresh={onLoad} />
        }
        numColumns={2}
        ListFooterComponent={<View style={{height: 100}} />}
      />
    </BottomSheet>
  );
});
BottomSheetGif.displayName = 'BottomSheetGif';
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: dimen.normalizeDimen(10),
    paddingTop: 0,
    paddingBottom: 0
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: dimen.normalizeDimen(20),
    marginBottom: dimen.normalizeDimen(10)
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    borderRadius: dimen.normalizeDimen(12),
    alignSelf: 'center',
    flexDirection: 'row',
    height: dimen.normalizeDimen(36),
    paddingRight: dimen.normalizeDimen(8)
  },
  wrapperButton: {},
  input: {
    marginRight: dimen.normalizeDimen(16),
    paddingStart: dimen.normalizeDimen(8),
    flex: 1,
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    alignSelf: 'center',
    height: dimen.normalizeDimen(33),
    paddingTop: 0,
    paddingBottom: 0,
    color: COLORS.white
  },
  clearIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dimen.normalizeDimen(-20.5),
    paddingHorizontal: dimen.normalizeDimen(30),
    zIndex: 1000
  },
  wrapperDeleteIcon: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  wrapperIcon: {
    marginLeft: dimen.normalizeDimen(9.67),
    marginRight: dimen.normalizeDimen(1.67),
    alignSelf: 'center',
    justifyContent: 'center'
  },
  cancelText: {
    color: COLORS.signed_primary,
    marginLeft: dimen.normalizeDimen(12),
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    lineHeight: 14.52
  }
});

BottomSheetGif.propTypes = {
  onCancel: PropsTypes.func,
  onSelect: PropsTypes.func
};
export default BottomSheetGif;
