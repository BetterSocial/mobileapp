import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import DomainList from '../../Followings/elements/RenderList';
import Loading from '../../Loading';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RenderItem from '../elements/RenderItem';
import RenderNewsScreenItem from '../../../screens/NewsScreen/RenderItem';
import paramBuilder from '../../../utils/navigation/paramBuilder';
import share from '../../../utils/share';
import { Context } from '../../../context/Store'
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';
import { withInteractionsManaged } from '../../../components/WithInteractionManaged';

const NewsFragment = () => {
    const [myId, setMyId] = React.useState('')
    // const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true)
    const [discovery, discoveryDispatch] = React.useContext(Context).discovery
    const [defaultNews] = React.useContext(Context).news

    const navigation = useNavigation()

    const { isLoadingDiscoveryNews, news, isFirstTimeOpen } = discovery

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

    const renderNewsItem = () => {
        if(isFirstTimeOpen) {
            return defaultNews.news.map((item, index) => {
                let onContentClicked = () => {
                    navigation.navigate('DetailDomainScreen', {
                        item: {
                            id: item.id
                        }
                    })
                }

                // Disable on press content if view should be navigated to LinkContextScreen
                if(!item.dummy) return <RenderItem key={`news-screen-item-${index}`} item={item} selfUserId={myId} onPressContent={onContentClicked}/>
            })
        }

        return news.map((item, index) => {
            let contentParam = paramBuilder.newsDiscoveryContentParamBuilder(
                item.title,
                item.image,
                item.description,
                item.news_url,
                item?.newsLinkDomain?.logo ,
                item?.newsLinkDomain?.domain_name || item?.site_name,
                item.createdAt,
                item.news_link_id
            )

            let onContentClicked = () => {
                console.log('item')
                console.log(item)
                navigation.navigate('DetailDomainScreen', {
                    item: {
                        id: item.news_link_id
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
    
    if(isLoadingDiscoveryNews) return <View style={styles.fragmentContainer}><LoadingWithoutModal/></View>
    if(news.length === 0 && !isFirstTimeOpen) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No news found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer} keyboardShouldPersistTaps={'always'}>
        { renderNewsItem() }
    </ScrollView>
}

const styles = StyleSheet.create({
    fragmentContainer: {
        flex: 1,
        backgroundColor: colors.white
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
    unfollowedHeaders: {
        fontFamily: fonts.inter[600],
        marginLeft: 20,
    }
})

export default withInteractionsManaged(NewsFragment)