import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import DomainList from '../elements/DiscoveryItemList';
import Header from '../../../screens/DomainScreen/elements/Header';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RenderItemHeader from '../../../screens/DomainScreen/elements/RenderItemHeader';
import StringConstant from '../../../utils/string/StringConstant';
import { COLORS } from '../../../utils/theme';
import { Context } from '../../../context/Store'
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';

const DomainFragment = () => {
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

    console.log(followedDomains)
    console.log(unfollowedDomains)
    
    if(isLoadingDiscovery) return <View style={styles.fragmentContainer}><LoadingWithoutModal/></View>
    if(followedDomains.length === 0 && unfollowedDomains.length ===0) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No Domains found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer}>
        { followedDomains.map((item, index) => {
            return <View key={`domainDiscovery-${index}`} style={styles.domainContainer}>
                <DomainList isDomain={true} item={{
                        name: item.domain_name,
                        image: item.logo,
                        isunfollowed: item.user_id_follower === null,
                        description: item.short_description || ""
                    }}
                    />
            </View>
        })}

        { unfollowedDomains.length > 0 && 
            <View style={styles.unfollowedHeaderContainer}>
                <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreDomains}</Text>
            </View>
        }
        { unfollowedDomains.map((item, index) => {
            return <View key={`domainDiscovery-${index}`} style={styles.domainContainer}>
                 <DomainList isDomain={true} item={{
                        name: item.domain_name,
                        image: item.logo,
                        isunfollowed: item.user_id_follower === null,
                        description: item.short_description || ""
                    }}
                    />
            </View>
        })}
    </ScrollView>
}

const styles = StyleSheet.create({
    domainContainer: {
        paddingVertical: 16,
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