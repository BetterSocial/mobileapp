import React from 'react'
import {render, cleanup} from '@testing-library/react-native'
import GroupInfo, {styles} from '../../../src/screens/GroupInfo'
import Store, { Context } from '../../../src/context/Store';
import * as useGroupInfo from '../../../src/screens/GroupInfo/hooks/useGroupInfo'
jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

const mockAddListener = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: jest.fn(), addListener: mockAddListener}),
  useRoute: () => ({
    params: {
        from : "AddParticipant"
    }
  }),
}));


describe('GroupInfo should run correctly', () => {
    const setIsLoadingMembers = jest.fn()
    beforeEach(() => {
        jest.spyOn(useGroupInfo, 'default').mockImplementation(() => ({setIsLoadingMembers}))
    })

    it('GroupInfo should match snapshot', () => {
        const wrapper = () => (
          <Context.Provider value={{profile: {}}} ></Context.Provider>
        )
        const {toJSON} = render(<GroupInfo />, {wrapper: Store})
        expect(toJSON).toMatchSnapshot()
        expect(mockAddListener).toHaveBeenCalled()
        // expect(setIsLoadingMembers).toHaveBeenCalled()
    })

    it('image style should run correct', () => {
      expect(styles.image(true)).toEqual({
        width: 80,
        height: 80,
        marginLeft: 0,
      })
         expect(styles.image(false)).toEqual({
        width: 80,
        height: 80,
        marginLeft: 5,
      })
    })

})