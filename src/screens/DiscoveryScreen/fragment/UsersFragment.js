import * as React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { Context } from '../../../context/Store'
import DomainList from '../../Followings/elements/RenderList';
import Loading from '../../Loading';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';

const UsersFragment = () => {
    const [myId, setMyId] = React.useState('')
    const [discovery, discoveryDispatch] = React.useContext(Context).discovery
    const { isLoadingDiscovery, followedUsers, unfollowedUsers } = discovery

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
    if(followedUsers.length === 0 && unfollowedUsers.length ===0) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No users found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer}>
        { followedUsers.map((item, index) => {
            return <DomainList key={`followedUsers-${index}`} item={{
                name: item.username,
                image: item.profile_pic_path,
                isunfollowed: item.user_id_follower === null,
            }} />
        })}

        { unfollowedUsers.length > 0 && <Text style={styles.unfollowedHeaders}>Unfollowed Users</Text>}
        { unfollowedUsers.map((item, index) => {
            return <DomainList key={`followedUsers-${index}`} item={{
                name: item.username,
                image: item.profile_pic_path,
                isunfollowed: item.user_id_follower === null
            }} />
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

export default UsersFragment