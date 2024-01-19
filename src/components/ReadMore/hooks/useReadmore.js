import React from 'react';

const useReadmore = ({numberLine}) => {
  const [isFinishSetLayout, setIsFinishSetLayout] = React.useState(false);
  const [realNumberLine, setRealNumberLine] = React.useState(0);
  const [textShown, setTextShown] = React.useState('');
  const [layoutWidth, setLayoutWidth] = React.useState(0);
  const [limitNumberLine, setLimitNumberLine] = React.useState(numberLine);

  const handleLayoutText = async ({nativeEvent}) => {
    let text = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numberLine; i += 1) {
      if (i === numberLine - 1) {
        const availableText = nativeEvent.lines[i]?.text;
        if (!availableText) return;
        let newText = `${nativeEvent.lines[i]?.text}`.replace(/\n/g, '');
        if (nativeEvent.lines[i]?.width >= layoutWidth * 0.8) {
          newText = newText.substring(10);
        }
        text += newText;
      } else {
        text += nativeEvent.lines[i]?.text;
      }
    }
    setTextShown(text);
    setRealNumberLine(nativeEvent.lines.length);
    setIsFinishSetLayout(true);
  };

  const handleLayoutWidth = ({nativeEvent}) => {
    setLayoutWidth(Math.floor(nativeEvent.layout.width));
  };

  return {
    handleLayoutText,
    handleLayoutWidth,
    setIsFinishSetLayout,
    setLayoutWidth,
    isFinishSetLayout,
    realNumberLine,
    textShown,
    layoutWidth,
    limitNumberLine,
    setLimitNumberLine,
    setRealNumberLine
  };
};

export default useReadmore;
