import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import MemoIcClearCircle from '../../assets/icons/ic_clear_circle'
import MemoIcClose from '../../assets/icons/ic_close'
import { MAX_POLLING_CHARACTER_ALLOWED } from '../../helpers/constants'
import { colors } from '../../utils/colors'

export default function PollItem({
    index = 0,
    poll,
    onremovepoll = (index) => {},
    onpollchanged = (item, index) => {},
    showdeleteicon,
    showcharactercount = false
}) {
    let [isTextInputFocus, setIsTextInputFocus] = useState(false)

    return <View style={isTextInputFocus ? S.focuspollitemcontainer : S.pollitemcontainer}>
        <TextInput placeholder={`Choice ${index + 1}`} 
            style={S.pollitemtextinput}
            onFocus={() => setIsTextInputFocus(true)}
            onBlur={() => setIsTextInputFocus(false)}
            onChangeText={(value) => {
                if(value.length <= MAX_POLLING_CHARACTER_ALLOWED) return onpollchanged({text: value}, index)
            }}
            value={poll.text}/>
        { showcharactercount && <Text style={S.pollitemtextcount}>{`${poll.text.length}/${MAX_POLLING_CHARACTER_ALLOWED}`}</Text> }
        { showdeleteicon &&<TouchableOpacity style={S.removepollcontainer} onPress={() => onremovepoll(index)}>
            <MemoIcClearCircle width={20} height={20} style={S.removepollicon}/> 
        </TouchableOpacity>}
    </View>
}

const S = StyleSheet.create({
    pollitemcontainer : {
        display : 'flex',
        flexDirection : 'row',
        borderWidth : 1,
        borderColor : colors.gray1,
        borderRadius : 10,
        marginVertical : 4,
        paddingHorizontal : 8
    },

    focuspollitemcontainer : {
        display : 'flex',
        flexDirection : 'row',
        borderWidth : 1,
        borderRadius : 10,
        marginVertical : 4,
        paddingHorizontal : 8,
        borderColor : colors.holytosca
    },
    
    pollitemtextinput : {
        flex : 1
    },

    removepollcontainer : {
        justifyContent : 'center',
        paddingHorizontal : 8
    },

    removepollicon : {
        alignItems : 'center',
        justifyContent : 'center'
    },

    pollitemtextcount : {
        fontSize : 12,
        alignSelf : 'center',
        color : colors.gray1,
        marginEnd : 8,
        marginStart : 8
    }
})