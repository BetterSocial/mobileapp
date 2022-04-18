import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Tabbar from '../../components/Tabbar';
import BlockedUserList from './elements/UserScreen';
import BlockedDomainList from './elements/DomainScreen';
import BlockedTopicList from './elements/TopicScreen';
import {showHeaderProfile} from '../../context/actions/setMyProfileAction'
import {Context} from '../../context';
import useIsReady from '../../hooks/useIsReady';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
const styles = StyleSheet.create({
    containerTab: {
        flex: 1
    }
})

const Blocked = (props) => {
    const {navigation} = props
    const TAB_BLOCKED_USER = 'tabBlockedUser'
    const TAB_BLOCKED_DOMAIN = 'tabBlockedDomain'
    const TAB_BLOCKED_TOPIC = 'tabBlockedTopic'
    const Tabs = createMaterialTopTabNavigator();
    const [, dispatchNavbar] = React.useContext(Context).profile
    const isReady = useIsReady()
    const myTabbar = (tabbarProps) => (
        <Tabbar {...tabbarProps} />
    )

    React.useEffect(() => {
        navigation.addListener('focus', () => {
            showHeaderProfile(true, dispatchNavbar)
        })
        navigation.addListener('blur', () => {
            showHeaderProfile(false, dispatchNavbar)
        })
    }, [])

    if(!isReady) return null

    return (
        <View style={styles.containerTab} >
                  <Tabs.Navigator
        initialRouteName={TAB_BLOCKED_USER}
        tabBar={myTabbar}
        
        >
            <Tabs.Screen 
            name={TAB_BLOCKED_USER}
            component={BlockedUserList}
            options={{
                title: 'User',
              }}
            />
            <Tabs.Screen 
            name={TAB_BLOCKED_DOMAIN}
            component={BlockedDomainList}
            options={{
                title: 'Domain',
              }}
            />
            <Tabs.Screen 
            name={TAB_BLOCKED_TOPIC}
            component={BlockedTopicList}
            options={{
                title: 'Topic',
              }}
            />
        </Tabs.Navigator>
        </View>
    )
}


export default withInteractionsManaged (Blocked)