import React from 'react'
import { FlatList } from 'react-native'
import PropTypes from 'prop-types';
import {getBlockedUserList} from '../../../../service/users'
import BlockedList from '../RenderList'
import {getUserId} from '../../../../utils/users';
import { blockUser, unblockUserApi } from '../../../../service/blocking';

const BlockedUserList = (props) => {
    const {navigation} = props
    const [listBlockedUser, setListBlockedUser] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const userId = getUserId();

    const handleFetchData = async () => {
        setIsLoading(true)
        const userList = await getBlockedUserList()
        if(userList.success) {
            const mappingData = userList.data.map((data) => ({ ...data, name: data.user.username, image: data.user.profile_pic_path, description: null}))
            setListBlockedUser(mappingData)
            return setIsLoading(false)
        }
        return setIsLoading(false)
    }

    const goToDetailUser = (value) => {
        let data = {
            user_id: userId,
            other_id: value.user_id_followed,
            username: value.user.username,
          };
      
          navigation.navigate('OtherProfile', {data});
    }

   const handleBlockUser = async (data) => {
    const mappingData = listBlockedUser.map((blocked) => {
        if(blocked.user_id_blocked === data.user_id_blocked) {
            return {...blocked, isUnblocked: false }
        }
        return {...blocked} 
    })
    let dataSend = {
        userId: data.user_id_blocked,
        source: 'blocklist_screen',
      };
      const blockingUser = await blockUser(dataSend);
      if(blockingUser.code === 200) {
        setListBlockedUser(mappingData)
      }
   }

   const handleUnblockUser = async (data) => {
    const mappingData = listBlockedUser.map((blocked) => {
        if(blocked.user_id_blocked === data.user_id_blocked) {
            return {...blocked, isUnblocked: true }
        }
        return {...blocked} 
    })
    let dataSend = {
        userId: data.user_id_blocked,
        source: 'blocklist_screen',
      };
      const blockingUser = await unblockUserApi(dataSend);
      if(blockingUser.code === 200) {
        setListBlockedUser(mappingData)
      }
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
   }


    React.useEffect(() => {
        handleFetchData()
    }, [])

    React.useEffect(() => {
        handleTabbarName()
    }, [listBlockedUser])

    return (
        <FlatList 
        data={listBlockedUser}
        renderItem={({item ,index}) => <BlockedList handleSetBlock={() => handleBlockUser(item)} handleSetUnblock={() => handleUnblockUser(item)} onPressBody={() => goToDetailUser(item)} item={item} />}
        keyExtractor={(item, index) => index.toString()}
        refreshing={isLoading}
        onRefresh={handleFetchData}
        />
    )
}

BlockedUserList.propTypes = {
    navigation: PropTypes.object
}


export default BlockedUserList