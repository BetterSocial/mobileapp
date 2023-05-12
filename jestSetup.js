import Adapter from 'enzyme-adapter-react-16';
import {configure} from 'enzyme';

configure({
  adapter: new Adapter()
});

// Auto-mock YellowBox component.
// jest.mock('YellowBox');

const mockConsoleMethod = (realConsoleMethod) => {
  const ignoredMessages = ['test was not wrapped in act(...)'];

  return (message, ...args) => {
    const containsIgnoredMessage = ignoredMessages.some((ignoredMessage) =>
      message.includes(ignoredMessage)
    );

    if (!containsIgnoredMessage) {
      realConsoleMethod(message, ...args);
    }
  };
};

// Suppress console errors and warnings to avoid polluting output in tests.
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn().mockReturnValue(0),
  useAnimatedStyle: jest.fn().mockReturnValue({}),
  useAnimatedScrollHandler: jest.fn().mockReturnValue({}),
  createAnimatedComponent: (component) => jest.fn().mockReturnValue(component),
  __reanimatedWorkletInit: jest.fn(),
  ScrollView: 'ScrollView',
  Extrapolate: jest.fn().mockReturnValue('clamp')
}));

global.__reanimatedWorkletInit = jest.fn();
console.warn = jest.fn(mockConsoleMethod(console.warn));
console.error = jest.fn(mockConsoleMethod(console.error));
