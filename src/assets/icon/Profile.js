import React, { useContext } from 'react'
import { Image } from 'react-native'
import Store, { Context } from '../../context/Store'
import { DEFAULT_PROFILE_PIC_PATH } from '../../helpers/constants'
import { colors } from '../../utils/colors'


let ProfileIcon = ({}) => {
    let context = useContext(Context)
    let [users, dispatch] = context.users
    let imageUri = users.photo ? users.photo : DEFAULT_PROFILE_PIC_PATH

    return <Image key={imageUri} source={{
        uri : imageUri
    }} width={19} height={19} style={{
        borderRadius : 19,
        width : 19,
        height : 19,
        borderWidth : 0.25,
        borderColor : colors.gray1
    }}/>
}

export default ProfileIcon