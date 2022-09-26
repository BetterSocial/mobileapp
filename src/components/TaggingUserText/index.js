import * as React from 'react'
import { StyleSheet, Text } from 'react-native'

import { COLORS } from '../../utils/theme'
import { fonts } from '../../utils/fonts'

const TaggingUserText = ({ text, navigation = null, currentTopic = null }) => {
    console.log(text);
    const onClick = () => {
        // Do navigation here
        if (!navigation || (currentTopic === text.replace('@', ''))) return
        navigation.push('OtherProfile', { id: text.replace('@', '') })
    }

    return <Text testID='TaggingUserTextComponent' onPress={onClick} style={styles.text}>{text}</Text>
}

const styles = StyleSheet.create({
    text: {
        color: COLORS.blue,
        fontFamily: fonts.inter[500]
    }
})

export default TaggingUserText