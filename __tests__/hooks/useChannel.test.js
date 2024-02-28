import {renderHook} from '@testing-library/react-hooks';

import useChannelHook from '../../src/hooks/screen/useChannelHook';
import {BaseChannelItemTypeProps} from '../../types/component/AnonymousChat/BaseChannelItem.types';

describe('useChannelHook should run correctly', () => {
  const mockPostNotification1 = {
    rawJson: {
      isOwnPost: true,
      isOwnSignedPost: false,
      isAnonym: true,
      comments: [
        {
          reaction: {
            data: {count_downvote: 0, count_upvote: 0, isNotSeen: true, text: 'Saaaame!'},
            isOwningReaction: false
          }
        }
      ]
    }
  };

  const mockPostNotification2 = {
    rawJson: {
      isOwnPost: false,
      isAnonym: false,
      comments: [
        {
          reaction: {
            data: {
              anon_user_info_color_code: '#640BBD',
              anon_user_info_color_name: 'Violet',
              anon_user_info_emoji_code: '🦆',
              anon_user_info_emoji_name: 'Duck',
              count_downvote: 0,
              count_upvote: 0,
              isNotSeen: true,
              is_anonymous: true,
              text: 'I have, loved sitting at the river with look onto the bridge 🥰'
            },
            latest_children: {
              comment: [
                {
                  user: {
                    data: {
                      profile_pic_url:
                        'https://res.cloudinary.com/hfaputftx/image/upload/v1683783108/sd7p8qn8ilij4no6wqyy.jpg',
                      username: 'Intan'
                    }
                  },
                  data: {text: 'uuuw yeah. The view is amazing! '}
                }
              ]
            },
            isOwningReaction: true
          }
        }
      ]
    }
  };

  const mockPostNotification3 = {
    rawJson: {
      isOwnPost: false,
      isAnonym: false,
      comments: [
        {
          reaction: {
            data: {text: 'uuuw yeah. The view is amazing! '},
            isOwningReaction: true
          }
        }
      ]
    }
  };

  const mockPostNotification4 = {
    rawJson: {
      isOwnPost: false,
      isOwnSignedPost: false,
      isAnonym: true,
      comments: [
        {
          reaction: {
            data: {
              anon_user_info_color_code: '#640BBD',
              anon_user_info_color_name: 'Violet',
              anon_user_info_emoji_code: '🐹',
              anon_user_info_emoji_name: 'Hamster',
              count_downvote: 0,
              count_upvote: 1,
              isNotSeen: true,
              is_anonymous: true,
              text: 'We all feel like this in some point. I recommend daily meditation amd reflection'
            },
            isOwningReaction: true
          }
        }
      ]
    }
  };

  it('should return the correct post notification type', () => {
    const {result} = renderHook(useChannelHook);
    const {determinePostType} = result.current;
    const postType = determinePostType(mockPostNotification1);

    expect(postType).toBe(BaseChannelItemTypeProps.ANON_POST_NOTIFICATION);
  });

  it('should return the correct post notification type', () => {
    const {result} = renderHook(() => useChannelHook());
    const {determinePostType} = result.current;
    const postType = determinePostType(mockPostNotification2);

    expect(postType).toBe(
      BaseChannelItemTypeProps.SIGNED_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY
    );
  });

  it('should return the correct post notification type', () => {
    const {result} = renderHook(() => useChannelHook());
    const {determinePostType} = result.current;
    const postType = determinePostType(mockPostNotification3);

    expect(postType).toBe(BaseChannelItemTypeProps.SIGNED_POST_NOTIFICATION_I_COMMENTED);
  });

  it('should return the correct post notification type', () => {
    const {result} = renderHook(() => useChannelHook());
    const {determinePostType} = result.current;
    const postType = determinePostType(mockPostNotification4);

    expect(postType).toBe(BaseChannelItemTypeProps.ANON_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY);
  });
});
