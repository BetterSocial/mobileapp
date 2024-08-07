import * as React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {COLORS} from '../../utils/theme';
import dimen from '../../utils/dimen';

const Loading = ({visible}) => {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={COLORS.gray510} />
        </View>
      </View>
    </Modal>
  );
};

export default withInteractionsManaged(React.memo(Loading));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: dimen.normalizeDimen(50),
    borderRadius: dimen.normalizeDimen(10)
  }
});
