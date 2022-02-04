import * as React from 'react';

import {DEFAULT_PROFILE_PIC_PATH, DISCOVERY_TAB_DOMAINS, DISCOVERY_TAB_NEWS, DISCOVERY_TAB_TOPICS, DISCOVERY_TAB_USERS} from '../../utils/constants';
import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Animated from 'react-native-reanimated';
import DomainFragment from './fragment/DomainFragment';
import DomainList from '../Followings/elements/RenderList';
import { FONTS } from '../../utils/theme';
import Followings from '../Followings';
import NewsFragment from './fragment/NewsFragment';
import Search from './elements/Search';
import StringConstant from '../../utils/string/StringConstant';
import TopicFragment from './fragment/TopicFragment';
import UsersFragment from './fragment/UsersFragment';
import { colors } from '../../utils/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { fonts } from '../../utils/fonts';

const DiscoveryScreen = () => {
    const [search, setSearch] = React.useState("")
    const offset = React.useRef(new Animated.Value(0)).current

    const Tabs = createMaterialTopTabNavigator()    

    const users = [
        { name: "Usupsuparma", description: '', image: DEFAULT_PROFILE_PIC_PATH },
        { name: "Fajarism", description: '', image: DEFAULT_PROFILE_PIC_PATH },
        { name: "Agita", description: '', image: DEFAULT_PROFILE_PIC_PATH },
        { name: "Busan", description: '', image: DEFAULT_PROFILE_PIC_PATH },
        { name: "Bastian", description: '', image: DEFAULT_PROFILE_PIC_PATH },
    ]

    const domains = [
        { name: "politico.eu", description: '', image: "https://www.politico.eu/wp-content/themes/politico-new/assets/images/politico-billboard.png" },
        { name: "kumparan.com", description: '', image: "https://blue.kumparan.com/image/upload/v1486023171/logo-1200_yos3so.jpg" },
        { name: "bola.com", description: '', image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Stiker_Bolacom_%28cropped%29.png" },
        // { name: "Busan", description: '', image: DEFAULT_PROFILE_PIC_PATH },
        // { name: "Bastian", description: '', image: DEFAULT_PROFILE_PIC_PATH },
    ]

    const topics = [
        { name: "Bali", description: '', image: DEFAULT_PROFILE_PIC_PATH },
        { name: "Tari Kecak", description: '', image: DEFAULT_PROFILE_PIC_PATH },
        { name: "Pizza Tower", description: '', image: DEFAULT_PROFILE_PIC_PATH },
        { name: "Minecraft", description: '', image: DEFAULT_PROFILE_PIC_PATH },
        { name: "Free Fire", description: '', image: DEFAULT_PROFILE_PIC_PATH },
    ]

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
                initialRouteName={DISCOVERY_TAB_USERS}
                tabBar={tabComponent} >
                <Tabs.Screen
                    name={DISCOVERY_TAB_USERS}
                    component={UsersFragment}
                    options={{
                        title: 'Users',
                    }} />
                <Tabs.Screen
                    name={DISCOVERY_TAB_DOMAINS}
                    component={DomainFragment}
                    options={{
                        title: 'Domains',
                    }} />
                <Tabs.Screen
                    name={DISCOVERY_TAB_NEWS}
                    component={NewsFragment}
                    options={{
                        title: 'News',
                    }} />
                <Tabs.Screen
                    name={DISCOVERY_TAB_TOPICS}
                    component={TopicFragment}
                    options={{
                        title: 'Topics',
                    }} />
            </Tabs.Navigator>
            {/* <ScrollView>
                <View style={styles.container}>
                    <StatusBar translucent={false} />
                    <Text style={styles.sectionTitle}>People</Text>
                    { users.map((item, index) => {
                        return <DomainList key={`discovery-user-${index}`} item={item} />
                    })}

                    <Text style={styles.sectionTitle}>Domain</Text>
                    { domains.map((item, index) => {
                        return <DomainList key={`discovery-user-${index}`} item={item} />
                    })}
                    <Text style={styles.sectionTitle}>Topic</Text>
                    { topics.map((item, index) => {
                        return <DomainList 
                            // onPressBody={onPressBody} 
                            // handleSetFollow={() => handleFollow(index, item)} 
                            // handleSetUnFollow={() => handleUnfollow(index, item)} 
                            isHashtag 
                            item={item} />
                    })}
                </View>
            </ScrollView> */}
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
        borderBottomColor: '#00000050',
        borderBottomWidth: 1,
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
        paddingVertical: 10,
    },

    viewborderbottom: {
        borderBottomColor: colors.holytosca,
        borderBottomWidth: 1,
    },
});

export default DiscoveryScreen