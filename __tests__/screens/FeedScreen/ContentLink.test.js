import * as React from 'react';
import renderer from 'react-test-renderer';
import {Linking} from 'react-native';
import {fireEvent, render} from '@testing-library/react-native';
import {useRoute} from '@react-navigation/native';

import Card from '../../../src/components/Card/Card';
import ContentLink from '../../../src/screens/FeedScreen/ContentLink';
import Header from '../../../src/components/Card/CardHeader';
import TestIdConstant from '../../../src/utils/testId';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => jest.fn()
}));

const og = {
  date: '2022-06-01T16:49:07.000Z',
  description:
    'Seamlessly integrate with our anonymous, bot-resistant, one-click login to create a safer community for your users.',
  domain: 'human-id.org',
  domainImage: '',
  domain_page_id: '66e63a30-1ddd-4aff-8b13-23868b971bf4',
  image: '',
  news_link_id: '39d39e1d-79e0-4537-8133-e235ced81256',
  title: 'humanID: One-click, Anonymous Login',
  url: 'https://human-id.org/'
};

describe('Testing Feed Screen Content Link', () => {
  it('ContentLink Matches Snapshot', () => {
    useRoute().mockReturnValue({
      name: 'FeedScreen'
    });

    const tree = renderer.create(<ContentLink og={og} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Card Matches Snapshot', () => {
    useRoute().mockReturnValue({
      name: 'FeedScreen'
    });

    const tree = renderer
      .create(
        <Card
          domain={og.domain}
          date={og.date}
          description={og.description}
          domainImage={og.domainImage}
          image={og.image}
          title={og.title}
          url={og.url}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('CardHeader Matches Snapshot', () => {
    const tree = renderer
      .create(<Header domain={og.domain} image={og.domainImage} date={og.date} score={null} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Render fallback image if image is null', () => {
    const {getByTestId} = render(<ContentLink og={og} />);
    expect(getByTestId('contentLinkImageEmptyStateImage')).toBeTruthy();
  });

  it('Render content image if image is set', () => {
    const {getByTestId} = render(
      <ContentLink
        og={{
          ...og,
          image:
            'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png'
        }}
      />
    );
    expect(getByTestId('contentLinkImageUrlImage')).toBeTruthy();
  });

  it('Render default domain image if domainImage is null', () => {
    const {getByTestId} = render(
      <Header domain={og.domain} image={og.domainImage} date={og.date} score={null} />
    );
    expect(getByTestId(TestIdConstant.iconDomainProfilePictureEmptyState)).toBeTruthy();
  });

  it('Render domain image if domainImage is set', () => {
    const {getByTestId} = render(
      <Header
        domain={og.domain}
        image={
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png'
        }
        date={og.date}
        score={null}
      />
    );
    expect(getByTestId(TestIdConstant.iconDomainProfilePicture)).toBeTruthy();
  });

  it('Will navigate to domain page when header is clicked', () => {
    const onHeaderPress = jest.fn((url) => url);

    const {getByTestId} = render(
      <Card
        onHeaderPress={onHeaderPress}
        domain={og.domain}
        date={og.date}
        description={og.description}
        domainImage={og.domainImage}
        image={og.image}
        title={og.title}
        url={og.url}
      />
    );
    fireEvent.press(getByTestId(TestIdConstant.contentLinkHeaderPress));
    expect(onHeaderPress).toBeCalled();
  });

  it('Will navigate to context link page when content is clicked', () => {
    const onContentPress = jest.fn((url) => url);

    const {getByTestId} = render(
      <Card
        onCardContentPress={onContentPress}
        domain={og.domain}
        date={og.date}
        description={og.description}
        domainImage={og.domainImage}
        image={og.image}
        title={og.title}
        url={og.url}
      />
    );
    fireEvent.press(getByTestId(TestIdConstant.contentLinkContentPress));
    expect(onContentPress).toBeCalled();
  });

  it('Will open linking by its url when open link is clicked', async () => {
    jest.mock('react-native/Libraries/Linking/Linking', () => ({
      openURL: jest.fn((url) => Promise.resolve(url)),
      canOpenURL: jest.fn().mockImplementation(() => true)
    }));

    const {getByTestId} = render(
      <Card
        domain={og.domain}
        date={og.date}
        description={og.description}
        domainImage={og.domainImage}
        image={og.image}
        title={og.title}
        url={og.url}
      />
    );
    fireEvent.press(getByTestId(TestIdConstant.contentLinkOpenLinkPress));
    expect(Linking.openURL).toBeCalled();
    expect(await Linking.openURL(og.url)).toBe(og.url);
  });

  it('render new content link should match snapshot', () => {
    const {getAllByTestId} = render(
      <ContentLink og={og} message="https://detik.com nama saya agita" />
    );
    expect(getAllByTestId('urlComponent')).toHaveLength(1);
  });
});
