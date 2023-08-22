import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useCopilot} from 'react-native-copilot';
import {TooltipStyle} from './TooltipStyle';

export const TutorialTooltip = ({labels}) => {
  const {goToNext, goToPrev, stop, currentStep, isFirstStep, isLastStep} = useCopilot();
  const imageItem =
    currentStep?.wrapperRef?.current?._internalFiberInstanceHandleDEV?.pendingProps?.image; // eslint-disable-line no-underscore-dangle

  const handleStop = () => {
    stop();
  };
  const handleNext = () => {
    goToNext();
  };

  const handlePrev = () => {
    goToPrev();
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
        {imageItem}
      </View>
      <View style={[TooltipStyle.bottomBar]}>
        {!isLastStep ? (
          <TouchableOpacity onPress={handleStop}>
            <Text style={TooltipStyle.buttonText}>{labels.skip}</Text>
          </TouchableOpacity>
        ) : null}
        {!isFirstStep ? (
          <TouchableOpacity onPress={handlePrev}>
            <Text style={TooltipStyle.buttonText}>{labels.previous}</Text>
          </TouchableOpacity>
        ) : null}
        {!isLastStep ? (
          <TouchableOpacity onPress={handleNext}>
            <Text style={TooltipStyle.buttonText}>{labels.next}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleStop}>
            <Text style={TooltipStyle.buttonText}>{labels.finish}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
