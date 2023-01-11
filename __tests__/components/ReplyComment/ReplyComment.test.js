import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';

import ReplyComment, {styles, ContainerReply} from '../../../src/components/ReplyComment'
import Store from '../../../src/context/Store';
import * as CommentService  from '../../../src/service/comment';
import  useReplyComment from '../../../src/components/ReplyComment/hooks/useReplyComment'
import * as replyFunc from '../../../src/components/ReplyComment/hooks/useReplyComment'

jest.mock('react-native/Libraries/Pressability/usePressability')
jest.mock('react-native/Libraries/Components/Pressable/Pressable')
const mockGoBack = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: mockGoBack, push: jest.fn() }),
  useRoute: () => ({
    params: {}
  }),
}));

jest.mock('../../../src/components/ReplyComment/hooks/useReplyComment', () => {
  const original = jest. requireActual('../../../src/components/ReplyComment/hooks/useReplyComment')
  return {
     __esModule: true,
     default: jest.fn(original.default)
  }
})


describe('Reply comment should run correctly', () => {

    const itemProp = {
        activity_id: "ca556c7a-8aaf-11ed-bb93-12946de4e4d9",
        children_counts: {},
        created_at: "2023-01-06T00:59:32.534991Z",
        data: {
            count_downvote: 0,
            count_upvote: 0,
            isNotSeen: true,
            text: "Hi",
        },
        id: "e78e2b3a-718a-48eb-bef5-b4ffd0701d4d",
        kind: "comment",
        latest_children: {},
        parent: "eb8aaa17-5853-4d1a-9b56-f22794dd1bae",
        updated_at: "2023-01-06T00:59:32.534991Z",
        user: {
            created_at: "2022-06-10T13:11:53.385703Z",
            data: {
                human_id: "I4K3M10FGR78EWQQDNQ2",
                profile_pic_url: "https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg",
                username: "Agita",
            },
            id: "c6c91b04-795c-404e-b012-ea28813a2006",
            updated_at: "2022-07-29T12:54:03.879150Z"
        },
        user_id: "c6c91b04-795c-404e-b012-ea28813a2006"
    }
    const indexFeed = 0
    const level = 1
    const page ='PostDetailPage'
    const itemParent = undefined
    afterEach(cleanup)
    it('should match snapshot', () => {
        const {toJSON} = render(<ReplyComment itemProp={itemProp} itemParent={itemParent} page={page} level={level} indexFeed={indexFeed} />, {wrapper: Store})
        expect(toJSON).toMatchSnapshot()
    })

    it('Back Button should run correctly', async () => {
        const {getByTestId} = render(<ReplyComment itemProp={itemProp} itemParent={itemParent} page={page} level={level} indexFeed={indexFeed} />, {wrapper: Store})
        fireEvent.press(getByTestId('backButton'))
        expect(mockGoBack).toHaveBeenCalled()

    })

    it('isLast style should run correctly', () => {
        expect(styles.seeRepliesContainer(true)).toEqual({
                display: 'flex',
                flexDirection: 'row',
                paddingBottom: 14,
                borderLeftColor:'transparent'
        })
    })

    it('ContainerReply component should run correctly', () => {
        const {toJSON} = render(<ContainerReply ><View testID='childreb' /> </ContainerReply>)
        expect(toJSON).toMatchSnapshot()
    })

    it('createChildComment should be called', () => {
        const {getByTestId} = render(<ReplyComment itemProp={itemProp} itemParent={itemParent} page={page} level={level} indexFeed={indexFeed} />, {wrapper: Store})
        fireEvent.press(getByTestId('iscommentenable'))
        expect(useReplyComment).toHaveBeenCalled()
     
    })
    it('getThisComment should run on firs load', async () => {
        const mock1 = jest.fn()
        jest.spyOn(replyFunc, 'default').mockImplementation(() => ({getThisCommentHook: mock1, temporaryText: 'halo'}))
        render(<ReplyComment itemProp={itemProp} itemParent={itemParent} page={page} level={level} indexFeed={indexFeed} />, {wrapper: Store})
        expect(mock1).toHaveBeenCalled()


    })

})
