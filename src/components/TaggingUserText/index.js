import * as React from 'react'
import { StyleSheet, Text } from 'react-native'

import { COLORS } from '../../utils/theme'
import { fonts } from '../../utils/fonts'
import { getUserId } from '../../utils/token'

const TaggingUserText = ({ text, navigation = null, currentTopic = null, selfUserId = null, otherId = null }) => {
    console.log('username', text);
    const username = text.replace('@', '');


    const onClick = () => {
        // comment sebentar
        if (!navigation || (currentTopic === text.replace('@', ''))) return

        getUserId().then(selfId => {
            navigation.push('OtherProfile', {
                data: {
                    user_id: selfId,
                    other_id: otherId,
                    username,
                },
            })
        })

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