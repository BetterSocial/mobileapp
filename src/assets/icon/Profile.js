import jwtDecode from 'jwt-decode'
import React, { useContext, useEffect, useState } from 'react'
import { Image } from 'react-native'
import Store, { Context } from '../../context/Store'
import { getAccessToken } from '../../data/local/accessToken'
import { DEFAULT_PROFILE_PIC_PATH } from '../../helpers/constants'
import { getMyProfile } from '../../service/profile'
import { colors } from '../../utils/colors'


let ProfileIcon = ({uri}) => {
    let imageUri = uri ? uri : DEFAULT_PROFILE_PIC_PATH

    if(imageUri) return <Image key={`${imageUri}?time=${new Date().valueOf()}`} source={{
        uri : `${imageUri}?time=${new Date().valueOf()}`,
        cache : 'reload'
    }} width={19} height={19} style={{
        borderRadius : 19,
        width : 19,
        height : 19,
        borderWidth : 0.25,
        borderColor : colors.gray1
    }}/>

    return <></>
}

let MemoProfileIcon = React.memo(ProfileIcon)

export default MemoProfileIcon