import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

/**
 * 
 * @param {import('react-native-controlled-mentions').MentionSuggestionsProps} props 
 * @returns {React.FC}
 */
const MentionSuggestionsItem = (props) => {
    const { keyword, onSuggestionPress } = props
    const suggestions = [
        { id: '1', name: 'David Tabaka' },
        { id: '2', name: 'Mary' },
        { id: '3', name: 'Tony' },
        { id: '4', name: 'Mike' },
        { id: '5', name: 'Grey' },
    ];

    if (keyword === null) return null
    if (keyword?.length <= 1) return null

    return <View>
        {suggestions
            .filter(one => one?.name?.toLocaleLowerCase().includes(keyword?.toLocaleLowerCase()))
            .map(one => (
                <Pressable
                    key={one.id}
                    onPress={() => onSuggestionPress(one)}
                    style={{ padding: 12 }}
                >
                    <Text>{one.name}</Text>
                </Pressable>
            ))
        }
    </View>
}

export default MentionSuggestionsItem