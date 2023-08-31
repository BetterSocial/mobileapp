import React from 'react';
import {View} from 'react-native';
import {CopilotStep} from 'react-native-copilot';

const CustomComponent = ({copilot, buttonText, imageItem, component}) => (
  <View buttonText={buttonText} imageItem={imageItem} {...copilot}>
    {component}
  </View>
);

const TutorialStep = ({text, order, name, active, buttonText, imageItem, onPress, children}) => {
  return (
    <CopilotStep text={text} order={order} name={name} active={active}>
      <CustomComponent
        buttonText={buttonText}
        imageItem={imageItem}
        component={children}
        onPress={onPress}
      />
    </CopilotStep>
  );
};

export default TutorialStep;
