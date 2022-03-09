import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import DiscoveryAction from '../../../context/actions/discoveryAction';
import DomainList from '../elements/DiscoveryItemList';
import Header from '../../../screens/DomainScreen/elements/Header';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RenderItemHeader from '../../../screens/DomainScreen/elements/RenderItemHeader';
import StringConstant from '../../../utils/string/StringConstant';
import { COLORS } from '../../../utils/theme';
import { Context } from '../../../context/Store'
import { colors } from '../../../utils/colors';
import { followDomain, unfollowDomain } from '../../../service/domain';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';

const FROM_FOLLOWED_DOMAIN = 'fromfolloweddomains';
const FROM_UNFOLLOWED_DOMAIN = 'fromunfolloweddomains';

const DomainFragment = () => {
    const navigation = useNavigation()
    const [myId, setMyId] = React.useState('')
    const [discovery, discoveryDispatch] = React.useContext(Context).discovery
    const { isLoadingDiscovery, followedDomains, unfollowedDomains } = discovery

    React.useEffect(() => {
        const parseToken = async () => {
            const id = await getUserId();
                if (id) {
                setMyId(id);
            }
        };
        parseToken();
    }, []);

    const __handleOnPressDomain = (item) => {
        console.log(item)
        let navigationParam = {
            item: {
                content : {
                    domain_page_id : item.domain_page_id
                },
                domain: {
                    image: item.logo
                },
                og: {
                    domain : item.domain_name,
                    domainImage: item.logo,
                }    
            }
        }

        navigation.push('DomainScreen', navigationParam)
    }

    const __handleFollow = async (from, willFollow, item, index) => {
        // console.log(item)
        if(from === FROM_FOLLOWED_DOMAIN) {
            let newFollowedDomains = [...followedDomains]
            newFollowedDomains[index].user_id_follower = willFollow ? myId : null

            DiscoveryAction.setNewFollowedDomains(newFollowedDomains, discoveryDispatch)
        }

        if(from === FROM_UNFOLLOWED_DOMAIN) {
            let newUnfollowedDomains = [...unfollowedDomains]
            newUnfollowedDomains[index].user_id_follower = willFollow ? myId : null

            DiscoveryAction.setNewUnfollowedDomains(newUnfollowedDomains, discoveryDispatch)
        }

        let data = {
            domainId: item.domain_page_id,
            source: 'discoveryScreen',
        };

        console.log('data')
        console.log(data)
        if(willFollow) {
            const res = await followDomain(data);
            console.log(res)
        } else {
            const res = await unfollowDomain(data);
            console.log(res)
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
    
    if(isLoadingDiscovery) return <View style={styles.fragmentContainer}><LoadingWithoutModal/></View>
    if(followedDomains.length === 0 && unfollowedDomains.length ===0) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No Domains found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer}>
        { followedDomains.map((item, index) => {
            return __renderDiscoveryItem(FROM_FOLLOWED_DOMAIN, `followedDomainDiscovery`, item, index)
            // return <View key={`domainDiscovery-${index}`} style={styles.domainContainer}>
            //     <DomainList isDomain={true} 
            //         onPressBody={() => __handleOnPressDomain(item)}
            //         item={{
            //             name: item.domain_name,
            //             image: item.logo,
            //             isunfollowed: item.user_id_follower === null,
            //             description: item.short_description || null
            //         }}
            //         />
            // </View>
        })}

        { unfollowedDomains.length > 0 && 
            <View style={styles.unfollowedHeaderContainer}>
                <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreDomains}</Text>
            </View>
        }
        { unfollowedDomains.map((item, index) => {
            return __renderDiscoveryItem(FROM_UNFOLLOWED_DOMAIN, `unfollowedDomainDiscovery`, item, index)
        //     return <View key={`domainDiscovery-${index}`} style={styles.domainContainer}>
        //          <DomainList isDomain={true} 
        //             onPressBody={() => __handleOnPressDomain(item)}
        //             item={{
        //                 name: item.domain_name,
        //                 image: item.logo,
        //                 isunfollowed: item.user_id_follower === null,
        //                 description: item.short_description || null
        //             }}
        //             />
        //     </View>
        })}
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
        marginLeft: 24,
    }
})

export default DomainFragment