import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const UserInfo = ({ photo, username, bio }) => <View style={styles.cardLeft}>
    <Image
        style={styles.tinyLogo}
        source={{
            uri: photo,
        }}
    />
    <View style={styles.containerTextCard}>
        <Text style={styles.textFullName}>{username}</Text>
        <Text style={styles.textUsername} numberOfLines={1}>{bio || ''}</Text>
    </View>
</View>

const styles = StyleSheet.create({
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    tinyLogo: {
        width: 48,
        height: 48,
        borderRadius: 48,
    },
    containerTextCard: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 8,
        flex: 1,
    },
    textFullName: {
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#000000',
        lineHeight: 21,
        alignSelf: 'flex-start',
    },
    textUsername: {
        fontSize: 14,
        color: '#000000',
        lineHeight: 21,
        alignSelf: 'flex-start',
        width: '100%',
        marginRight: 16,
    },
})

export default UserInfo