import * as React from 'react';
import {render} from '@testing-library/react-native';
import AnonymousAvatar, {styles} from '../../../src/components/AnonymousAvatar';

describe('AnonymousAvatar should match run correctly', () => {
  it('Should match snapshot', () => {
    expect(styles.avatarV2Background('red', 10)).toEqual({
      width: 10,
      height: 10,
      borderRadius: 10 / 2,
      backgroundColor: 'red',
      justifyContent: 'center'
    });
    expect(styles.avatarV2Emoji(10)).toEqual({
      fontSize: 10,
      alignSelf: 'center',
      textAlign: 'center'
    });
  });

  it('should be render correctly', () => {
    const {getAllByTestId} = render(
      <AnonymousAvatar version={3} anonUserInfo={{emojiCode: 'agita', colorCode: 'blue'}} />
    );
    expect(getAllByTestId('newVersion')).toHaveLength(1);
  });
});
