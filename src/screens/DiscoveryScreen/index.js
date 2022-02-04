import * as React from 'react';

import {Animated, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';

import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import DomainList from '../Followings/elements/RenderList';
import { FONTS } from '../../utils/theme';
import Search from './elements/Search';
import StringConstant from '../../utils/string/StringConstant';
import { fonts } from '../../utils/fonts';

const DiscoveryScreen = () => {
    const [search, setSearch] = React.useState("")

    const offset = React.useRef(new Animated.Value(0)).current
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

    return(
        <View>
            <Search animatedValue={offset} 
                showBackButton 
                value={search} 
                onChangeText={(text) => setSearch(text)}/>
            <ScrollView>
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
            </ScrollView>
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

export default DiscoveryScreen