import * as React from 'react';
import moment from 'moment';
import {cleanup, fireEvent, render} from '@testing-library/react-native';

import * as usePollMultiple from '../../../src/components/PollOptionsMultipleChoice/hooks/usePollOptionMultiple';
import ContentPoll from '../../../src/screens/FeedScreen/ContentPoll';
import PollOptinComponent from '../../../src/components/PollOptionsMultipleChoice';
import {getPollTime} from '../../../src/utils/string/StringUtils';

describe('Content poll should same as snapshot', () => {
  const item = {
    post_type: 1,
    message: 'halo',
    images_url: '',
    pollOptions: [
      {
        counter: '0',
        createdAt: '2022-11-28T01:24:25.000Z',
        option: 'bahaya123',
        polling_id: 'dee1ff13-9e1e-46b2-8ffc-46afdd38acca',
        polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53b',
        updatedAt: '2022-11-28T01:24:25.000Z'
      },
      {
        counter: '1',
        createdAt: '2022-11-28T01:24:25.000Z',
        option: 'bahaya1',
        polling_id: 'dee1ff13-9e1e-46b2-8ffc-46afdd38acca',
        polling_option_id: '3bc4ec5e-ac8f-4704-8256-1018edd9224c',
        updatedAt: '2022-11-28T01:25:15.000Z'
      }
    ],
    polls_expired_at: '2022-11-29T01:24:25.170Z',
    multiplechoice: true,
    isalreadypolling: true,
    voteCount: 2,
    topics: ['poll']
  };

  const itemNotMultiple = {
    post_type: 1,
    message: 'halo',
    images_url: '',
    pollOptions: [
      {
        counter: '0',
        createdAt: '2022-11-28T01:24:25.000Z',
        option: 'bahaya123',
        polling_id: 'dee1ff13-9e1e-46b2-8ffc-46afdd38acca',
        polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53b',
        updatedAt: '2022-11-28T01:24:25.000Z'
      },
      {
        counter: '1',
        createdAt: '2022-11-28T01:24:25.000Z',
        option: 'bahaya1',
        polling_id: 'dee1ff13-9e1e-46b2-8ffc-46afdd38acca',
        polling_option_id: '3bc4ec5e-ac8f-4704-8256-1018edd9224c',
        updatedAt: '2022-11-28T01:25:15.000Z'
      }
    ],
    polls_expired_at: '2022-11-29T01:24:25.170Z',
    multiplechoice: false,
    isalreadypolling: false,
    voteCount: 2,
    topics: ['poll']
  };

  afterEach(cleanup);

  it('should same as snapshot', () => {
    const onnewpollfetched = jest.fn();
    const tree = render(
      <ContentPoll
        item={item}
        onnewpollfetched={onnewpollfetched}
        multiplechoice={item.multiplechoice}
        pollexpiredat={item.polls_expired_at}
        voteCount={item.voteCount}
        isalreadypolling={item.isalreadypolling}
        polls={item.pollOptions}
        currentMoment={moment('2023-04-10T01:24:25.000Z')}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('poll multiplechoice component should be show', () => {
    const onnewpollfetched = jest.fn();
    const {getAllByTestId} = render(
      <ContentPoll
        item={item}
        onnewpollfetched={onnewpollfetched}
        multiplechoice={item.multiplechoice}
        pollexpiredat={item.polls_expired_at}
        voteCount={item.voteCount}
        isalreadypolling={item.isalreadypolling}
        polls={item.pollOptions}
      />
    );
    expect(getAllByTestId('multiple')).toHaveLength(2);
  });

  it('poll not multiplechoice component should be show', () => {
    const onnewpollfetched = jest.fn();
    const {getAllByTestId} = render(
      <ContentPoll
        item={item}
        onnewpollfetched={onnewpollfetched}
        multiplechoice={false}
        pollexpiredat={item.polls_expired_at}
        voteCount={item.voteCount}
        isalreadypolling={item.isalreadypolling}
        polls={item.pollOptions}
      />
    );
    expect(getAllByTestId('option')).toHaveLength(2);
  });

  it('poll date should be existed', () => {
    const onnewpollfetched = jest.fn();
    const {getAllByText} = render(
      <ContentPoll
        item={item}
        onnewpollfetched={onnewpollfetched}
        multiplechoice={false}
        pollexpiredat={item.polls_expired_at}
        voteCount={item.voteCount}
        isalreadypolling={item.isalreadypolling}
        polls={item.pollOptions}
      />
    );
    const polltime = getPollTime(item.polls_expired_at);
    expect(getAllByText(polltime)).toHaveLength(1);
  });

  it('total vote text should be existed', () => {
    const onnewpollfetched = jest.fn();
    const {getAllByText} = render(
      <ContentPoll
        item={item}
        onnewpollfetched={onnewpollfetched}
        multiplechoice={false}
        pollexpiredat={'2022-11-29T01:24:25.170Z'}
        voteCount={item.voteCount}
        isalreadypolling={false}
        polls={item.pollOptions}
      />
    );
    expect(getAllByText(`${item.voteCount} votes`)).toHaveLength(1);
  });

  it('renderPercentageBar should run correctly', () => {
    const {getAllByTestId} = render(
      <PollOptinComponent
        mypoll={[]}
        item={item.pollOptions[0]}
        selectedindex={'1'}
        multiplechoice={false}
        isexpired={true}
        isalreadypolling={true}
      />
    );
    expect(getAllByTestId('isExpired')).toHaveLength(1);
    const {getAllByTestId: getAlreadyPolling} = render(
      <PollOptinComponent
        mypoll={[]}
        item={item.pollOptions[0]}
        selectedindex={'1'}
        multiplechoice={false}
        isexpired={false}
        isalreadypolling={true}
      />
    );
    expect(getAlreadyPolling('isAlreadyPolling')).toHaveLength(1);
  });

  it('renderPollBadge should run correctly', () => {
    const {getAllByTestId} = render(
      <PollOptinComponent
        maxpolls={['c4d16d91-89f5-423c-acb5-95a1b91ec53b']}
        mypoll={[]}
        item={item.pollOptions[0]}
        selectedindex={'1'}
        multiplechoice={false}
        isexpired={true}
        isalreadypolling={true}
      />
    );
    expect(getAllByTestId('pollWinner')).toHaveLength(1);
    const {getAllByTestId: getPollNotEndedAndIsMine} = render(
      <PollOptinComponent
        maxpolls={['c4d16d91-89f5-423c-acb5-95a1b91ec53b']}
        mypoll={[{polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53b'}]}
        item={item.pollOptions[0]}
        selectedindex={'1'}
        multiplechoice={false}
        isexpired={false}
        isalreadypolling={true}
      />
    );
    expect(getPollNotEndedAndIsMine('isPollNotEndedAndIsMine')).toHaveLength(1);
    const {getAllByTestId: getNoPoll} = render(
      <PollOptinComponent
        maxpolls={['c4d16d91-89f5-423c-acb5-95a1b91ec53a']}
        mypoll={[{polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53a'}]}
        item={item.pollOptions[0]}
        selectedindex={'1'}
        multiplechoice={false}
        isexpired={false}
        isalreadypolling={true}
      />
    );
    expect(getNoPoll('nonePoll')).toHaveLength(1);
  });

  it('optionPercentage should occur', async () => {
    const onnewpollfetched = jest.fn();
    const {getAllByTestId} = render(
      <ContentPoll
        item={item}
        onnewpollfetched={onnewpollfetched}
        multiplechoice={item.multiplechoice}
        pollexpiredat={item.polls_expired_at}
        voteCount={item.voteCount}
        isalreadypolling={item.isalreadypolling}
        polls={item.pollOptions}
      />
    );
    const mockOnOptionsClicked = jest.fn();
    jest.spyOn(usePollMultiple, 'usePollOptionMultiple').mockImplementation(() => ({
      onOptionsClicked: mockOnOptionsClicked
    }));
    expect(getAllByTestId('optionPercentage')).toHaveLength(2);
    // expect(getAllByText())
  });

  it('checkbolx poll should occured', () => {
    const onnewpollfetched = jest.fn();
    const {getAllByTestId} = render(
      <ContentPoll
        item={item}
        onnewpollfetched={onnewpollfetched}
        multiplechoice={item.multiplechoice}
        pollexpiredat={moment().add(2, 'day')}
        voteCount={item.voteCount}
        isalreadypolling={false}
        polls={item.pollOptions}
      />
    );
    expect(getAllByTestId('checkbox')).toHaveLength(2);
    const mockOnOptionsClicked = jest.fn();
    jest.spyOn(usePollMultiple, 'usePollOptionMultiple').mockImplementation(() => ({
      onOptionsClicked: mockOnOptionsClicked
    }));
    fireEvent(getAllByTestId('checkbox')[0], 'change');
  });

  it('option text should be there', () => {
    const onnewpollfetched = jest.fn();
    const {getAllByText} = render(
      <ContentPoll
        item={item}
        onnewpollfetched={onnewpollfetched}
        multiplechoice={item.multiplechoice}
        pollexpiredat={moment().add(2, 'day')}
        voteCount={item.voteCount}
        isalreadypolling={false}
        polls={item.pollOptions}
      />
    );

    expect(getAllByText(item.pollOptions[0].option)).toHaveLength(1);
    expect(getAllByText(item.pollOptions[1].option)).toHaveLength(1);
  });

  it('optionPercentage should count correctly', () => {
    const onnewpollfetched = jest.fn();
    const {getAllByText} = render(
      <ContentPoll
        item={item}
        onnewpollfetched={onnewpollfetched}
        multiplechoice={item.multiplechoice}
        pollexpiredat={moment().subtract(2, 'day')}
        voteCount={item.voteCount}
        isalreadypolling={true}
        polls={item.pollOptions}
      />
    );
    expect(getAllByText('0%')).toHaveLength(1);
  });
  it('isExpiredPollOption should have length', () => {
    const onnewpollfetched = jest.fn();
    const {getAllByTestId} = render(
      <ContentPoll
        item={itemNotMultiple}
        onnewpollfetched={onnewpollfetched}
        multiplechoice={itemNotMultiple.multiplechoice}
        pollexpiredat={moment().subtract(2, 'day')}
        voteCount={itemNotMultiple.voteCount}
        isalreadypolling={true}
        polls={itemNotMultiple.pollOptions}
      />
    );
    expect(getAllByTestId('isExpiredPollOption')).toHaveLength(2);
  });

  it('expired date text should correct', () => {
    const onnewpollfetched = jest.fn();
    const {getAllByText} = render(
      <ContentPoll
        item={itemNotMultiple}
        onnewpollfetched={onnewpollfetched}
        multiplechoice={itemNotMultiple.multiplechoice}
        pollexpiredat={moment().subtract(2, 'day')}
        voteCount={itemNotMultiple.voteCount}
        isalreadypolling={true}
        polls={itemNotMultiple.pollOptions}
      />
    );
    expect(getAllByText('Poll closed 2d ago')).toHaveLength(1);
  });
});
