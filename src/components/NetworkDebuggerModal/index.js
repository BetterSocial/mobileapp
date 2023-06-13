import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';

import Modal from 'react-native-modal';
import NetworkLogger, {startNetworkLogging} from 'react-native-network-logger';
import {useRecoilValue} from 'recoil';
import {useUserWhitelist} from '../../hooks/useUserWhitelist';
import {ENV} from '../../libraries/Configs/ENVConfig';
import {debugAtom} from '../../service/debug';

const NetworkDebuggerModal = ({onPress}) => {
  const [isNetworkModalVisible, setIsNetworkVIsible] = useState(false);
  const isWhitelisted = useUserWhitelist();
  const isDebug = useRecoilValue(debugAtom);

  const onPressDebug = () => {
    if (onPress) {
      onPress();
    }
    setIsNetworkVIsible(true);
  };

  React.useEffect(() => {
    if ((isWhitelisted && isDebug) || ENV !== 'Prod') {
      startNetworkLogging({forceEnable: true});
    }
  }, [isWhitelisted, isDebug, ENV]);

  if ((isWhitelisted && isDebug) || ENV !== 'Prod') {
    return (
      <>
        <Modal
          style={styles.modal}
          isVisible={isNetworkModalVisible}
          onBackButtonPress={() => setIsNetworkVIsible(false)}
          backdropTransitionOutTiming={0}>
          <SafeAreaView style={styles.contentContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsNetworkVIsible(false)}>
              <Text style={styles.closeButtonTitle}>{'CLOSE'}</Text>
            </TouchableOpacity>
            <NetworkLogger />
          </SafeAreaView>
        </Modal>
        <TouchableOpacity style={styles.container} onPress={onPressDebug}>
          <Text style={styles.content}>{'Network Logs'}</Text>
        </TouchableOpacity>
      </>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    backgroundColor: 'white'
  },
  container: {
    width: 45,
    height: 45,
    position: 'absolute',
    left: 24,
    bottom: 64,
    borderRadius: 45,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    fontSize: 9,
    fontFamily: 'Gilroy-Bold',
    textAlign: 'center',
    color: 'white'
  },
  contentContainer: {
    flex: 1
  },
  closeButton: {
    paddingVertical: 16,
    borderBottomWidth: 1
  },
  closeButtonTitle: {
    textAlign: 'center'
  }
});

export default NetworkDebuggerModal;
