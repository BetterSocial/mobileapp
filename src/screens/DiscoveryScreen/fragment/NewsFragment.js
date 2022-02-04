import * as React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { Context } from '../../../context/Store'
import DomainList from '../../Followings/elements/RenderList';
import Loading from '../../Loading';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RenderItem from '../../NewsScreen/RenderItem';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';
import share from '../../../utils/share';

const NewsFragment = () => {
    const [myId, setMyId] = React.useState('')
    const [discovery, discoveryDispatch] = React.useContext(Context).discovery
    const { isLoadingDiscovery, news } = discovery

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
    if(news.length  ===0) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No news found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer}>
        { news.map((item, index) => {
            return <RenderItem key={`newsDiscovery-${index}`} 
                selfUserId={myId}    
                item={item}
                onPressShare={share.shareNews} />
        })}
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
        marginLeft: 24,
    }
})

export default NewsFragment