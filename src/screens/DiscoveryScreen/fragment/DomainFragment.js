import * as React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { Context } from '../../../context/Store'
import Header from '../../../screens/DomainScreen/elements/Header';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RenderItemHeader from '../../../screens/DomainScreen/elements/RenderItemHeader';
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
    
    if(isLoadingDiscovery) return <View style={styles.fragmentContainer}><LoadingWithoutModal/></View>
    if(followedDomains.length === 0 && unfollowedDomains.length ===0) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No Domains found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer}>
        { followedDomains.map((item, index) => {
            return <View key={`domainDiscovery-${index}`} style={styles.domainContainer}>
                <RenderItemHeader image={item.logo} 
                    item={{ domain: { name : item.domain_name } , time: new Date().toUTCString()}} 
                    follow={item.user_id_follower !== null} />
            </View>
        })}

        { unfollowedDomains.length > 0 && <Text style={styles.unfollowedHeaders}>Unfollowed Domains</Text>}
        { unfollowedDomains.map((item, index) => {
            return <View key={`domainDiscovery-${index}`} style={styles.domainContainer}>
                <RenderItemHeader image={item.logo} 
                    item={{ domain: { name : item.domain_name } , time: new Date().toUTCString()}} 
                    follow={item.user_id_follower !== null} />
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
    unfollowedHeaders: {
        fontFamily: fonts.inter[600],
        marginLeft: 24,
    }
})

export default DomainFragment