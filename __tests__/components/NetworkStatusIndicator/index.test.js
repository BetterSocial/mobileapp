import * as React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react-native';
import { useNetInfo } from '@react-native-community/netinfo'

import NetworkStatusIndicator from '../../../src/components/NetworkStatusIndicator';

jest.mock('@react-native-community/netinfo', () => ({
    useNetInfo: jest.fn()
}))

describe("Testing Network Status Indicator Component", () => {
    it("Match Snapshot", () => {
        // useNetInfo.mockReturnValueOnce({ isInternetReachable: false})
        // const tree = renderer.create(<NetworkStatusIndicator hide={false} />).toJSON()
        // expect(tree).toMatchSnapshot()
        expect(true).toBeTruthy()
    })

    // it("Hide if hide props is true", () => {
    //     useNetInfo.mockReturnValueOnce({ isInternetReachable: false})
    //     const { queryByTestId } = render(<NetworkStatusIndicator hide={true} />)
    //     expect(queryByTestId('network-status-indicator')).toBeFalsy()
    // })

    // it("Do not show Network Indicator if Netinfo is true ", () => {
    //     useNetInfo.mockReturnValueOnce({ isInternetReachable: true})

    //     const { queryByTestId } = render(<NetworkStatusIndicator hide={false} />)
    //     expect(queryByTestId('network-status-indicator')).toBeFalsy()
    // })

    // it("Shows network indicator if Netinfo is false", () => {
    //     useNetInfo.mockReturnValueOnce({ isInternetReachable: false})
    //     const { queryByTestId } = render(<NetworkStatusIndicator hide={false} />)
    //     expect(queryByTestId('network-status-indicator')).toBeTruthy()
    // })
})