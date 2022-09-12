import React from 'react'
import handleHastagMention from '../../../utils/hastag/hastagMention';

const useHastagMention = (initial = '') => {
    const [state, setState] = React.useState(initial);
    const handleStateHastag = (text) => {
        handleHastagMention(text, setState);
    }

    const handleStateMention = (text) => {
        handleHastagMention(text, setState);
    }
    return [
        state,
        handleStateHastag,
        handleStateMention,
    ]
}

export default useHastagMention
