import * as RN from 'react-native';

RN.Animated.timing = () => ({
    start: () => jest.fn()
})

module.exports = RN