import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Search from '../../src/components/Search/Search';
import SearchModal from '../../src/components/Search/SearchModal';
import SearchAutoComplete from '../../src/components/Search/SearchAutoComplete';

configure({adapter: new Adapter()});
describe('component Search', () => {
  it('Search snapshot', () => {
    const component = shallow(
      <Search
        onChangeText={() => {}}
        value={'Search'}
        placeholder="input search"
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Search renders correctly', () => {
    const tree = renderer
      .create(
        <Search
          onChangeText={() => {}}
          value={'Search'}
          placeholder="input search"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('SearchModal snapshot', () => {
    const component = shallow(
      <SearchModal
        isVisible={false}
        onClose={() => {}}
        onChangeText={() => {}}
        value="SearchModal"
        placeholder="Search"
        isLoading={false}
        options={{
          neighborhood: 'indonesia',
        }}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('SearchModal renders correctly', () => {
    const tree = renderer
      .create(
        <SearchModal
          isVisible={false}
          onClose={() => {}}
          onChangeText={() => {}}
          value="SearchModal"
          placeholder="Search"
          isLoading={false}
          options={{
            neighborhood: 'indonesia',
          }}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('SearchAutoComplete snapshot', () => {
    const component = shallow(
      <SearchAutoComplete
        isVisible={false}
        onClose={() => {}}
        onChangeText={() => {}}
        value="SearchModal"
        placeholder="Search"
        isLoading={false}
        options={{
          neighborhood: 'indonesia',
        }}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('SearchAutoComplete renders correctly', () => {
    const tree = renderer
      .create(
        <SearchAutoComplete
          isVisible={false}
          onClose={() => {}}
          onChangeText={() => {}}
          value="SearchModal"
          placeholder="Search"
          isLoading={false}
          options={{
            neighborhood: 'indonesia',
          }}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
