import * as React from 'react';
import { useNavigation } from '@react-navigation/core';

import BaseButtonAddPost from './BaseButtonAddPost';

const ButtonAddPostTopic = () => {
    const navigation = useNavigation()

    const onAddPostPressed = () => {
        navigation.navigate('CreatePost')
    }

    return <BaseButtonAddPost onAddPostPressed={onAddPostPressed} testID="onaddtopicbutton"/>
}

export default ButtonAddPostTopic