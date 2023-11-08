import {Dimensions} from 'react-native';
import {renderHook} from '@testing-library/react-hooks';

import usePostDetail from '../../src/components/PostPageDetail/hooks/usePostDetail';

jest.mock('react-native-safe-area-context', () => {
  const inset = {top: 100, right: 0, bottom: 100, left: 0};
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({children}) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({children}) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset)
  };
});

const longText =
  'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.';

describe('usePOstDetail should run correctly', () => {
  const listComment = [
    {
      id: '14369fd6-5307-4181-8b3a-d87e4f962013',
      latest_children: {
        comment: [
          {
            id: '7aae60a9-0be7-4e0d-aaba-b1e695043585'
          }
        ]
      }
    }
  ];

  const dataUpdate = {
    parent: '14369fd6-5307-4181-8b3a-d87e4f962013',
    data: {
      count_downvote: 0,
      count_upvote: 1,
      isNotSeen: true,
      text: 'Yes'
    },
    id: '7aae60a9-0be7-4e0d-aaba-b1e695043585'
  };

  const dataUpdate2 = {
    parent: '08267243-26f1-4a97-819d-f04a94904e9e',
    data: {
      count_downvote: 0,
      count_upvote: 1,
      isNotSeen: true,
      text: 'Yes'
    },
    id: '7aae60a9-0be7-4e0d-aaba-b1e695043585'
  };

  it('should updateVoteChildrenLevel1 run correctly', () => {
    const {result} = renderHook(usePostDetail);
    expect(result.current.updateVoteChildrenLevel1(listComment, dataUpdate)).toEqual([
      {
        id: '14369fd6-5307-4181-8b3a-d87e4f962013',
        latest_children: {
          comment: [{data: dataUpdate.data, id: '7aae60a9-0be7-4e0d-aaba-b1e695043585'}]
        }
      }
    ]);
    expect(result.current.updateVoteChildrenLevel1(listComment, dataUpdate2)).toEqual([
      {
        id: '14369fd6-5307-4181-8b3a-d87e4f962013',
        latest_children: {
          comment: [{id: '7aae60a9-0be7-4e0d-aaba-b1e695043585'}]
        }
      }
    ]);
  });
  it('calculatedSizeScreen should run correctly', () => {
    const {result} = renderHook(usePostDetail);
    expect(result.current.calculatedSizeScreen).toEqual(370);
  });

  it('calculatePaddingBtm should run correctly', () => {
    const {result} = renderHook(usePostDetail);
    expect(result.current.calculatePaddingBtm()).toEqual(200);
  });

  it('calculationText should run correctly', () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({width: 400, height: 800});
    const {result} = renderHook(usePostDetail);
    expect(result.current.calculationText('wide')).toEqual({
      containerComment: 77.5,
      containerHeight: 292.5,
      fontSize: 21.6,
      lineHeight: 39.6,
      isShortText: true
    });
    expect(result.current.calculationText('wide', 2)).toEqual({
      containerComment: 77.5,
      containerHeight: 292.5,
      fontSize: 21.6,
      lineHeight: 39.6,
      isShortText: true
    });

    expect(result.current.calculationText('wide', 1)).toEqual({
      containerComment: 77.5,
      containerHeight: 292.5,
      fontSize: 21.6,
      lineHeight: 39.6,
      isShortText: true
    });

    expect(result.current.calculationText(longText)).toEqual({
      containerComment: -461.6,
      containerHeight: 831.6,
      fontSize: 14.4,
      lineHeight: 21.6,
      isShortText: false
    });
  });
});
