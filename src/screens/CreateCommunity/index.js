import * as React from 'react';
import _ from 'lodash';
import {
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';

import dimen from '../../utils/dimen';
import {Button} from '../../components/Button';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {Header} from '../../components';
import {Input} from '../../components/Input';
import {ProgressBar} from '../../components/ProgressBar';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {setCapitalFirstLetter} from '../../utils/Utils';
import {submitCommunityName, verifyCommunityName} from '../../service/topics';

const MAXIMUM_NAME_LENGTH = 64;
const MINIMUM_NAME_LENGTH = 3;

const CreateCommunity = () => {
  const navigation = useNavigation();
  const [users, dispatch] = React.useContext(Context).users;
  const [name, setName] = React.useState('');
  const [typeFetch, setTypeFetch] = React.useState('');
  const inputRef = React.useRef();

  const verifyNameDebounce = React.useCallback(
    _.debounce(async (text) => {
      if (text?.length < MINIMUM_NAME_LENGTH) return setTypeFetch('min');
      if (text?.length > MAXIMUM_NAME_LENGTH) return setTypeFetch('max');
      const result = await verifyCommunityName(text);
      if (!result.available) {
        return setTypeFetch('notavailable');
      }

      return setTypeFetch('available');
    }, 500),
    []
  );

  const checkName = async (v) => {
    verifyNameDebounce.cancel();
    const value = v.replace(/[^a-zA-Z0-9-_]/g, '');
    setTypeFetch('typing');
    setName(value);
    if (value.length <= MAXIMUM_NAME_LENGTH) {
      if (value.length >= MINIMUM_NAME_LENGTH) {
        if (!Number.isNaN(v)) {
          setTypeFetch('fetch');
          verifyNameDebounce(value);
        } else {
          setTypeFetch('nan');
        }
      } else {
        setTypeFetch('typing');
      }
    } else {
      setTypeFetch('max');
    }
  };

  const formatNameString = () => {
    if (name && typeof name === 'string') {
      let value = name.toLowerCase().replace(/[^a-z0-9-_]/g, '');
      value = setCapitalFirstLetter(value);
      return value;
    }
    return '';
  };

  const onTextBlur = () => {
    const value = formatNameString();
    setName(value);
  };

  React.useEffect(() => {
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 500);
    }
  }, []);

  // eslint-disable-next-line consistent-return
  const next = async () => {
    if (name && name.length >= MINIMUM_NAME_LENGTH && typeFetch === 'available') {
      const response = await submitCommunityName(name);
      if (response.success) {
        navigation.replace('ContactScreen', {
          isCreateCommunity: true,
          topicCommunityId: response.topic_id,
          topicCommunityName: name
        });
      }
    } else {
      if (!name) {
        return showMessage({
          message: 'Community name cannot be empty',
          type: 'danger',
          backgroundColor: COLORS.redalert
        });
      }

      if (name.length < MINIMUM_NAME_LENGTH) {
        return showMessage({
          message: 'Community name min. 3 characters',
          type: 'danger',
          backgroundColor: COLORS.redalert
        });
      }

      if (name.length > MAXIMUM_NAME_LENGTH) {
        return showMessage({
          message: 'Community name maximum 64 characters',
          type: 'danger',
          backgroundColor: COLORS.redalert
        });
      }

      if (typeFetch === 'notavailable') {
        return showMessage({
          message: 'A community with this name already exists',
          type: 'danger',
          backgroundColor: COLORS.redalert
        });
      }

      if (typeFetch === 'nan') {
        return showMessage({
          message: 'Community name cannot be just a number',
          type: 'danger',
          backgroundColor: COLORS.redalert
        });
      }
    }
  };

  const isNextButtonDisabled = () => {
    return typeFetch !== 'available';
  };

  const messageTypeFetch = (type, user) => {
    switch (type) {
      case 'fetch':
        return (
          <Text style={styles.textMessage(COLORS.gray410)}>{` ${'Checking availability'}`}</Text>
        );
      case 'available':
        return (
          <Text style={styles.textMessage(COLORS.signed_primary)}>
            {` ${'Community name available'}`}
          </Text>
        );
      case 'notavailable':
        return (
          <Text style={styles.textMessage(COLORS.redalert)}>
            {` ${'A community with this name already exists'}`}
          </Text>
        );
      case 'typing':
        return (
          <Text style={styles.textMessage(COLORS.redalert)}>
            {` ${'Community name min. 3 characters'}`}
          </Text>
        );
      case 'max':
        return (
          <Text style={styles.textMessage(COLORS.redalert)}>
            {` ${'Community name maximum 64 characters'}`}
          </Text>
        );
      case 'nan':
        return (
          <Text style={styles.textMessage(COLORS.redalert)}>
            {` ${'Community name cannot be just a number'}`}
          </Text>
        );
      default:
        return <Text />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} barStyle={'light-content'} />
      <Header
        title="Create Community"
        onPress={() => navigation.goBack()}
        titleStyle={{
          alignSelf: 'center'
        }}
        containerStyle={{
          borderBottomWidth: 1,
          borderBottomColor: COLORS.gray210
        }}
      />
      <View style={styles.keyboardavoidingview}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.content}>
            <ProgressBar isStatic={true} value={25} />
            <Text style={styles.title}>Name your new #community</Text>
            <Text style={styles.desc}>Make it easy it identify your community!</Text>
            <View style={styles.containerInput}>
              <View style={{flex: 1}}>
                <Input
                  ref={inputRef}
                  placeholder="Community name"
                  placeholderTextColor={COLORS.gray410}
                  onChangeText={checkName}
                  onBlur={onTextBlur}
                  value={name.length > 0 ? `#${name}` : name}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  autoFocus={false}
                />
                {messageTypeFetch(typeFetch, formatNameString())}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.gap} />
      </View>
      <View style={styles.footer}>
        <View style={styles.textSmallContainer}>
          <Text style={styles.textSmall}>
            You{"'"}ll appear as the first member of this community. You can switch your membership
            to incognito at any time from the community page.
          </Text>
        </View>
        <Button disabled={isNextButtonDisabled()} onPress={() => next()}>
          Next
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default CreateCommunity;

const styles = StyleSheet.create({
  containerInput: {
    flexDirection: 'row',
    marginTop: dimen.normalizeDimen(18),
    marginBottom: dimen.normalizeDimen(20)
  },
  input: {
    borderWidth: dimen.normalizeDimen(1),
    borderRadius: dimen.normalizeDimen(8),
    borderColor: COLORS.gray210,
    backgroundColor: COLORS.gray110,
    color: COLORS.white,
    paddingHorizontal: dimen.normalizeDimen(23),
    paddingVertical: dimen.normalizeDimen(13),
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  },
  btnNext: {marginTop: dimen.normalizeDimen(16)},
  gap: {flex: 1},
  icon: {
    width: dimen.normalizeDimen(14),
    height: dimen.normalizeDimen(14),
    position: 'absolute',
    bottom: dimen.normalizeDimen(-5),
    left: dimen.normalizeDimen(19)
  },
  image: {
    height: dimen.normalizeDimen(52),
    width: dimen.normalizeDimen(52),
    borderRadius: dimen.normalizeDimen(26)
  },
  title: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(16),
    color: COLORS.white,
    marginTop: dimen.normalizeDimen(24)
  },
  desc: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    color: COLORS.gray510,
    marginTop: dimen.normalizeDimen(6)
  },
  content: {
    paddingTop: dimen.normalizeDimen(20),
    paddingHorizontal: dimen.normalizeDimen(20)
  },
  keyboardavoidingview: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  textMessage: (color) => ({
    fontSize: normalizeFontSize(12),
    color,
    fontFamily: fonts.inter[400],
    marginTop: dimen.normalizeDimen(6)
  }),
  parentIcon: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  parentInfo: {
    width: '90%'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: dimen.normalizeDimen(112),
    width: '100%',
    paddingHorizontal: dimen.normalizeDimen(20),
    paddingBottom: dimen.normalizeDimen(20),
    backgroundColor: COLORS.almostBlack,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textSmallContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  textSmall: {
    fontSize: normalizeFontSize(10),
    fontFamily: fonts.inter[400],
    textAlign: 'center',
    color: COLORS.gray510
  }
});
