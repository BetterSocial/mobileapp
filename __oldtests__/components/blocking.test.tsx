import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import ItemList from '../../src/components/Blocking/ItemList';
import ItemListLarge from '../../src/components/Blocking/ItemListLarge';

configure({adapter: new Adapter()});
describe('component blocking', () => {
  it('ItemList snapshot', () => {
    const component = shallow(
      <ItemList
        onSelect={() => {}}
        active={true}
        label="The account is fake or not human"
        id={1}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('ItemList renders correctly', () => {
    const tree = renderer
      .create(
        <ItemList
          onSelect={() => {}}
          active={true}
          label="The account is fake or not human"
          id={1}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('ItemListLarge snapshot', () => {
    const component = shallow(
      <ItemListLarge
        onPress={() => {}}
        label="Block anonim indefinitely"
        id={1}
        desc="You will not be able to see each other’s posts, or message each other. The user’s reach will be reduced across BetterSocial, in particular for this post."
        icon="block"
        iconReght={false}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('ItemListLarge renders correctly', () => {
    const tree = renderer
      .create(
        <ItemListLarge
          onPress={() => {}}
          label="Block anonim indefinitely"
          id={1}
          desc="You will not be able to see each other’s posts, or message each other. The user’s reach will be reduced across BetterSocial, in particular for this post."
          icon="block"
          iconReght={false}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
