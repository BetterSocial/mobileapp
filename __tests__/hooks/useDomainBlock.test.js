import {act, renderHook} from '@testing-library/react-hooks'
import useBlockedDomain from "../../src/screens/Blocked/elements/DomainScreen/hooks/useDomainBlock"
import * as serviceBlock from '../../src/service/blocking';
import * as serviceDomain from '../../src/service/domain'

describe('useDomain should run correctly', () => {

    const dataBlock = {
        created_at: "2023-01-17T09:33:06.000Z",
        credder_last_checked: "2022-11-15",
        credder_score: 54,
        description: null,
        domain_name: "newsweek.com",
        domain_page_id: "c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5",
        image: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
        logo: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
        name: "newsweek.com",
        short_description: "Newsweek provides in-depth analysis, news and opinion about international issues, technology, business, culture and politics.",
        updated_at: "2023-01-17T09:33:06.000Z",
        user_blocked_domain_id: "fc12f2da-f602-4383-9db6-3c8a962367fa",
        user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
    }

    const responseBlock = {
        code: 200,
        data: {
            action: "out",
            domain_page_id: "c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5",
            source: "block_page",
            user_blocked_domain_history_id: "190b878e-ab1b-4b6b-8c08-5badb026c11e",
            user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        },
        status: true
    }

    const dataBlocks = [
        {
            created_at: "2023-01-17T09:33:06.000Z",
            credder_last_checked: "2022-11-15",
            credder_score: 54,
            description: null,
            domain_name: "newsweek.com",
            domain_page_id: "c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5",
            image: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
            logo: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
            name: "newsweek.com",
            short_description: "Newsweek provides in-depth analysis, news and opinion about international issues, technology, business, culture and politics.",
            updated_at: "2023-01-17T09:33:06.000Z",
            user_blocked_domain_id: "fc12f2da-f602-4383-9db6-3c8a962367fa",
            user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        }, 
        {
            created_at: "2023-01-17T09:33:06.000Z",
            credder_last_checked: "2022-11-15",
            credder_score: 54,
            description: null,
            domain_name: "cnn.com",
            domain_page_id: "c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5",
            image: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
            logo: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
            name: "newsweek.com",
            short_description: "Newsweek provides in-depth analysis, news and opinion about international issues, technology, business, culture and politics.",
            updated_at: "2023-01-17T09:33:06.000Z",
            user_blocked_domain_id: "fc12f2da-f602-4383-9db6-3c8a962367fa",
            user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        }
    ]

    it('handleBlockDomain should run correctly', () => {
        const navigation = {
            setOptions: jest.fn()
        }
        const {result} = renderHook(() => useBlockedDomain({navigation}))
        const spyBlockDomain = jest.spyOn(serviceBlock, 'blockDomain')
        act(() => {
            result.current.handleBlockDomain(dataBlock)
        })
        expect(spyBlockDomain).toHaveBeenCalled()

    })

    it('handleResponseBlockDomain should update list domain', async () => {
         const navigation = {
            setOptions: jest.fn()
        }
        const {result} = renderHook(() => useBlockedDomain({navigation}))
        await result.current.setListBlockedDomain([dataBlock])
        await result.current.handleResponseBlockDomain(responseBlock, dataBlock)
        expect(result.current.listBlockedDomaun).toEqual([{
               created_at: "2023-01-17T09:33:06.000Z",
                credder_last_checked: "2022-11-15",
                credder_score: 54,
                description: null,
                domain_name: "newsweek.com",
                domain_page_id: "c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5",
                image: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
                isUnblocked: false,
                logo: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
                name: "newsweek.com",
                short_description: "Newsweek provides in-depth analysis, news and opinion about international issues, technology, business, culture and politics.",
                updated_at: "2023-01-17T09:33:06.000Z",
                user_blocked_domain_id: "fc12f2da-f602-4383-9db6-3c8a962367fa",
                user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        }])
    })

    it('mappingListBlock should run correctly', async () => {
        const navigation = {
            setOptions: jest.fn()
        }
        const data = {
            domain_page_id: 'c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5'
        }
        const data1 = {
            domain_page_id: 'f03ddf2e-ab4a-4d2d-90bd-862bac84dbc5'
        }
        const {result} = renderHook(() => useBlockedDomain({navigation}))
        await result.current.setListBlockedDomain([dataBlock])
        expect(result.current.mappingLisBlock(data,true)).toEqual([{
            created_at: "2023-01-17T09:33:06.000Z",
            credder_last_checked: "2022-11-15",
            credder_score: 54,
            description: null,
            domain_name: "newsweek.com",
            domain_page_id: "c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5",
            image: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
            isUnblocked: true,
            logo: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
            name: "newsweek.com",
            short_description: "Newsweek provides in-depth analysis, news and opinion about international issues, technology, business, culture and politics.",
            updated_at: "2023-01-17T09:33:06.000Z",
            user_blocked_domain_id: "fc12f2da-f602-4383-9db6-3c8a962367fa",
            user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        }])
        expect(result.current.mappingLisBlock(data,false)).toEqual([{
            created_at: "2023-01-17T09:33:06.000Z",
            credder_last_checked: "2022-11-15",
            credder_score: 54,
            description: null,
            domain_name: "newsweek.com",
            domain_page_id: "c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5",
            image: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
            isUnblocked: false,
            logo: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
            name: "newsweek.com",
            short_description: "Newsweek provides in-depth analysis, news and opinion about international issues, technology, business, culture and politics.",
            updated_at: "2023-01-17T09:33:06.000Z",
            user_blocked_domain_id: "fc12f2da-f602-4383-9db6-3c8a962367fa",
            user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        }])
        expect(result.current.mappingLisBlock(data1,true)).toEqual([{
            created_at: "2023-01-17T09:33:06.000Z",
            credder_last_checked: "2022-11-15",
            credder_score: 54,
            description: null,
            domain_name: "newsweek.com",
            domain_page_id: "c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5",
            image: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
            logo: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
            name: "newsweek.com",
            short_description: "Newsweek provides in-depth analysis, news and opinion about international issues, technology, business, culture and politics.",
            updated_at: "2023-01-17T09:33:06.000Z",
            user_blocked_domain_id: "fc12f2da-f602-4383-9db6-3c8a962367fa",
            user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        }])
       
    })

    it('handleUnblockDomain should run correctly', () => {
             const navigation = {
            setOptions: jest.fn()
        }
         const data = {
            domain_page_id: 'c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5'
        }
        const spyUnblock = jest.spyOn(serviceBlock, 'unblokDomain')
         const {result} = renderHook(() => useBlockedDomain({navigation}))
         act(() => {
            result.current.handleUnblockDomain(data)
         })
         expect(spyUnblock).toHaveBeenCalled()
    })

    it('handleResponseUnblockDomain should run correctly', async () => {
               const navigation = {
            setOptions: jest.fn()
        }
         const data = {
            domain_page_id: 'c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5'
        }
        const spyUnblock = jest.spyOn(serviceBlock, 'unblokDomain')
          const {result} = renderHook(() => useBlockedDomain({navigation}))
          await result.current.setListBlockedDomain([dataBlock])
          await result.current.handleResponseUnblock(responseBlock, data)
          expect(result.current.listBlockedDomaun).toEqual([
            {
                created_at: "2023-01-17T09:33:06.000Z",
                credder_last_checked: "2022-11-15",
                credder_score: 54,
                description: null,
                domain_name: "newsweek.com",
                domain_page_id: "c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5",
                image: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
                isUnblocked: true,
                logo: "https://d.newsweek.com/en/full/2048066/nato-reservists-voru.jpg",
                name: "newsweek.com",
                short_description: "Newsweek provides in-depth analysis, news and opinion about international issues, technology, business, culture and politics.",
                updated_at: "2023-01-17T09:33:06.000Z",
                user_blocked_domain_id: "fc12f2da-f602-4383-9db6-3c8a962367fa",
                user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
            }
          ])
    })

    it('handleFetchData should run correctly', () => {
        const navigation = {
            setOptions: jest.fn()
        }
        const data = {
            domain_page_id: 'c03ddf2e-ab4a-4d2d-90bd-862bac84dbc5'
        }
        const spyFetch = jest.spyOn(serviceDomain, 'getBlockedDomain')
        const {result} = renderHook(() => useBlockedDomain({navigation}))
        act(() => {
            result.current.handleFetchData()
        })
        expect(spyFetch).toHaveBeenCalled()

    })

    it('handleRespnseFetch should run correctly', () => {
        const navigation = {
            setOptions: jest.fn()
        }
        const response = {
            code: 200,
            data: [dataBlock]
        }
        const {result} = renderHook(() => useBlockedDomain({navigation}))
        act(() => {
            result.current.handleFetchResponse(response)
        })
        expect(result.current.listBlockedDomaun).toEqual([dataBlock])
    })

    it('handleTabBarname should run correctly', async () => {
         const navigation = {
            setOptions: jest.fn()
        }
        const {result} = renderHook(() => useBlockedDomain({navigation}))
        await result.current.handleTabbarName()
        await result.current.setListBlockedDomain([dataBlock])
        expect(result.current.handleTabbarName()).toEqual(`Domain (${[dataBlock].length})`)
        await result.current.setListBlockedDomain(dataBlocks)
        expect(result.current.handleTabbarName()).toEqual(`Domains (${dataBlocks.length})`)
        expect(navigation.setOptions).toHaveBeenCalled()

    })
})

//   const mappingLisBlock = (data, status) => {
//             const mapping = listBlockedDomaun.map((domain) => {
//             if(domain.domain_page_id === data.domain_page_id) {
//                 return {...domain, isUnblocked: status}
//             } 
//                 return {...domain}
                
//             })
//             return mapping
//         }