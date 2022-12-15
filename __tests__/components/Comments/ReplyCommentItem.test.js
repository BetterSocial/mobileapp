import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import ReplyCommentItem from '../../../src/components/Comments/ReplyCommentItem';

jest.mock('react-native/Libraries/Pressability/usePressability')
jest.mock('react-native/Libraries/Components/Pressable/Pressable')
describe('ReplyCommentItem should run correctly', () => {
    afterEach(cleanup)
    const user = {
        created_at: "2022-06-10T13:11:47.095310Z",
        data: {
            human_id: "HQEGNQCHA8J1OIX4G2CP",
        profile_pic_url: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
        username: "Fajarism"
        },
        id: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
        updated_at: "2022-08-16T03:34:45.197566Z"
    }

    const comments = 
       {
        activity_id: "4fb32f25-7a1c-11ed-a1bd-124f97b82f95",
        children_counts: {},
        created_at: "2022-12-12T12:58:01.801974Z",
        data: {
            count_downvote: 0,
        count_upvote: 0,
        isNotSeen: true,
        text: "Good to see u"
        },
        id: "016dfff6-49d2-4279-ae29-fd6997bcae9a",
        kind: "comment",
        latest_children: {comment: [],
        length: 0},
        parent: "",

        updated_at: "2022-12-12T12:58:01.801974Z",
        user: {
            created_at: "2022-06-10T13:11:47.095310Z",
        data:{
            human_id: "HQEGNQCHA8J1OIX4G2CP",
            profile_pic_url: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
            username: "Fajarism"
        },
        id: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
        updated_at: "2022-08-16T03:34:45.197566Z",

        },


        user_id: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e"
       }
    
//       user,
//   comment,
//   onPress,
//   isLast = false,
//   isLastInParent = false,
//   time,
//   style,
//   photo,
//   level,
//   showLeftConnector = true,
//   disableOnTextPress = false,
//   refreshComment,
//    updateVoteParent
    it('should match snapshot', () => {
        const onPress = jest.fn()
        const refreshComment = jest.fn()
        const {toJSON, getAllByText} = render(<ReplyCommentItem comment={comments} user={user} onPress={onPress} isLast={false} isLastInParent={false} time={'26/08/2022'} photo='https://detil.jpg' level={0} refreshComment={refreshComment} showLeftConnector={false} disableOnTextPress={false} />)
        expect(toJSON).toMatchSnapshot()

    })
})