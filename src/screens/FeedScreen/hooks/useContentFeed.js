import React from 'react'
import { Text } from 'react-native'
import reactStringReplace from "react-string-replace"
import { colors } from '../../../utils/colors'
import { getUserId } from '../../../utils/token'


const useContentFeed = ({navigation}) => {
      const matchPress = (match) => {
    if(match && match.includes('#')) {
      return navigation.push('TopicPageScreen', { id: match.replace('#', '') })
    }
    if(match && match.includes('@')) {
        getUserId().then(selfId => {
            navigation.push('OtherProfile', {
                data: {
                    user_id: selfId,
                    username: match.replace('@', ''),
                },
            })
        })
    }
  }

  const hashtagAtComponent = (message) => {
    const regex = /\B([#@][a-zA-Z0-9_+-]+\b)(?!;)/
    if(message && typeof message === 'string') {
      return (
        reactStringReplace(message, regex, (match) => {
         return (
          <Text onPress={() => matchPress(match)} testID='regex' style={{color:colors.blue}} >
            {match}
          </Text>
         )
        })
      )
    }
    return undefined
  }

  return {
    hashtagAtComponent,
    matchPress
  }

}


export default useContentFeed