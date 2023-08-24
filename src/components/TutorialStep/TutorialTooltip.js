import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useCopilot} from 'react-native-copilot';
import {TooltipStyle} from './TooltipStyle';

export const TutorialTooltip = () => {
  const {goToNext, stop, currentStep, isLastStep} = useCopilot();
  const imageItem =
    currentStep?.wrapperRef?.current?._internalFiberInstanceHandleDEV?.pendingProps?.imageItem; // eslint-disable-line no-underscore-dangle
  const buttonText =
    currentStep?.wrapperRef?.current?._internalFiberInstanceHandleDEV?.pendingProps?.buttonText; // eslint-disable-line no-underscore-dangle

  const handleStop = () => {
    stop();
  };
  const handleNext = () => {
    goToNext();
  };

  return (
    <View>
      <View style={TooltipStyle.tooltipContainer}>
        <Text testID="stepTitle" style={TooltipStyle.tooltipTitle}>
          {currentStep?.name}
        </Text>
        <Text testID="stepDescription" style={TooltipStyle.tooltipText}>
          {currentStep?.text}
        </Text>
        {imageItem ? <View style={{marginBottom: 8}}>{imageItem}</View> : null}
      </View>
      <View style={[TooltipStyle.bottomBar]}>
        {!isLastStep ? (
          <TouchableOpacity onPress={handleNext}>
            <Text style={TooltipStyle.buttonText}>{buttonText || 'Okay'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleStop}>
            <Text style={TooltipStyle.buttonText}>{buttonText || 'Okay'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
