jest.mock('react-native-gesture-handler', () => {
  return {
    TouchableOpacity: 'TouchableOpacity'
  };
});
