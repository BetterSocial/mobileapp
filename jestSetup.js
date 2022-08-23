import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({
    adapter: new Adapter(),
});

// Auto-mock YellowBox component.
// jest.mock('YellowBox');

const mockConsoleMethod = (realConsoleMethod) => {
    const ignoredMessages = ['test was not wrapped in act(...)'];

    return (message, ...args) => {
        const containsIgnoredMessage = ignoredMessages.some((ignoredMessage) =>
            message.includes(ignoredMessage),
        );

        if (!containsIgnoredMessage) {
            realConsoleMethod(message, ...args);
        }
    };
};

// Suppress console errors and warnings to avoid polluting output in tests.
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
// jest.mock('NativeAnimatedHelp');
console.warn = jest.fn(mockConsoleMethod(console.warn));
console.error = jest.fn(mockConsoleMethod(console.error));
