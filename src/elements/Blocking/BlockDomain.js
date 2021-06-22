import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';

import ItemListLarge from '../../components/Blocking/ItemListLarge';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const BlockDomain = ({refBlockUser, onSelect, domain}) => {
  const data = [
    {
      id: 1,
      icon: 'block',
      label: `Block ${domain} indefinitely`,
      desc: `You will not be able to see ${domain}’s posts. The domain’s reach will be reduced across BetterSocial, in particular for this link.`,
      iconReght: false,
    },
    {
      id: 2,
      icon: 'handcuffs',
      label: `Block & report ${domain}`,
      desc:
        'This domain is fake, hacked, or involved in criminal activity. You will need to provide additional information to help us take consequences.',
      iconReght: true,
    },
  ];
  return (
    <View>
      <RBSheet
        ref={refBlockUser}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: styles.container,
          draggableIcon: styles.draggableIcon,
        }}>
        <Text style={styles.title}>What do you want to do?</Text>
        <Text style={styles.desc}>
          Blocking a domain will not just remove their link from your feed, but
          also reduce their visibility for all other users.
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

export default BlockDomain;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.inter[600],
    fontSize: 18,
    color: '#000',
    marginLeft: 21,
  },
  desc: {
    color: colors.gray,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    marginHorizontal: 21,
    marginTop: 17,
    marginBottom: 29,
  },

  container: {
    height: 'auto',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  draggableIcon: {
    backgroundColor: colors.alto,
    width: 60,
  },
});
