import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import DomainList from '../elements/DiscoveryItemList';
import Loading from '../../Loading';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import StringConstant from '../../../utils/string/StringConstant';
import { COLORS } from '../../../utils/theme';
import { Context } from '../../../context/Store'
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';

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
        // console.log(item)
        // console.log(myId)
        navigation.push('OtherProfile', {
            data : {
                user_id: myId,
                other_id: item.user_id,
                username: item.username,    
            }
        })

    }
    
    if(isLoadingDiscovery) return <View style={styles.fragmentContainer}><LoadingWithoutModal/></View>
    if(followedUsers.length === 0 && unfollowedUsers.length ===0) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No users found</Text>
    </View>

    return <ScrollView style={styles.fragmentContainer}>
        { followedUsers.map((item, index) => {
            return <DomainList key={`followedUsers-${index}`} onPressBody={() => __handleOnPress(item)} item={{
                name: item.username,
                image: item.profile_pic_path,
                isunfollowed: item.user_id_follower === null,
                description: item.bio
            }} />
        })}

        { unfollowedUsers.length > 0 && 
            <View style={styles.unfollowedHeaderContainer}>
            <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreUsers}</Text>
            </View>}
        { unfollowedUsers.map((item, index) => {
            return <DomainList key={`unfollowedUsers-${index}`} onPressBody={() => __handleOnPress(item)} item={{
                name: item.username,
                image: item.profile_pic_path,
                isunfollowed: item.user_id_follower === null,
                description: item.bio
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