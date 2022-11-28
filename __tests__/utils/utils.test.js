import { Linking } from 'react-native'
import { act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import { sanitizeUrlForLinking, setCapitalFirstLetter, openUrl, removeWhiteSpace, globalReplaceAll, validationURL, getUrl } from '../../src/utils/Utils'

jest.mock('react-native-simple-toast', () => ({
    SHORT: jest.fn()
}))


function mockSuccessLinking() {
    const canOpenURL = jest
        .spyOn(Linking, 'canOpenURL')
        .mockImplementation(() => Promise.resolve(true));
    const openURL = jest
        .spyOn(Linking, 'openURL')
        .mockImplementation(() => Promise.resolve(true));

    return { canOpenURL, openURL };
}

describe('Utils function run correctly', () => {
    it('sanitizeUrlForLinking should run correctly', () => {
        const url = 'https://www.detik.com'
        expect(sanitizeUrlForLinking(url)).toStrictEqual('https://detik.com')

    })

    it('setCapitalFirstLetter should run correctly', () => {
        const letter = 'rumah baru'
        expect(setCapitalFirstLetter(letter)).toStrictEqual('Rumah baru')
    })

    it('openUrl should run correctly', async () => {
        const { canOpenURL, openURL } = mockSuccessLinking();
        const url = 'https://www.detik.com'
        act(() => {
            openUrl(url)
        })
        expect(canOpenURL).toHaveBeenCalled()
        await waitFor(() => {
            expect(openURL).toHaveBeenCalled()
        })
    })

    it('removeWhiteSpace should run correctly', () => {
        const text = '     test spasi depan'
        expect(removeWhiteSpace(text)).toStrictEqual('test spasi depan')
    })

    it('globalReplaceAll should run correctly', () => {
        const text = 'ini adalah text baru dari saya, harusnya titik,'
        expect(globalReplaceAll(text, ',', '.')).toStrictEqual('ini adalah text baru dari saya. harusnya titik.')
    })

    it('validationUrl should run correctly', () => {
        let url = 'https://detik.com'
        expect(validationURL(url)).toStrictEqual(true)
        url = 'test123'
        expect(validationURL(url)).toStrictEqual(false)

    })

    it('expect get url should runt correctly', () => {
        const url = 'https://detik.com'
        expect(getUrl(url)).toStrictEqual(url)
    })
})