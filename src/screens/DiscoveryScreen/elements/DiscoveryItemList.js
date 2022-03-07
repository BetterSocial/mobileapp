import PropTypes from 'prop-types';
import React from 'react'
import { Image, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'

import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';

// data needed name, description, image
const styles = StyleSheet.create({
    buttonFollow: {
        width: 88,
        height: 36,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: colors.bondi_blue,
      },
      textButtonFollowing: {
        fontFamily: fonts.inter[600],
        fontWeight: 'bold',
        fontSize: 12,
        color: colors.bondi_blue,
      },
      textButtonFollow: {
        fontFamily: fonts.inter[600],
        fontWeight: 'bold',
        fontSize: 12,
        color: colors.white,
      },
      profilepicture: {
        width: 48,
        height: 48,
        // backgroundColor: colors.bondi_blue,
        borderRadius: 24,
        resizeMode: 'cover',
        borderColor: colors.lightgrey,
        borderWidth: 1,
      },
      wrapProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        flex: 1,
        marginEnd: 16,
      },
      imageProfile: {
        width: 48,
        height: 48,
        borderRadius: 48,
      },
      wrapTextProfile: {
        marginLeft: 12,
        flexDirection: 'column',
        flex: 1,
        // justifyContent: 'space-between',
      },
      textProfileUsername: {
        fontFamily: fonts.inter[500],
        fontWeight: 'bold',
        fontSize: 14,
        color: colors.black,
        lineHeight: 16.94,
        // backgroundColor: 'red',
      },
      textProfileFullName: {
        fontFamily: fonts.inter[400],
        fontSize: 12,
        color: colors.gray,
        flexWrap: 'wrap',
        lineHeight: 18,
        // backgroundColor: 'green',
        marginTop: 4,
      },
      buttonFollowing: {
        width: 88,
        height: 36,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.bondi_blue,
        borderRadius: 8,
      },
      card: {
        height: 64,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        // backgroundColor: 'red'
        // marginVertical: 10,
      },
})

const DomainList = (props) => {
    const {onPressList, item, isHashtag, handleSetFollow, handleSetUnFollow, onPressBody} = props

    const handlePress = (event) => {
        event.preventDefault();
        onPressList(item)
    }

    return (
        <TouchableNativeFeedback
          onPress={handlePress}>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => onPressBody(item)} style={styles.wrapProfile}>
              {!isHashtag ? <React.Fragment>
                {item.image  ? <Image
                source={{
                  uri: item.image,
                }}
                style={styles.profilepicture}
                width={48}
                height={48}
              />  :  <View style={styles.profilepicture} />}
              </React.Fragment> : null}
              
              <View style={styles.wrapTextProfile}>
                <Text style={styles.textProfileUsername}>
                  {isHashtag && "#"}{item.name}
                </Text>

                { item.description && <Text
                  style={styles.textProfileFullName}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}>
                  {item.description ? item.description : ''}
                </Text> }
              </View>
            </TouchableOpacity>
            {item.isunfollowed ? (
              <TouchableNativeFeedback onPress={handleSetFollow}>
                <View style={styles.buttonFollow}>
                  <Text style={styles.textButtonFollow}>Follow</Text>
                </View>
              </TouchableNativeFeedback>
            ) : (
              <TouchableNativeFeedback onPress={handleSetUnFollow}>
                <View style={styles.buttonFollowing}>
                  <Text style={styles.textButtonFollowing}>Following</Text>
                </View>
              </TouchableNativeFeedback>
            )}
        </View>
      </TouchableNativeFeedback>
    )
}

DomainList.propTypes = {
    item: PropTypes.object,
    onPressList: PropTypes.func,
    isHashtag: PropTypes.bool,
    onPressBody: PropTypes.func
}

DomainList.defaultProps = {
  onPressList: () => null,
  handleSetFollow: () => null,
  handleSetUnFollow: () => null,
  onPressBody: () => null
}

export default DomainList