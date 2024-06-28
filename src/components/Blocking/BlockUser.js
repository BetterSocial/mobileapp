import * as React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {StyleSheet, Text, View} from 'react-native';

import ItemListLarge from './ItemListLarge';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';

const BlockUser = ({
  refBlockUser,
  onSelect,
  username,
  onClose = () => {},
  onBlockUserIndefinitely = () => {},
  onBlockAndReportUser = () => {}
}) => {
  const data = [
    {
      id: 1,
      icon: 'block',
      label: `Block ${username} indefinitely`,
      desc: 'You will not be able to see each other’s posts, or message each other. The user’s reach will be reduced across Helio, in particular for this post.',
      iconReght: false
    },
    {
      id: 2,
      icon: 'handcuffs',
      label: `Block & report ${username}`,
      desc: 'This account is fake, hacked, or involved in criminal activity. You will need to provide additional information to help us take consequences.',
      iconReght: true
    }
  ];

  const onBlockClicked = (item) => {
    if (item.id === 1) {
      onBlockUserIndefinitely();
    } else if (item.id === 2) {
      onBlockAndReportUser();
    }

    onSelect(item?.id);
  };

  return (
    <View>
      <RBSheet
        ref={refBlockUser}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={onClose}
        customStyles={{
          wrapper: {
            backgroundColor: COLORS.black80
          },
          container: styles.container,
          draggableIcon: styles.draggableIcon
        }}>
        <Text style={styles.title}>What do you want to do?</Text>
        <Text style={styles.desc}>
          Blocking a user will not just remove their post from your feed, but also reduce their
          visibility for all other users.
        </Text>
        {data.map((item, index) => (
          <ItemListLarge
            key={item.id}
            id={item.id}
            label={item.label}
            desc={item.desc}
            iconReght={item.iconReght}
            icon={item.icon}
            onPress={() => onBlockClicked(item)}
          />
        ))}
      </RBSheet>
    </View>
  );
};

export default BlockUser;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.inter[600],
    fontSize: 18,
    color: COLORS.black,
    marginLeft: 21
  },
  desc: {
    color: COLORS.gray410,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    marginHorizontal: 21,
    marginTop: 17,
    marginBottom: 29
  },
  container: {
    height: 'auto',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: COLORS.almostBlack
  },
  draggableIcon: {
    backgroundColor: COLORS.gray110,
    width: 60
  }
});
