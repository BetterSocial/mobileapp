import * as React from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import DiscoveryAction from '../../../context/actions/discoveryAction';
import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import DomainList from '../elements/DiscoveryItemList';
import FollowingAction from '../../../context/actions/following';
import Header from '../../../screens/DomainScreen/elements/Header';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RecentSearch from '../elements/RecentSearch';
import RenderItemHeader from '../../../screens/DomainScreen/elements/RenderItemHeader';
import StringConstant from '../../../utils/string/StringConstant';
import { COLORS } from '../../../utils/theme';
import { Context } from '../../../context/Store'
import { colors } from '../../../utils/colors';
import { followDomain, unfollowDomain } from '../../../service/domain';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';
import { withInteractionsManaged } from '../../../components/WithInteractionManaged';

const FROM_FOLLOWED_DOMAIN = 'fromfolloweddomains';
const FROM_FOLLOWED_DOMAIN_INITIAL = 'fromfolloweddomainsinitial';
const FROM_UNFOLLOWED_DOMAIN = 'fromunfolloweddomains';

const DomainFragment = () => {
    const navigation = useNavigation()
    const [myId, setMyId] = React.useState('')
    // const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true)
    const [discovery, discoveryDispatch] = React.useContext(Context).discovery
    const [following, followingDispatch] = React.useContext(Context).following

    const { domains } = following
    const { isLoadingDiscoveryDomain, followedDomains, unfollowedDomains, isFirstTimeOpen } = discovery

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
    //     if(followedDomains.length > 0 || unfollowedDomains.length > 0) setIsFirstTimeOpen(false)
    // },[ followedDomains, unfollowedDomains ])

    const __handleOnPressDomain = (item) => {
        let navigationParam = {
            item: {
                content: {
                    domain_page_id: item.domain_page_id
                },
                domain: {
                    image: item.logo
                },
                og: {
                    domain: item.domain_name,
                    domainImage: item.logo,
                }
            }
        }

        navigation.push('DomainScreen', navigationParam)
    }

    const __handleScroll = (event) => {
        Keyboard.dismiss()
    }

    const __handleFollow = async (from, willFollow, item, index) => {
        // console.log(item)
        if (from === FROM_FOLLOWED_DOMAIN_INITIAL) {
            let newFollowedDomains = [...domains]
            newFollowedDomains[index].user_id_follower = willFollow ? myId : null

            FollowingAction.setFollowingDomain(newFollowedDomains, followingDispatch)
        }
        if (from === FROM_FOLLOWED_DOMAIN) {
            let newFollowedDomains = [...followedDomains]
            newFollowedDomains[index].user_id_follower = willFollow ? myId : null

            DiscoveryAction.setNewFollowedDomains(newFollowedDomains, discoveryDispatch)
        }

        if (from === FROM_UNFOLLOWED_DOMAIN) {
            let newUnfollowedDomains = [...unfollowedDomains]
            newUnfollowedDomains[index].user_id_follower = willFollow ? myId : null

            DiscoveryAction.setNewUnfollowedDomains(newUnfollowedDomains, discoveryDispatch)
        }

        let data = {
            domainId: item.domain_page_id,
            source: 'discoveryScreen',
        };

        if (willFollow) {
            const res = await followDomain(data);
        } else {
            const res = await unfollowDomain(data);
        }
    }

    const __renderDiscoveryItem = (from, key, item, index) => {
        return <View key={`${key}-${index}`} style={styles.domainContainer}>
            <DomainList isDomain={true}
                onPressBody={() => __handleOnPressDomain(item)}
                handleSetFollow={() => __handleFollow(from, true, item, index)}
                handleSetUnFollow={() => __handleFollow(from, false, item, index)}
                item={{
                    name: item.domain_name,
                    image: item.logo,
                    isunfollowed: item.user_id_follower === null,
                    description: item.short_description || null
                }}
            />
        </View>
    }

    const __renderDomainItems = () => {
        if (isFirstTimeOpen) return [<DiscoveryTitleSeparator text="Suggested Domains" key="domain-title-separator" />].concat(domains.map((item, index) => {
            return __renderDiscoveryItem(FROM_FOLLOWED_DOMAIN_INITIAL, "followedDomainDiscovery", { ...item, user_id_follower: item.user_id_follower }, index)
        }))

        return (
            <>
                {followedDomains.map((item, index) => {
                    return __renderDiscoveryItem(FROM_FOLLOWED_DOMAIN, "followedDomainDiscovery", item, index)
                })}

                {unfollowedDomains.length > 0 && followedDomains.length > 0 &&
                    <View style={styles.unfollowedHeaderContainer}>
                        <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreDomains}</Text>
                    </View>}
                {unfollowedDomains.map((item, index) => {
                    return __renderDiscoveryItem(FROM_UNFOLLOWED_DOMAIN, "unfollowedDomainDiscovery", item, index)
                })}
            </>
        )
    }

    if (isLoadingDiscoveryDomain) return <View style={styles.fragmentContainer}><LoadingWithoutModal /></View>
    if (followedDomains.length === 0 && unfollowedDomains.length === 0 && !isFirstTimeOpen) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No Domains found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer} keyboardShouldPersistTaps={'handled'}
        onMomentumScrollBegin={__handleScroll}>
        <RecentSearch shown={isFirstTimeOpen} />
        {__renderDomainItems()}
    </ScrollView>
}

const styles = StyleSheet.create({
    domainContainer: {
        // paddingVertical: 16,
    },
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
    unfollowedHeaderContainer: {
        backgroundColor: COLORS.lightgrey,
        height: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    unfollowedHeaders: {
        fontFamily: fonts.inter[600],
        marginLeft: 20,
    }
})

export default withInteractionsManaged(DomainFragment)