import * as React from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import DomainList from '../../Followings/elements/RenderList';
import Loading from '../../Loading';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RecentSearch from '../elements/RecentSearch';
import RenderItem from '../elements/RenderItem';
import RenderNewsScreenItem from '../../../screens/NewsScreen/RenderItem';
import share from '../../../utils/share';
import useIsReady from '../../../hooks/useIsReady';
import { Context } from '../../../context/Store'
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';
import { newsDiscoveryContentParamBuilder } from '../../../utils/navigation/paramBuilder';
import { withInteractionsManaged } from '../../../components/WithInteractionManaged';

const NewsFragment = () => {
    const [myId, setMyId] = React.useState('')
    const [isRecentSearchTermsShown, setIsRecentSearchTermsShown] = React.useState(true)
    // const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true)
    const [discovery, discoveryDispatch] = React.useContext(Context).discovery
    const [defaultNews] = React.useContext(Context).news

    const isReady = useIsReady()

    const navigation = useNavigation()

    const { isLoadingDiscoveryNews, news, isFirstTimeOpen, isFocus } = discovery

    React.useEffect(() => {
        const parseToken = async () => {
            const id = await getUserId();
            if (id) {
                setMyId(id);
            }
        };
        parseToken();
    }, []);

    // React.useEffect(() => {
    //     if(news.length > 0) setIsFirstTimeOpen(false)
    // }, [news])
    
    const __handleScroll = (event) => {
        Keyboard.dismiss()
    }

    const renderNewsItem = () => {
        if (isFirstTimeOpen) {
            return [<DiscoveryTitleSeparator key="news-title-separator" text="Suggested News" />].concat(defaultNews.news.map((item, index) => {
                let onContentClicked = () => {
                    navigation.navigate('DetailDomainScreen', {
                        item: {
                            id: item.id,
                            score: item.domain.credderScore,
                            follower: 0,
                        }
                    })
                }

                // Disable on press content if view should be navigated to LinkContextScreen
                if (!item.dummy) return <RenderItem key={`news-screen-item-${index}`} item={item} selfUserId={myId} onPressContent={onContentClicked} />
            }))
        }

        return news.map((item, index) => {
            let contentParam = newsDiscoveryContentParamBuilder(
                item.title,
                item.image,
                item.description,
                item.news_url,
                item?.newsLinkDomain?.logo,
                item?.newsLinkDomain?.domain_name || item?.site_name,
                item.createdAt,
                item.news_link_id,
                item?.newsLinkDomain?.credder_score
            )

            let onContentClicked = () => {
                navigation.navigate('DetailDomainScreen', {
                    item: {
                        id: item.post_id,
                        score: item?.newsLinkDomain?.credder_score
                    }
                })
            }

            return <RenderItem key={`newsDiscovery-${index}`}
                selfUserId={myId}
                item={contentParam}
                onPressShare={share.shareNews}
                onPressContent={onContentClicked} />
        })
    }

    if(!isReady) return <></>

    if (isLoadingDiscoveryNews) return <View style={styles.fragmentContainer}><LoadingWithoutModal /></View>
    if (news.length === 0 && !isFirstTimeOpen) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No news found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer} keyboardShouldPersistTaps={'handled'}
        onMomentumScrollBegin={__handleScroll}>
        <RecentSearch shown={isFirstTimeOpen} />
        {renderNewsItem()}
        <View style={styles.padding} />
    </ScrollView>
}

const styles = StyleSheet.create({
    fragmentContainer: {
        flex: 1,
        backgroundColor: colors.concrete,
    },
    noDataFoundContainer: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
    },
    noDataFoundText: {
        alignSelf: 'center',
        justifyContent: 'center',
        fontFamily: fonts.inter[600],
    },
    padding: {
        height: 16,
    },
    unfollowedHeaders: {
        fontFamily: fonts.inter[600],
        marginLeft: 20,
    }
})

export default withInteractionsManaged(NewsFragment)
// export default NewsFragment