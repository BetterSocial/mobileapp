import React from 'react';

import handleHastagMention from '../../../utils/hastag/hastagMention';

const useHastagMention = (initial = '') => {
    const [state, setState] = React.useState(initial);
    const [hashtags, setHashtags] = React.useState([])
    const handleStateHastag = (text) => {
        // handleHastagMention(text, setState, hashtags);
        setState(handleHastagMention(text, hashtags))
    }

    const handleStateMention = (text) => {
        // handleHastagMention(text, setState, hashtags);
        setState(handleHastagMention(text, hashtags))
    }
    return [
        state,
        handleStateHastag,
        handleStateMention,
        setHashtags
    ]
}

export default useHastagMention
