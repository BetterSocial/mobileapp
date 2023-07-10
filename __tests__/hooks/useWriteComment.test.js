import {renderHook} from '@testing-library/react-hooks';
import useWriteComment from '../../src/components/Comments/hooks/useWriteComment';

describe('useWriteComment hook should run correctly', () => {
  const dataAnonym = {
    anon_user_info_emoji_name: 'cow',
    anon_user_info_color_name: 'red'
  };
  const dataSigned = {
    user: {
      data: {
        username: 'Agita'
      }
    }
  };
  const dataAnonym2 = {
    data: {
      anon_user_info_emoji_name: 'cow',
      anon_user_info_color_name: 'red'
    }
  };
  const dataSignedUserName = {
    actor: {
      data: {
        username: 'Agita'
      }
    }
  };
  it('handleUserName should run correctly', () => {
    const {result} = renderHook(useWriteComment);
    expect(result.current.handleUserName(dataAnonym)).toEqual(
      `Anonymous ${dataAnonym.anon_user_info_emoji_name}`
    );
    expect(result.current.handleUserName(dataSignedUserName)).toEqual(
      dataSignedUserName.actor.data.username
    );
  });

  it('handleReplyUsername should run correctly', () => {
    const {result} = renderHook(useWriteComment);
    expect(result.current.handleUsernameReplyComment(dataAnonym2)).toEqual(
      `Anonymous ${dataAnonym.anon_user_info_emoji_name}`
    );
    expect(result.current.handleUsernameReplyComment(dataSigned)).toEqual(
      dataSigned.user.data.username
    );
  });
});
