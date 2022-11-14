/* eslint-disable no-use-before-define */
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import DiscoveryAction from '../../../context/actions/discoveryAction';
import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import DomainList from '../elements/DiscoveryItemList';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RecentSearch from '../elements/RecentSearch';
import StringConstant from '../../../utils/string/StringConstant';
import useIsReady from '../../../hooks/useIsReady';
import { COLORS } from '../../../utils/theme';
import { Context } from '../../../context/Store'
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { getUserId } from '../../../utils/users';
import { setFollow, setUnFollow } from '../../../service/profile';

const FROM_FOLLOWED_USERS = 'fromfollowedusers';
const FROM_FOLLOWED_USERS_INITIAL = 'fromfollowedusersinitial';
const FROM_UNFOLLOWED_USERS = 'fromunfollowedusers';
const FROM_UNFOLLOWED_USERS_INITIAL = 'fromunfollowedusersinitial';

const UsersFragment = ({
    isLoadingDiscoveryUser = false,
    isFirstTimeOpen,
    followedUsers = [],
    setFollowedUsers = () => { },
    unfollowedUsers = [],
    setUnfollowedUsers = () => { },
    setSearchText = () => { },
    setIsFirstTimeOpen = () => { }
}) => {
    const [discovery, discoveryDispatch] = React.useContext(Context).discovery

    const navigation = useNavigation()

    const [myId, setMyId] = React.useState('')
    // const [initialFollowedUsers, setInitialFollowedUsers] = React.useState(
    //     discovery.initialUsers.filter((item) => item.user_id_follower !== null)
    // )

    // const [initialUnfollowedUsers, setInitialUnfollowedUsers] = React.useState(
    //     discovery.initialUsers.filter((item) => item.user_id_follower === null)
    // )

    const isReady = useIsReady()

    const users = discovery.initialUsers

    React.useEffect(() => {
        const parseToken = async () => {
            const id = await getUserId();
            if (id) {
                setMyId(id);
            }
        };
        parseToken();
    }, []);

    const handleOnPress = (item) => {
        navigation.push('OtherProfile', {
            data: {
                user_id: myId,
                other_id: item.user_id,
                username: item.username,
            }
        })
    }

    const handleFollow = async (from, willFollow, item, index) => {
        if (from === FROM_FOLLOWED_USERS_INITIAL) {
            const newFollowedUsers = [...users]
            newFollowedUsers[index].user_id_follower = willFollow ? myId : null
            // const newInitialFollowedUsers = [...initialFollowedUsers]
            // newInitialFollowedUsers[index].user_id_follower = willFollow ? myId : null

            // FollowingAction.setFollowingUsers(newFollowedUsers, followingDispatch)
            DiscoveryAction.setDiscoveryInitialUsers(newFollowedUsers, discoveryDispatch)
            // setInitialFollowedUsers(newInitialFollowedUsers)
        }

        if (from === FROM_UNFOLLOWED_USERS_INITIAL) {
            const newFollowedUsers = [...users]
            newFollowedUsers[index].user_id_follower = willFollow ? myId : null
            // const newInitialUnfollowedUsers = [...initialUnfollowedUsers]
            // newInitialUnfollowedUsers[index].user_id_follower = willFollow ? myId : null

            // FollowingAction.setFollowingUsers(newFollowedUsers, followingDispatch)
            DiscoveryAction.setDiscoveryInitialUsers(newFollowedUsers, discoveryDispatch)
            // setInitialUnfollowedUsers(newInitialUnfollowedUsers)
        }

        if (from === FROM_FOLLOWED_USERS) {
            const newFollowedUsers = [...followedUsers]
            newFollowedUsers[index].user_id_follower = willFollow ? myId : null

            setFollowedUsers(newFollowedUsers)
        }

        if (from === FROM_UNFOLLOWED_USERS) {
            const newUnfollowedUsers = [...unfollowedUsers]
            newUnfollowedUsers[index].user_id_follower = willFollow ? myId : null

            setUnfollowedUsers(newUnfollowedUsers)
        }

        const data = {
            user_id_follower: myId,
            user_id_followed: item.user_id,
            follow_source: 'discoveryScreen',
        };

        console.log('data')
        console.log(data)

        if (willFollow) {
            await setFollow(data);
        } else {
            await setUnFollow(data);
        }
    }

    const renderDiscoveryItem = (from, key, item, index) => <DomainList key={`${key}-${index}`} onPressBody={() => handleOnPress(item)}
        handleSetFollow={() => handleFollow(from, true, item, index)}
        handleSetUnFollow={() => handleFollow(from, false, item, index)}
        item={{
            name: item.username,
            image: item.profile_pic_path,
            isunfollowed: item.user_id_follower === null,
            description: item.bio
        }} />

    const renderUsersItem = () => {
        if (isFirstTimeOpen) {
            // let renderArray = []
            // initialFollowedUsers.map((item, index) => renderArray.push(renderDiscoveryItem(FROM_FOLLOWED_USERS_INITIAL, "followedUsers", item, index)))
            // renderArray.push(<DiscoveryTitleSeparator key="user-title-separator" text="Suggested Users"/>)
            // initialUnfollowedUsers.map((item, index) => renderArray.push(renderDiscoveryItem(FROM_UNFOLLOWED_USERS_INITIAL, "unfollowedUsers", item, index)))

            // return renderArray

            return [<DiscoveryTitleSeparator key="user-title-separator" text="Suggested Users" />].concat(users.map((item, index) =>
                // return renderDiscoveryItem(FROM_FOLLOWED_USERS_INITIAL, "followedUsers", { ...item.user, user_id_follower: item.user_id_follower }, index)
                renderDiscoveryItem(FROM_FOLLOWED_USERS_INITIAL, "followedUsers", item, index)
            ))
        }

        return (
            <>
                {followedUsers.map((item, index) =>
                    renderDiscoveryItem(FROM_FOLLOWED_USERS, "followedUsers", item, index)
                )}

                {unfollowedUsers.length > 0 && followedUsers.length > 0 &&
                    <View style={styles.unfollowedHeaderContainer}>
                        <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreUsers}</Text>
                    </View>}
                {unfollowedUsers.map((item, index) =>
                    renderDiscoveryItem(FROM_UNFOLLOWED_USERS, "unfollowedUsers", item, index)
                )}
            </>
        )
    }

    if (!isReady) return <></>

    if (isLoadingDiscoveryUser) return <View style={styles.fragmentContainer}><LoadingWithoutModal /></View>
    if (followedUsers.length === 0 && unfollowedUsers.length === 0 && !isFirstTimeOpen) return <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No users found</Text>
    </View>

    return <View >
        <RecentSearch shown={isFirstTimeOpen}
            setSearchText={setSearchText}
            setIsFirstTimeOpen={setIsFirstTimeOpen} />
        {renderUsersItem()}
    </View>

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
        marginLeft: 20,
    },
    containerHidden: {
        display: 'none'
    }
})

// export default withInteractionsManaged(UsersFragment)
export default UsersFragment