import * as React from 'react';
import Animated from 'react-native-reanimated';
import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import DomainFragment from './fragment/DomainFragment';
import DomainList from '../Followings/elements/RenderList';
import Followings from '../Followings';
import NewsFragment from './fragment/NewsFragment';
import Search from './elements/Search';
import StringConstant from '../../utils/string/StringConstant';
import TopicFragment from './fragment/TopicFragment';
import UsersFragment from './fragment/UsersFragment';
import {DEFAULT_PROFILE_PIC_PATH, DISCOVERY_TAB_DOMAINS, DISCOVERY_TAB_NEWS, DISCOVERY_TAB_TOPICS, DISCOVERY_TAB_USERS} from '../../utils/constants';
import { FONTS } from '../../utils/theme';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

const DiscoveryScreen = ({ route }) => {
    const [search, setSearch] = React.useState("")
    const offset = React.useRef(new Animated.Value(0)).current
    const { tab } = route.params

    let initialRouteName = tab || DISCOVERY_TAB_USERS

    const Tabs = createMaterialTopTabNavigator()    

    function MyTabBar(props) {
        let {state, descriptors, navigation, position} = props
        return (
            <View style={S.toptabcontainer}>
                {state.routes.map((route, index) => {
                    const {options} = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;
        
                    const isFocused = state.index === index;
        
                    const onPress = () => {
                        const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                        });
        
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };
        
                    const inputRange = state.routes.map((_, i) => i);
                    const opacity = Animated.interpolateNode(position, {
                        inputRange,
                        outputRange: inputRange.map((i) => (i === index ? 1 : 0.3)),
                    });
    
                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? {selected: true} : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            style={S.singletab}>
                            <Animated.Text style={{opacity, ...S.singletabtext}}>
                                {label}
                            </Animated.Text>
                            <View style={isFocused ? S.viewborderbottom : {}} />
                        </TouchableOpacity>
                    );
                })}
            </View>
            );
    }

    const tabComponent = (tabProps) => {
        return <MyTabBar {...tabProps} />
    }

    return(
        <View style={{flex: 1}}>
            <StatusBar translucent={false} />
            <Tabs.Navigator
                initialRouteName={initialRouteName}
                tabBar={tabComponent} >
                <Tabs.Screen
                    name={DISCOVERY_TAB_USERS}
                    component={UsersFragment}
                    options={{
                        title: 'Users',
                    }} />
                <Tabs.Screen
                    name={DISCOVERY_TAB_TOPICS}
                    component={TopicFragment}
                    options={{
                        title: 'Topics',
                    }} />
                <Tabs.Screen
                    name={DISCOVERY_TAB_DOMAINS}
                    component={DomainFragment}
                    options={{
                        title: 'Domains',
                    }} />
                {/* <Tabs.Screen
                    name={DISCOVERY_TAB_NEWS}
                    component={NewsFragment}
                    options={{
                        title: 'News',
                    }} /> */}
            </Tabs.Navigator>
        </View>
        
)}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingTop: 60
    },
    sectionTitle : {
        paddingHorizontal: 24,
        paddingVertical: 4,
        fontFamily: fonts.inter[600]
    }
})

const S = StyleSheet.create({
    container: {
        paddingHorizontal: 22,
        paddingVertical: 20,
        display: 'flex',
        flexDirection: 'column',
    },

    containertitle: {
        fontSize: 16,
    },

    toptabcontainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        // borderBottomColor: '#00000050',
        // borderBottomWidth: 1,
        paddingHorizontal: 4,
    },

    singletab: {
        flex: 1,
        paddingLeft: 16,
    },

    singletabtext: {
        fontFamily: fonts.inter[500],
        textAlign: 'left',
        fontSize: 14,
        paddingVertical: 15,
    },

    viewborderbottom: {
        borderBottomColor: colors.holytosca,
        borderBottomWidth: 1,
        width: '60%',
    },
});

export default DiscoveryScreen