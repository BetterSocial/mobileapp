import React from 'react';

const useCalculationContentLink = () => {
  const [heightTopic, setHeightTopic] = React.useState(0);
  const [textHeight, setTextHeight] = React.useState(0);

  const handleTextHeight = ({nativeEvent}) => {
    if (nativeEvent?.layout?.height && textHeight <= 0) {
      setTextHeight(nativeEvent.layout.height);
    }
  };
  const handleTopicLayout = (nativeEvent) => {
    if (nativeEvent?.layout?.height && heightTopic <= 0) {
      setHeightTopic(nativeEvent.layout.height);
    }
  };

  return {
    handleTextHeight,
    handleTopicLayout,
    textHeight,
    heightTopic
  };
};

export default useCalculationContentLink;
