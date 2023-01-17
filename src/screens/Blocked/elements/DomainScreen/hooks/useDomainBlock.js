
import React from 'react'
import { blockDomain, unblokDomain } from '../../../../../service/blocking'
import { getBlockedDomain } from '../../../../../service/domain'


const useDomainBlock = ({navigation}) => {
        const [listBlockedDomaun, setListBlockedDomain] = React.useState([])
        const [isLoading, setIsLoading] = React.useState(true)

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
            handleResponseBlockDomain(processBlockDomain, data)

        }

        const handleResponseBlockDomain = (processBlockDomain, data) => {
            if(processBlockDomain.code === 200) {
                const mapping = mappingLisBlock(data, false)
                setListBlockedDomain(mapping)
            }
        }

        const mappingLisBlock = (data, status) => {
            const mapping = listBlockedDomaun.map((domain) => {
            if(domain.domain_page_id === data.domain_page_id) {
                return {...domain, isUnblocked: status}
            } 
                return {...domain}
                
            })
            return mapping
        }

        const handleUnblockDomain = async (data) => {
        const processUnblockDomain = await unblokDomain(data)
        handleResponseUnblock(processUnblockDomain, data)
       }

       const handleResponseUnblock = (processUnblockDomain, data) => {
        if(processUnblockDomain.status) {
          const mapping = mappingLisBlock(data, true)
          setListBlockedDomain(mapping)
        }
       }

       const handleFetchData = async () => {
        setIsLoading(true)
        const domainList = await getBlockedDomain()
        handleFetchResponse(domainList)
      
    }

    const handleFetchResponse = (domainList) => {
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
        return title
       }

    return {
        listBlockedDomaun, 
        setListBlockedDomain,
        setIsLoading,
        isLoading,
        handleBlockDomain,
        handleUnblockDomain,
        handleFetchData,
        handleTabbarName,
        handleResponseBlockDomain ,
        mappingLisBlock,
        handleResponseUnblock,
        handleFetchResponse
    }

}


export default useDomainBlock