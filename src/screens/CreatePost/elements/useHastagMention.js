import React from 'react';

import handleHastagMention from '../../../utils/hastag/hastagMention';

const useHastagMention = (initial = '') => {
    const [formattedText, setFormattedText] = React.useState(initial);
    const [hashtags, setHashtags] = React.useState([])

    const handleStateHashtag = (text, cursorPosition = -1) => {
        // handleHastagMention(text, setState, hashtags);
        setFormattedText(handleHastagMention(text, hashtags, cursorPosition))
    }

    const updateHashtag = (text, hashtagsProp) => {
        setHashtags(hashtagsProp)
        // handleHastagMention(text, setState, hashtags);
        setFormattedText(handleHastagMention(text, hashtagsProp))
    }

    const handleStateMention = (text) => {
        // handleHastagMention(text, setState, hashtags);
        setFormattedText(handleHastagMention(text, hashtags))
    }
    return {
        formattedText,
        handleStateHashtag,
        handleStateMention,
        setHashtags,
        updateHashtag
    }
}

export default useHastagMention
