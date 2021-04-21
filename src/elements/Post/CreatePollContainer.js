import React, { useState } from 'react'
import { StyleSheet, Switch, Text, TouchableOpacity, View, Button} from 'react-native'
import FlatListItem from '../../components/FlatListItem'
import { colors } from '../../utils/colors'
import PollItem from './PollItem'
import {MAX_POLLING_ALLOWED, MIN_POLLING_ALLOWED} from "../../helpers/constants"
import { color } from 'react-native-reanimated'
import MemoIc_arrow_right from '../../assets/icons/Ic_arrow_right'
import Modal from 'react-native-modal'
import Picker from '@gregfrench/react-native-wheel-picker'

export default function CreatePollContainer({
    onremoveallpoll = () => {},
    onaddpoll = () => {},
    onremovesinglepoll = (index) => {},
    onsinglepollchanged = (item, index) => {},
    ismultiplechoice = false,
    onmultiplechoicechanged = (ismultiple) => {},
    selectedtime = {day : 1, hour : 0, minute :0},
    ontimechanged = (timeobject) => {},
    polls
}){
    let PickerItem = Picker.Item
    let days = [...Array(14).keys()]
    let hour = [...Array(23).keys()]
    let minute = [...Array(59).keys()]

    let [isDurationModalShown, setIsDurationModalShown] = useState(false)

    const getDurationTimeText = () => {
        let dayText = selectedtime.day > 0 ? `${selectedtime.day} ${selectedtime.day > 1 ? "Days" : "Day"}` : ``
        let minuteText = selectedtime.minute > 0 ? `${selectedtime.minute} ${selectedtime.minute > 1 ? "Minutes" : "Minute"}` : ``
        let hourText = selectedtime.hour > 0 ? `${selectedtime.hour} ${selectedtime.hour > 1 ? "Hours" : "Hour"}` : ``

        return `${dayText} ${hourText} ${minuteText}`
    }

    return <View style={S.createpollcontainer}>
        {polls.map((item, index) => {
            return <PollItem index={index} 
                poll={item}
                showdeleteicon={polls.length > MIN_POLLING_ALLOWED}
                onremovepoll={(index) => onremovesinglepoll(index)}
                onpollchanged={(item) => {
                    onsinglepollchanged(item, index)
                }}/>
        })}

        { polls.length < MAX_POLLING_ALLOWED && <TouchableOpacity onPress={() => onaddpoll()} style={S.addpollitemcontainer}>
            <Text style={S.addpollitemtext}>+ Add Another Item</Text>
        </TouchableOpacity>}

        <View style={S.divider}/>

        <TouchableOpacity style={S.polldurationbutton} onPress={() => setIsDurationModalShown(true)}>
            <View style={S.row}>
                <Text style={S.fillparenttext}>Duration</Text>
                <Text style={S.polldurationbuttontext}>
                    {getDurationTimeText()}</Text>
                <MemoIc_arrow_right width={8} height={12} style={S.rightarrow}/>
            </View>
        </TouchableOpacity>

        <View style={S.divider}/>

        <View style={S.row}>
            <Text style={S.fillparenttext}>Multiple Choice</Text>
            <Text style={S.switchtext}>{ismultiplechoice ? "On" : "Off"}</Text>
            <Switch value={ismultiplechoice} onValueChange={(value) => onmultiplechoicechanged(value)}/>
        </View>

        <TouchableOpacity onPress={() => onremoveallpoll()} style={S.removepollcontainer}>
            <Text style={S.removepolltext}>Remove All Polls</Text>
        </TouchableOpacity>

        <Modal isVisible={isDurationModalShown} style={{flexDirection : 'column', display : 'flex', }}>
            <View style={S.modalrowcontainer}>
            <View style={S.pickercontainer}>
                <Text style={{alignSelf : 'center'}}>Day</Text>
                <Picker 
                    style={{width : '100%', height : 150}}
                    selectedIndex={selectedtime.day} 
                    selectedValue={selectedtime.day}
                    lineColor="#000000" //to set top and bottom line color (Without gradients)
                    lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                    lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                    itemStyle={{color:"black", fontSize:26}}
                    onValueChange={(value) => {
                        let selectedTime = {...selectedtime}
                        selectedTime.day = value
                        ontimechanged(selectedTime)
                    }}>
                    {days.map((item, index) => {
                        return <PickerItem label={`${item}`} value={index} key={index}/>
                    })}
                </Picker>
            </View>
            
            <View style={S.pickercontainer}>
                <Text style={{alignSelf : 'center'}}>Hour</Text>
                <Picker 
                    style={{width : '100%', height : 150}}
                    selectedIndex={selectedtime.hour} 
                    lineColor="#000000" //to set top and bottom line color (Without gradients)
                    lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                    lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                    itemStyle={{color:"black", fontSize:26}}
                    onValueChange={(value) => {
                        let selectedTime = {...selectedtime}
                        selectedTime.hour = value
                        ontimechanged(selectedTime)
                    }}>
                    {hour.map((item, index) => {
                        return <PickerItem label={`${item}`} value={index} key={index}/>
                    })}
                </Picker>
            </View>
            <View style={S.pickercontainer}>
                <Text style={{alignSelf : 'center'}}>Minute</Text>
                <Picker 
                    style={{width : '100%', height : 150}}
                    selectedIndex={selectedtime.minute} 
                    lineColor="#000000" //to set top and bottom line color (Without gradients)
                    lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                    lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                    itemStyle={{color:"black", fontSize:26}}
                    onValueChange={(value) => {
                        let selectedTime = {...selectedtime}
                        selectedTime.minute = value
                        ontimechanged(selectedTime)
                    }}>
                    {minute.map((item, index) => {
                        return <PickerItem label={`${item}`} value={index} key={index}/>
                    })}
                </Picker>
            </View>
            </View>

            <Button title="Select" onPress={() => setIsDurationModalShown(false)}/>
        </Modal>

    </View>
}

const S = StyleSheet.create({
    createpollcontainer : {
        borderWidth : 1,
        borderRadius : 4,
        borderColor : colors.gray1,
        flex : 1,
        display : 'flex',
        flexDirection : 'column',
        marginTop : 16,
        padding : 16
    },

    removepollcontainer : {
        display : 'flex',
        alignItems : 'center',
        marginTop : 16
    },

    addpollitemcontainer : {
        display : 'flex',
        alignItems : 'center',
        marginTop : 16,
        marginBottom : 8
    },

    addpollitemtext : {
        color : colors.black
    },

    removepolltext : {
        color : colors.red
    },

    divider : {
        flex : 1,
        width : '100%',
        height : 1,
        marginVertical : 8,
        backgroundColor : colors.gray1
    },

    row : {
        flexDirection : 'row',
        display : 'flex',
        paddingVertical : 8,
    },

    fillparenttext : {
        flex : 1,
        alignSelf : 'center'
    },
    
    rightarrow : {
        alignSelf : 'center'
    },

    polldurationbutton : {
        backgroundColor : colors.white,
        color : colors.white,
        paddingVertical : 4,
        borderRadius : 4,
    },

    polldurationbuttontext : {
        color : colors.white,
        backgroundColor : "green",
        paddingHorizontal : 16,
        paddingVertical : 8,
        borderRadius : 4,
        marginEnd : 16
    },

    switchtext : {
        alignSelf : 'center',
        marginRight : 16
    },

    modalrowcontainer : {
        backgroundColor : 'white', 
        flexDirection : 'row', 
        display : 'flex',
        maxHeight : 400,
        width : '100%',
        padding : 24
    },
    
    pickercontainer : {
        display : 'flex',
        flexDirection : 'column',
        flex : 1,
        alignSelf : 'center'
    }
})