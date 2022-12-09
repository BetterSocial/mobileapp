import React from 'react';

import handleHastagMention from '../../../utils/hastag/hastagMention';

const useHastagMention = (initial = '') => {
    const [formattedText, setFormattedText] = React.useState(initial);
    const [hashtags, setHashtags] = React.useState([])

    const handleStateHashtag = (text, setHashtagState = null, cursorPosition = -1) => {
        setFormattedText(handleHastagMention(text, hashtags, setHashtagState, cursorPosition))
    }

    const updateHashtag = (text, hashtagsProp, setHashtagState = null, cursorPosition = -1) => {
        setHashtags(hashtagsProp)
        setFormattedText(handleHastagMention(text, hashtagsProp, setHashtagState, cursorPosition))
    }

    const handleStateMention = (text) => {
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
