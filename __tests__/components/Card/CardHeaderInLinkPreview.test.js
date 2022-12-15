import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import CardHeaderLink from '../../../src/components/Card/CardHeaderInLinkPreview';
import TestIdConstant from '../../../src/utils/testId';


describe('CardHeaderLink should run correctly', () => {


    afterEach(cleanup)
    it('should match snapshot', () => {
        const {toJSON, getAllByTestId} = render(<CardHeaderLink domain={'https://detik.com'} image='https://detik.jpg' date={'26/08/2022'} />)
        expect(toJSON).toMatchSnapshot()
        expect(getAllByTestId(TestIdConstant.iconDomainProfilePicture)).toHaveLength(1)
                const {getAllByTestId: getNoImageId} = render(<CardHeaderLink domain={'https://detik.com'} image={null} date={'26/08/2022'} />)
        expect(getNoImageId(TestIdConstant.iconDomainProfilePictureEmptyState)).toHaveLength(1)
    })
})