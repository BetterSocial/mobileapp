import React from 'react';
import {act, fireEvent, render} from '@testing-library/react-native';
import RenderBlockList from '../../../src/screens/Blocked/elements/RenderList';

describe('Render block list should run correctly', () => {
  const item = {
    blocked_action_id: 'cfd56df6-3b55-47f8-9508-2fae30e30d1c',
    description: null,
    image: 'https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg',
    name: 'Fajarism',
    user: {
      country_code: 'ID',
      createdAt: '2022-06-10T13:11:47.000Z',
      human_id: 'HQEGNQCHA8J1OIX4G2CP',
      last_active_at: '2022-06-10T13:11:47.000Z',
      profile_pic_asset_id: 'ced7d7dd2c500ebda706147a8f564b4b',
      profile_pic_path:
        'https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg',
      profile_pic_public_id: 'nrfnzuhcrozz9v34ngv3',
      real_name: null,
      status: 'Y',
      updatedAt: '2022-08-16T03:34:45.000Z',
      user_id: 'f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
      username: 'Fajarism'
    },
    user_id_blocked: 'f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
    user_id_blocker: 'c6c91b04-795c-404e-b012-ea28813a2006',
    isUnblocked: true
  };

  const itemNoImage = {
    blocked_action_id: 'cfd56df6-3b55-47f8-9508-2fae30e30d1c',
    description: 'hi boleh',
    image: null,
    name: 'Fajarism',
    user: {
      country_code: 'ID',
      createdAt: '2022-06-10T13:11:47.000Z',
      human_id: 'HQEGNQCHA8J1OIX4G2CP',
      last_active_at: '2022-06-10T13:11:47.000Z',
      profile_pic_asset_id: 'ced7d7dd2c500ebda706147a8f564b4b',
      profile_pic_path:
        'https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg',
      profile_pic_public_id: 'nrfnzuhcrozz9v34ngv3',
      real_name: null,
      status: 'Y',
      updatedAt: '2022-08-16T03:34:45.000Z',
      user_id: 'f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
      username: 'Fajarism'
    },
    user_id_blocked: 'f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
    user_id_blocker: 'c6c91b04-795c-404e-b012-ea28813a2006',
    isUnblocked: false
  };

  it('should match snapshot', () => {
    const onPressList = jest.fn();
    const onPressBody = jest.fn();
    const {toJSON} = render(
      <RenderBlockList item={item} onPressBody={onPressBody} onPressList={onPressList} />
    );
    expect(toJSON).toMatchSnapshot();
  });

  it('pressbody should open pressbody function', () => {
    const onPressList = jest.fn();
    const onPressBody = jest.fn();
    const {getByTestId, getAllByTestId} = render(
      <RenderBlockList item={item} onPressBody={onPressBody} onPressList={onPressList} />
    );
    act(() => {
      fireEvent.press(getByTestId('pressbody'));
    });
    expect(onPressBody).toHaveBeenCalled();
    expect(getAllByTestId('images')).toHaveLength(1);
  });

  it('name should show correctly', () => {
    const onPressList = jest.fn();
    const onPressBody = jest.fn();
    const {getByTestId} = render(
      <RenderBlockList item={item} onPressBody={onPressBody} onPressList={onPressList} />
    );
    expect(getByTestId('name').props.children[1]).toEqual(item.name);
    const {getByTestId: hashtagId} = render(
      <RenderBlockList
        item={item}
        isHashtag={true}
        onPressBody={onPressBody}
        onPressList={onPressList}
      />
    );
    expect(hashtagId('name').props.children[0]).toEqual('#');
  });

  it('Button Block should correctly', () => {
    const onPressList = jest.fn();
    const onPressBody = jest.fn();
    const handleSetUnblock = jest.fn();
    const handleSetBlock = jest.fn();
    const {getAllByTestId, getByTestId} = render(
      <RenderBlockList
        handleSetBlock={handleSetBlock}
        handleSetUnblock={handleSetUnblock}
        item={item}
        onPressBody={onPressBody}
        onPressList={onPressList}
      />
    );
    expect(getAllByTestId('isUnblock')).toHaveLength(1);
    act(() => {
      fireEvent.press(getByTestId('isUnblock'));
    });
    expect(handleSetBlock).toHaveBeenCalled();
    const {getAllByTestId: getBlockId, getByTestId: getIdSingleBlock} = render(
      <RenderBlockList
        handleSetBlock={handleSetBlock}
        handleSetUnblock={handleSetUnblock}
        item={itemNoImage}
        onPressBody={onPressBody}
        onPressList={onPressList}
      />
    );

    expect(getBlockId('isBlock')).toHaveLength(1);
    act(() => {
      fireEvent.press(getIdSingleBlock('isBlock'));
    });
    expect(handleSetUnblock).toHaveBeenCalled();
    expect(getIdSingleBlock('desc').props.children).toEqual(itemNoImage.description);
  });
});
