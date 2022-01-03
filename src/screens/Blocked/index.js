import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Tabbar from '../../components/Tabbar';
import BlockedUserList from './elements/UserScreen';
import BlockedDomainList from './elements/DomainScreen';
import BlockedTopicList from './elements/TopicScreen';

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
    const myTabbar = (tabbarProps) => (
        <Tabbar {...tabbarProps} />
    )
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


export default Blocked