import * as React from 'react'
import {render, cleanup, fireEvent} from '@testing-library/react-native'
import moment from 'moment'
import Header, {validationTimer} from '../../../src/screens/FeedScreen/Header'
import Store from '../../../src/context/Store'
import * as service from '../../../src/service/post'
import userHeaderFeed from '../../../src/screens/FeedScreen/hooks/useFeedHeader'

jest.mock('react-native-activity-feed/node_modules/react-native-image-crop-picker', () => ({
    openPicker: () => jest.fn()
}))
const mockedGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useRoute: () => jest.fn(),
    useNavigation: () => ({
        goBack: mockedGoBack
    }),
}))



describe('Header feed should run correctly', () => {

    afterEach(cleanup)

    it('code should not change', () => {
        const {toJSON} = render(<Header props={{anonimity: false}}  />, {wrapper: Store})
        expect(toJSON).toMatchSnapshot()
    })

    it('user normal should choose correct component', () => {
        const {getAllByTestId} = render(<Header props={{anonimity: false}}  />, {wrapper: Store})
        expect(getAllByTestId('defaultHeader')).toHaveLength(1)
        
    })

    it('user anonimous should choose correct component', () => {
         const {getAllByTestId} = render(<Header props={{anonimity: true, privacy: 'public'}}  />, {wrapper: Store})
        expect(getAllByTestId('anonymHeader')).toHaveLength(1)
    })

    it('validationTimer function should run correctly', () => {
        const expiredAtOneDay = moment().add('day',1)
        const expiredAtHalfDay = moment().add('hour',12)
        const {getAllByTestId} = render(<Header props={{anonimity: false, duration_feed: 1, expired_at: expiredAtOneDay}}  />, {wrapper: Store})
        const {getAllByTestId:getTestHalfDay} = render(<Header props={{anonimity: false, duration_feed: 1, expired_at: expiredAtHalfDay}}  />, {wrapper: Store})
        expect(getAllByTestId('full')).toHaveLength(1)
    })

    it('props isBackButton should have back button', () => {
            const {getAllByTestId} = render(<Header props={{anonimity: false, source: 'public'}  } isBackButton={true} />, {wrapper: Store})
            const {getAllByTestId:allIdAnonym, getByTestId:idAnonym} = render(<Header props={{anonimity: true, privacy: 'public'}  } isBackButton={true} />, {wrapper: Store})
            expect(getAllByTestId('haveBackButton')).toHaveLength(1)
            expect(allIdAnonym('haveBackButton')).toHaveLength(1)
            fireEvent.press(idAnonym('onBack'))
            expect(mockedGoBack).toHaveBeenCalledTimes(1)

    })

})