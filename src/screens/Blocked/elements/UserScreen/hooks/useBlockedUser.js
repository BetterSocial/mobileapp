
import React from 'react'
import { blockUser, unblockUserApi } from '../../../../../service/blocking';
import {getBlockedUserList} from '../../../../../service/users'
import {getUserId} from '../../../../../utils/users';

const useBlockedUser = ({navigation}) => {
     const [listBlockedUser, setListBlockedUser] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const userId = getUserId();

     const handleFetchData = async () => {
        setIsLoading(true)
        const userList = await getBlockedUserList()
        handleResponseFetchData(userList)
    }

    const handleResponseFetchData = (userList) => {
         if(userList.success) {
            const mappingData = userList.data.map((data) => ({ ...data, name: data.user.username, image: data.user.profile_pic_path, description: null}))
            setListBlockedUser(mappingData)
            return setIsLoading(false)
        }
        return setIsLoading(false)
    }

       const handleBlockUser = async (data) => {
        const mappingData = dataMap(data, false)
        const dataSend = {
            userId: data.user_id_blocked,
            source: 'blocklist_screen',
        };
        const blockingUser = await blockUser(dataSend);
        handleResponseBlockUser(blockingUser, mappingData)
   }


   const handleResponseBlockUser = (blockingUser, mappingData) => {
     if(blockingUser.code === 200) {
            setListBlockedUser(mappingData)
        }
   }

      const handleUnblockUser = async (data) => {
    const mappingData = dataMap(data, true)
    const dataSend = {
        userId: data.user_id_blocked,
        source: 'blocklist_screen',
      };
      setListBlockedUser(mappingData)

      await unblockUserApi(dataSend);
   }

   const dataMap = (data, status) => {
        const mappingData = listBlockedUser.map((blocked) => {
        if(blocked.user_id_blocked === data.user_id_blocked) {
            return {...blocked, isUnblocked: status}
        }
        return {...blocked} 
    })
    return mappingData
   }


   const handleTabbarName = () => {
        let title = "User"
        if(listBlockedUser.length === 1) {
        title += ` (${listBlockedUser.length})`
        }
        if(listBlockedUser.length > 1) {
        title = `Users (${listBlockedUser.length})`
        }
        navigation.setOptions({
        title,
        }); 
        return title
   }

   return {
    handleBlockUser,
    handleResponseBlockUser,
    handleUnblockUser,
    handleTabbarName,
    isLoading,
    userId,
    handleFetchData,
    listBlockedUser,
    setListBlockedUser,
    setIsLoading,
    handleResponseFetchData,
    dataMap
   }


}


export default useBlockedUser
