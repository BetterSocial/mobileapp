import * as React from 'react'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'
import { useRoute } from '@react-navigation/native'

import Card from '../../../src/components/Card/Card'
import ContentLink from '../../../src/screens/FeedScreen/ContentLink'

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useRoute: () => jest.fn()
}))

const og = {
    "date": "2022-06-01T16:49:07.000Z", 
    "description": "Seamlessly integrate with our anonymous, bot-resistant, one-click login to create a safer community for your users.", 
    "domain": "human-id.org", 
    "domainImage": "", 
    "domain_page_id": "66e63a30-1ddd-4aff-8b13-23868b971bf4", 
    "image": "", 
    "news_link_id": "39d39e1d-79e0-4537-8133-e235ced81256", 
    "title": "humanID: One-click, Anonymous Login", 
    "url": "https://human-id.org/"
}

describe('Testing Feed Screen Content Link', () => {
    it('ContentLink Matches Snapshot', () => {
        useRoute().mockReturnValue({
            name: 'FeedScreen'
        })

        const tree = renderer.create(<ContentLink og={og}/>).toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('Card Matches Snapshot', () => {
        useRoute().mockReturnValue({
            name: 'FeedScreen'
        })

        const tree = renderer.create(<Card domain={og.domain} date={og.date} description={og.description} domainImage={og.domainImage} image={og.image} title={og.title} url={og.url}/>).toJSON()
        expect(tree).toMatchSnapshot()
    })
})