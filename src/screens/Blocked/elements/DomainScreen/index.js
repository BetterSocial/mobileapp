import React from 'react'
import { View, Text, FlatList } from 'react-native'
import {getBlockedDomain} from '../../../../service/domain'

import BlockedList from '../RenderList'
import {getUserId} from '../../../../utils/users';
import { blockDomain, unblokDomain } from '../../../../service/blocking';
const BlockedDomainList = (props) => {
    const {navigation} = props
    const [listBlockedDomaun, setListBlockedDomain] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const userId = getUserId();

    const handleBlockDomain = async (data) => {
      // blockDomain(data)
      // console.log(data, 'data block')
      const dataBlock = {
        domainId: data.domain_page_id,
        reason: [],
        message: "",
        source: "block_page",
    };
      const processBlockDomain = await blockDomain(dataBlock)
      if(processBlockDomain.code === 200) {
        const mapping = listBlockedDomaun.map((domain) => {
          if(domain.domain_page_id === data.domain_page_id) {
            return {...domain, isUnblocked: false}
          } else {
            return {...domain}
          }
        })
        setListBlockedDomain(mapping)
      }
       }
    
       const handleUnblockDomain = async (data) => {
        const processUnblockDomain = await unblokDomain(data)
        if(processUnblockDomain.status) {
          const mapping = listBlockedDomaun.map((domain) => {
            if(domain.domain_page_id === data.domain_page_id) {
              return {...domain, isUnblocked: true}
            } else {
              return {...domain}
            }
          })
          setListBlockedDomain(mapping)
        }
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

    const goToDetailDomain = (data) => {
      navigation.navigate('DomainScreen', {
        item: {
          domain: {
            ...data
          },
          content: {
            ...data
          },
          og: {
            domain: data.name,
          },
        },
      });
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
        renderItem={({item ,index}) => <BlockedList handleSetBlock={() => handleBlockDomain(item)} handleSetUnblock={() => handleUnblockDomain(item)} onPressBody={() => goToDetailDomain(item)} item={item} />}
        keyExtractor={(item, index) => index.toString()}
        refreshing={isLoading}
        onRefresh={handleFetchData}
        />
    )
}


export default BlockedDomainList