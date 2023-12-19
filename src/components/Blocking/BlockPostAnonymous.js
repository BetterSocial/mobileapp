import * as React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {StyleSheet, Text, View} from 'react-native';

import ItemListLarge from './ItemListLarge';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const BlockPostAnonymous = ({refBlockPostAnonymous, onSelect}) => {
  const data = [
    {
      id: 1,
      icon: 'block',
      label: "Block user's anonymous post indefinitely",
      desc: 'You won’t see any anonymous posts from this user and the user’s reach will be reduced across BetterSocial, in particular for this post. This action cannot be reversed!',
      iconReght: false
    },
    {
      id: 2,
      icon: 'handcuffs',
      label: 'Block & report this user',
      desc: 'This account is fake, hacked, or involved in criminal activity. You will need to provide additional information to help us take consequences.',
      iconReght: true
    }
  ];
  return (
    <View>
      <RBSheet
        ref={refBlockPostAnonymous}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: styles.container,
          draggableIcon: styles.draggableIcon
        }}>
        <Text style={styles.title}>What do you want to do?</Text>
        <Text style={styles.desc}>
          {
            "Blocking all of this user's anonymous post from your feed will also reduce their visibility for all other posts."
          }
        </Text>
        {data.map((item) => (
          <ItemListLarge
            key={item.id}
            id={item.id}
            label={item.label}
            desc={item.desc}
            iconReght={item.iconReght}
            icon={item.icon}
            onPress={() => onSelect(item.id)}
          />
        ))}
      </RBSheet>
    </View>
  );
};

export default BlockPostAnonymous;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.inter[600],
    fontSize: 18,
    color: '#000',
    marginLeft: 21
  },
  desc: {
    color: colors.gray,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    marginHorizontal: 21,
    marginTop: 17,
    marginBottom: 29
  },
  container: {
    height: 'auto',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  draggableIcon: {
    backgroundColor: colors.alto,
    width: 60
  }
});
