import React from 'react'
import { View, Text, FlatList } from 'react-native'
import {getBlockedDomain} from '../../../../service/domain'

import BlockedList from '../RenderList'
import {getUserId} from '../../../../utils/users';
const BlockedDomainList = (props) => {
    const {navigation} = props
    const [listBlockedDomaun, setListBlockedDomain] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const userId = getUserId();

    const handleBlockDomain = async (data) => {
     
       }
    
       const handleUnblockDomain = async (data) => {
     
       }

       const handleFetchData = async () => {
        setIsLoading(true)
        const domainList = await getBlockedDomain()
        if(domainList.code === 200) {
            const mappingData = domainList.data.map((data) => ({ ...data, name: data.domain_name, image: data.logo, description: null}))
            setListBlockedDomain(mappingData)
            return setIsLoading(false)
        }
        return setIsLoading(false)
    }

    const handleTabbarName = () => {
        let title = "Domain"
        if(listBlockedDomaun.length === 1) {
          title += ` (${listBlockedDomaun.length})`
        }
        if(listBlockedDomaun.length > 1) {
          title = `Domains (${listBlockedDomaun.length})`
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
    }, [listBlockedDomaun])

    return (
        <FlatList 
        data={listBlockedDomaun}
        renderItem={({item ,index}) => <BlockedList handleSetBlock={() => handleBlockDomain(item)} handleSetUnblock={() => handleUnblockDomain(item)} onPressBody={() => goToDetailUser(item)} item={item} />}
        keyExtractor={(item, index) => index.toString()}
        refreshing={isLoading}
        onRefresh={handleFetchData}
        />
    )
}


export default BlockedDomainList