import * as React from 'react';
import {View} from 'react-native';

const Gap = ({style, width, height}) => <View testID='gap' style={[{width, height}, style]} />;

export default Gap;
