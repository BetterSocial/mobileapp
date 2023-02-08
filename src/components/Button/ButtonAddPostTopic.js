import * as React from 'react';

import BaseButtonAddPost from './BaseButtonAddPost';
import useBetterNavigationHook from '../../hooks/navigation/useBetterNavigationHook';

const ButtonAddPostTopic = ({ topicName }) => {
    const { toCreatePostWithTopic } = useBetterNavigationHook()

    const onAddPostPressed = () => {
        toCreatePostWithTopic(topicName)
    }

    return <BaseButtonAddPost onAddPostPressed={onAddPostPressed} testID="onaddtopicbutton" />
}

export default ButtonAddPostTopic