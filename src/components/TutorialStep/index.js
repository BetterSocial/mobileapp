import React from 'react';
import {View} from 'react-native';
import {CopilotStep} from 'react-native-copilot';

const CustomComponent = ({copilot, image, component}) => (
  <View image={image} {...copilot}>
    {component}
  </View>
);

const TutorialStep = ({text, order, name, active, image, children}) => {
  return (
    <CopilotStep text={text} order={order} name={name} active={active}>
      <CustomComponent image={image} component={children} />
    </CopilotStep>
  );
};

export default TutorialStep;
