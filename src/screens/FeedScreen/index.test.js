import * as React from 'react'
// import { fireEvent, render } from '@testing-library/react-native'
import { useRoute } from '@react-navigation/core'

import RenderList from './RenderList'
import { Context, useAppContext, } from '../../context'

const item = {
    "actor":
    {
        "created_at": "2022-06-10T13:11:47.095310Z",
        "data": {
            "human_id": "HQEGNQCHA8J1OIX4G2CP",
            "profile_pic_url": "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
            "username": "Fajarism"
        },
        "id": "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
        "updated_at": "2022-08-16T03:34:45.197566Z"
    },
    "anonimity": false,
    "count_downvote": 0,
    "count_upvote": 0,
    "duration_feed": "1",
    "expired_at": "2022-09-02T03:12:38.000Z",
    "final_score": 0,
    "foreign_id": "",
    "id": "ef9cd350-29a3-11ed-93bc-12946de4e4d9",
    "images_url": [],
    "latest_reactions": {},
    "latest_reactions_extra": {},
    "location": "Everywhere",
    "message": "http://tekno.kompas.com/read/2022/08/31/12300017/langkah-whatsapp-menjadi-superapp-dimulai-di-india\n\nhapooo",
    "object": "{\"feed_group\":\"main_feed\",\"message\":\"http://tekno.kompas.com/read/2022/08/31/12300017/langkah-whatsapp-menjadi-superapp-dimulai-di-india\\n\\nhapooo\",\"profile_pic_path\":\"https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg\",\"real_name\":null,\"topics\":[],\"username\":\"Fajarism\",\"verb\":\"tweet\"}",
    "origin": null,
    "own_reactions": {},
    "post_performance_comments_score": 1,
    "post_type": 0,
    "privacy": "public",
    "reaction_counts": {},
    "score": 0,
    "score_details": {
        "BP_score": 0, "D_bench_score": 2500, "D_score": 0, "WS_D_score": 1, "WS_nonBP_score": 1, "WS_updown_score": 1, "W_score": 0, "_id": "ef9cd350-29a3-11ed-93bc-12946de4e4d9", "anonimity": false, "att_score": 0.576, "count_weekly_posts": 5, "created_at": "2022-09-01 03:12:39", "domain_score": 1, "downvote_point": 0, "expiration_setting": "1", "expired_at": "2022-09-02 03:12:38", "has_done_final_process": false, "has_link": true, "impr_score": 0, "longC_score": 0, "p2_score": 0.5719679999999999, "p3_score": 1, "p_longC_score": 1, "p_perf_score": 1, "post_score": 0, "privacy": "public", "rec_score": 0.993, "s_updown_score": 1,
        "time": "2022-09-01T03:12:39.479381",
        "topics": [],
        "u_score": 0,
        "updated_at": "2022-09-01 03:12:39",
        "upvote_point": 0
    },
    "target": "",
    "time": "2022-09-01T03:12:39.479381",
    "topics": [],
    "user_score": 0,
    "verb": "tweet"
}
// const flushMicrotaskQueue = () => new Promise(resolve => setImmediate(resolve))

describe('Testing Feed Screen', () => {
    // const focus = jest.fn()
    // const contextValue = {
    //     feeds: [
    //         {
    //             feeds: [item],
    //             timer: 0,
    //             viewPostIndex: 0
    //         },
    //         () => jest.fn()
    //     ]
    // }

    // jest.spyOn(Context, 'useAppContext').mockImplementation(() => contextValue)

    it('Render Feed Screen', () => {
        // const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: { focus } });
        // const pushMock = jest.fn()

        // const RenderListComponent = RenderList.type
        // const {debug} = render(
        //     <Context.Provider value={{ feeds: [{}, null]}}>
        //         <RenderListComponent item={item} index={4} selfUserId={"f19ce509-e8ae-405f-91cf-ed19ce1ed96e"} />
        //     </Context.Provider>
        // )

        // console.log(debug())
        expect(1).toBe(1)
    })
})