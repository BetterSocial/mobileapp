import * as React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react-native';
import CardLinkPreview from '../../../src/components/Card/CardInLinkPreview';
import TestIdConstant from '../../../src/utils/testId';
import * as utils from '../../../src/utils/Utils';


describe('CardLinkPreview should run correctly', () => {
// date,
//     description,
//     domain,
//     domainImage,
//     image,
//     item,
//     onCardContentPress,
//     onHeaderPress,
//     score,
//     title,
//     url,

    afterEach(cleanup)
    it('should match snapshot', () => {
        const onCardContentPress = jest.fn()
        const onHeaderPress = jest.fn()
        const spy = jest.spyOn(utils, 'sanitizeUrlForLinking')
        const {toJSON, getAllByTestId, getByTestId} = render(<CardLinkPreview domain={'https://detik.com'} onHeaderPress={onHeaderPress} onCardContentPress={onCardContentPress} domainImage='https://detik1.jpg' title='test bro' image='https://detik.jpg' date={'26/08/2022'} />)
        expect(toJSON).toMatchSnapshot()
        fireEvent.press(getByTestId(TestIdConstant.contentLinkHeaderPress))        
        expect(onHeaderPress).toHaveBeenCalled()
        fireEvent.press(getByTestId(TestIdConstant.contentLinkOpenLinkPress))
        expect(spy).toHaveBeenCalled()
        expect(getAllByTestId('contentLinkImageUrlImage')).toHaveLength(1)
        // expect(getAllByTestId(TestIdConstant.iconDomainProfilePicture)).toHaveLength(1)
        const {getAllByTestId: getNoImageId} = render(<CardLinkPreview domain={'https://detik.com'} onHeaderPress={onHeaderPress} onCardContentPress={onCardContentPress} domainImage='https://detik1.jpg' title='test bro' image={null} date={'26/08/2022'}  />)
        expect(getNoImageId('contentLinkImageEmptyStateImage')).toHaveLength(1)
    })
})