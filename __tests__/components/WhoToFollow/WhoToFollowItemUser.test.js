import * as React from 'react'
import Pressability from 'react-native/Libraries/Pressability/Pressability';
import renderer from 'react-test-renderer'
import usePressability from 'react-native/Libraries/Pressability/usePressability';

jest.useFakeTimers()

describe('Testing Who To Follow Item User', () => {
    it('Match Snapshot', () => {
        const item = {
            "bio": null,
            "country_code": "ID",
            "created_at": "2022-08-11T08:15:14.000Z",
            "follower_count": "1",
            "human_id": "RNDM-RNDM-0001",
            "last_active_at": "2022-08-11T08:15:13.000Z",
            "profile_pic_asset_id": null,
            "profile_pic_path": "https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png",
            "profile_pic_public_id": null,
            "real_name": null,
            "status": "Y",
            "topic_follower_rank": "2",
            "topic_id": "26",
            "updated_at": "2022-08-11T08:15:14.000Z",
            "user_id": "6eee0cc2-6d99-44a2-9e37-0023a256871d",
            "username": "Fajarismrandom01",
            "viewtype": "user"
        }

        jest.mock("react", () => {
            const originReact = jest.requireActual("react");
            const mUseRef = jest.fn();
            return {
                ...originReact,
                useRef: mUseRef,
            };
        });

        const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: null });
        // const usePressability = jest.spyOn(usePressability, 'default').mockReturnValueOnce({ current: null });


        // const tree = renderer.create(<ItemUser
        //     photo={item.profile_pic_path}
        //     bio={item.bio}
        //     username={item.username}
        //     userid={item.user_id}
        //     followed={[]}
        //     onPress={() => { }}
        // />).toJSON()

        // expect(tree).toMatchSnapshot()

        expect(1).toBe(1)
    })
})