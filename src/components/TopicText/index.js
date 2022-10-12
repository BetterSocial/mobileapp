import * as React from 'react'
import { StyleSheet, Text } from 'react-native'

import { Context } from '../../context'
import { setTopicFeeds } from '../../context/actions/feeds'
import { fonts } from '../../utils/fonts'
import { COLORS } from '../../utils/theme'

const TopicText = ({ text, navigation = null, currentTopic = null }) => {
    const [, dispatch] = React.useContext(Context).feeds

    const onClick = () => {
        // Do navigation here
        if (!navigation || (currentTopic === text.replace('#', ''))) return
        navigation.push('TopicPageScreen', { id: text.replace('#', '') })
        setTopicFeeds([], dispatch)
    }

    return <Text testID='topicTextComponent' onPress={onClick} style={styles.text}>{text}</Text>
}

const styles = StyleSheet.create({
    text: {
        color: COLORS.blue,
        fontFamily: fonts.inter[500]
    }
})

export default TopicText