import React from 'react'
import {render, act, fireEvent} from '@testing-library/react-native'
import RenderList from "../../../src/screens/Followings/elements/RenderList"

 describe('Render follow should run correctly', () => {
    const item = {
              follow_action_id: "3a6c905d-5977-4de8-8864-1fcad5b47b18",
                user: {
                    country_code: "ID",
                    createdAt: "2022-06-16T15:28:24.000Z",
                    human_id: "P19FGPQGMSZ5VSHA0YSQ---archive",
                    last_active_at: "2022-06-16T15:28:23.000Z",
                    profile_pic_asset_id: null,
                    profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png",
                    profile_pic_public_id: null,
                    real_name: null,
                    status: "Y",
                    updatedAt: "2022-06-16T15:28:24.000Z",
                    user_id: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                    username: "Usupdev",
                },
                user_id_followed: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                user_id_follower: "c6c91b04-795c-404e-b012-ea28813a2006",
                image: 'https://image.jpg',
                isunfollowed: true,
                description: 'halo'      
    }

    const mockNoImage = {
             follow_action_id: "3a6c905d-5977-4de8-8864-1fcad5b47b18",
                user: {
                    country_code: "ID",
                    createdAt: "2022-06-16T15:28:24.000Z",
                    human_id: "P19FGPQGMSZ5VSHA0YSQ---archive",
                    last_active_at: "2022-06-16T15:28:23.000Z",
                    profile_pic_asset_id: null,
                    profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png",
                    profile_pic_public_id: null,
                    real_name: null,
                    status: "Y",
                    updatedAt: "2022-06-16T15:28:24.000Z",
                    user_id: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                    username: "Usupdev",
                },
                user_id_followed: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                user_id_follower: "c6c91b04-795c-404e-b012-ea28813a2006",
                image: null,
    
    }

    it('should match snapshot', () => {
        const onPressList = jest.fn()
        const onPressBody = jest.fn()
        const {toJSON} = render(<RenderList item={item} onPressBody={onPressBody} onPressList={onPressList} />)
        expect(toJSON).toMatchSnapshot()
    })

    it('pressbody should open pressbody function', () => {
         const onPressList = jest.fn()
        const onPressBody = jest.fn()
        const {getByTestId, getAllByTestId} = render(<RenderList item={item} onPressBody={onPressBody} onPressList={onPressList} />)
        act(() => {
            fireEvent.press(getByTestId('pressbody'))
        })
        expect(onPressBody).toHaveBeenCalled()
         expect(getAllByTestId('images')).toHaveLength(1)
        const {getAllByTestId: noItemImageId} = render(<RenderList item={mockNoImage} onPressBody={onPressBody} onPressList={onPressList} />)
        expect(noItemImageId('noimage')).toHaveLength(1)
    })

    it('name should show correctly', () => {
          const onPressList = jest.fn()
        const onPressBody = jest.fn()
        const {getByTestId} = render(<RenderList item={item} onPressBody={onPressBody} onPressList={onPressList} />)
        expect(getByTestId('name').props.children[1]).toEqual(item.name)
        const {getByTestId:hashtagId} = render(<RenderList item={item} isHashtag={true} onPressBody={onPressBody} onPressList={onPressList} />)
        expect(hashtagId('name').props.children[0]).toEqual(`#`)

    })

    it('Button Follow should correctly', async () => {
           const onPressList = jest.fn()
        const onPressBody = jest.fn()
        const handleSetUnfollow = jest.fn()
        const handleSetFollow = jest.fn()
        const {getAllByTestId, getByTestId} = render(<RenderList handleSetFollow={handleSetFollow} handleSetUnFollow={handleSetUnfollow} item={item} onPressBody={onPressBody} onPressList={onPressList} />)
        expect(getAllByTestId('isUnfollow')).toHaveLength(1)
        await fireEvent.press(getByTestId('isUnfollow'))
        expect(handleSetFollow).toHaveBeenCalled()
      
        expect(getByTestId('desc').props.children).toEqual(item.description)
    })

})