import {getCommentLength, getCountComment, getCountVote} from '../../src/utils/getstream';

describe('Getstream utils test', () => {
  it('getCommentLength should return 0 when comments is undefined', () => {
    const comments = undefined;
    expect(getCommentLength(comments)).toEqual(0);
  });

  it('getCommentLength should return number based on comments', () => {
    const comments = [
      {
        id: '1',
        text: 'text'
      },
      {
        id: '2',
        text: 'text'
      }
    ];
    expect(getCommentLength(comments)).toEqual(2);
  });

  it('getCountVote should return 0 when item is undefined', () => {
    const item = undefined;
    expect(getCountVote(item)).toEqual(0);
  });

  it('getCountVote should return positive number if upvote is higher than downvotes', () => {
    const item = {
      reaction_counts: {
        upvotes: 2,
        downvotes: 1
      }
    };
    expect(getCountVote(item)).toBeGreaterThan(0);
  });

  it('getCountVote should return negative number if upvote is lower than downvotes', () => {
    const item = {
      reaction_counts: {
        upvotes: 1,
        downvotes: 2
      }
    };
    expect(getCountVote(item)).toBeLessThan(0);
  });

  it('getCountComment should return 0 when item is undefined', () => {
    const item = {
      reaction_counts: {}
    };
    expect(getCountComment(item)).toEqual(0);
  });

  it('getCountComment should return number based on comment', () => {
    const item = {
      reaction_counts: {
        comment: 2
      }
    };
    expect(getCountComment(item)).toEqual(2);
  });
});
