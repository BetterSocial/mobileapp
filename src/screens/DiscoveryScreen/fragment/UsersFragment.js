import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import DiscoveryAction from '../../../context/actions/discoveryAction';
import DomainList from '../elements/DiscoveryItemList';
import Loading from '../../Loading';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import StringConstant from '../../../utils/string/StringConstant';
import { COLORS } from '../../../utils/theme';
import { Context } from '../../../context/Store'
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';
import { setFollow, setUnFollow } from '../../../service/profile';

const FROM_FOLLOWED_USERS = 'fromfollowedusers';
const FROM_UNFOLLOWED_USERS = 'fromunfollowedusers';

const UsersFragment = () => {
    const navigation = useNavigation()
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

    const __handleOnPress = (item) => {
        navigation.push('OtherProfile', {
            data : {
                user_id: myId,
                other_id: item.user_id,
                username: item.username,    
            }
        })
    }

    const __handleFollow = async (from, willFollow, item, index) => {
        if(from === FROM_FOLLOWED_USERS) {
            let newFollowedUsers = [...followedUsers]
            newFollowedUsers[index].user_id_follower = willFollow ? myId : null

            DiscoveryAction.setNewFollowedUsers(newFollowedUsers, discoveryDispatch)
        }

        if(from === FROM_UNFOLLOWED_USERS) {
            let newUnfollowedUsers = [...unfollowedUsers]
            newUnfollowedUsers[index].user_id_follower = willFollow ? myId : null

            DiscoveryAction.setNewUnfollowedUsers(newUnfollowedUsers, discoveryDispatch)
        }

        let data = {
            user_id_follower: myId,
            user_id_followed: item.user_id,
            follow_source: 'discoveryScreen',
        };

        if(willFollow) {
            const result = await setFollow(data);
        } else {
            const result = await setUnFollow(data);
        }
    }

    const __renderDiscoveryItem = (from, key, item, index) => {
        return <DomainList key={`${key}-${index}`} onPressBody={() => __handleOnPress(item)} 
            handleSetFollow={() => __handleFollow(from, true, item, index)}
            handleSetUnFollow={() => __handleFollow(from, false, item, index)}
            item={{
                name: item.username,
                image: item.profile_pic_path,
                isunfollowed: item.user_id_follower === null,
                description: item.bio
        }} />
    }
    
    if(isLoadingDiscovery) return <View style={styles.fragmentContainer}><LoadingWithoutModal/></View>
    if(followedUsers.length === 0 && unfollowedUsers.length ===0) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No users found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer}>
        { followedUsers.map((item, index) => {
            return __renderDiscoveryItem(FROM_FOLLOWED_USERS, "followedUsers", item, index)
        })}

        { unfollowedUsers.length > 0 && 
            <View style={styles.unfollowedHeaderContainer}>
            <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreUsers}</Text>
            </View>}
        { unfollowedUsers.map((item, index) => {
            return __renderDiscoveryItem(FROM_UNFOLLOWED_USERS, "unfollowedUsers", item, index)
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
    unfollowedHeaderContainer: {
        backgroundColor: COLORS.lightgrey,
        height: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    unfollowedHeaders: {
        fontFamily: fonts.inter[600],
        paddingLeft: 24,
    }
})

export default UsersFragment