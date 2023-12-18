import * as RN from 'react-native';

export const Animated = {
  ...RN.Animated,
  parallel: () => ({
    // immediately invoke callback
    start: (cb: () => void) => cb()
  }),
  Easing: {
    ...RN.Easing,
    bezier: jest.fn()
  }
};
