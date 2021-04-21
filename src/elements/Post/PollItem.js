import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import MemoIcClose from '../../assets/icons/ic_close'
import { MAX_POLLING_CHARACTER_ALLOWED } from '../../helpers/constants'
import { colors } from '../../utils/colors'

export default function PollItem({
    index = 0,
    poll,
    onremovepoll = (index) => {},
    onpollchanged = (item, index) => {},
    showdeleteicon
}) {
    return <View style={S.pollitemcontainer}>
        <TextInput placeholder={`Choice ${index + 1}`} 
            style={S.pollitemtextinput}
            onChangeText={(value) => {
                if(value.length <= MAX_POLLING_CHARACTER_ALLOWED) return onpollchanged({text: value}, index)
            }}
            value={poll.text}/>
        <Text style={S.pollitemtextcount}>{`${poll.text.length}/${MAX_POLLING_CHARACTER_ALLOWED}`}</Text>
        { showdeleteicon &&<TouchableOpacity style={S.removepollcontainer} onPress={() => onremovepoll(index)}>
            <MemoIcClose style={S.removepollicon}/> 
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