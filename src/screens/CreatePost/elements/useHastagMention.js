import React from 'react';

import handleHastagMention from '../../../utils/hastag/hastagMention';

const useHastagMention = (initial = '') => {
  const [formattedText, setFormattedText] = React.useState(initial);
  const [hashtags, setHashtags] = React.useState([]);

  const handleStateHashtag = (text) => {
    const hashtagMention = handleHastagMention(text, hashtags);
    setFormattedText(hashtagMention);
  };

  const updateHashtag = (text, hashtagsProp) => {
    setHashtags(hashtagsProp);
    setFormattedText(handleHastagMention(text, hashtagsProp));
  };

  const handleStateMention = (text) => {
    setFormattedText(handleHastagMention(text, hashtags));
  };
  return {
    formattedText,
    handleStateHashtag,
    handleStateMention,
    setHashtags,
    updateHashtag
  };
};

export default useHastagMention;
