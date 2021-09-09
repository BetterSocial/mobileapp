import * as React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';

import ButtonAddParticipants from '../../components/Button/ButtonAddParticipants';
import HeaderContact from '../../components/Header/HeaderContact';
import {ProfileContact} from '../../components/Items';
import {Context} from '../../context';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import EditGroup from './elements/EditGroup';

const width = Dimensions.get('screen').width;
const VIEW_TYPE_DATA = 2;

const GroupSetting = ({navigation}) => {
  const [groupName, setGroupName] = React.useState('Set Group Name');
  const [groupChatState] = React.useContext(Context).groupChat;
  const {participants} = groupChatState;
  const [countUser] = React.useState(Object.entries(participants).length);
  const [layoutProvider, setLayoutProvider] = React.useState(() => {});
  const [dataProvider, setDataProvider] = React.useState(null);
  const [isRecyclerViewShown, setIsRecyclerViewShown] = React.useState(false);

  React.useEffect(() => {
    if (dataProvider) {
      setIsRecyclerViewShown(true);
    }
  }, [dataProvider]);
  React.useEffect(() => {
    if (participants.length > 0) {
      let dProvider = new DataProvider((row1, row2) => row1 !== row2);
      setLayoutProvider(
        new LayoutProvider(
          (index) => {
            if (participants.length < 1) {
              return 0;
            }
            return VIEW_TYPE_DATA;
          },
          (type, dim) => {
            switch (type) {
              case VIEW_TYPE_DATA:
                dim.width = width;
                dim.height = 76;
                break;

              default:
                dim.width = width;
                dim.height = 0;
            }
          },
        ),
      );
      setDataProvider(dProvider.cloneWithRows(participants));
    }
  }, [participants]);

  const rowRenderer = (type, item) => {
    return (
      <ProfileContact fullname={item.username} photo={item.profile_pic_path} />
    );
  };
  return (
    <View style={styles.container}>
      <HeaderContact
        title={'Settings'}
        containerStyle={styles.containerHeader}
        subTitle={'Skip'}
        subtitleStyle={styles.subtitleStyle}
        onPressSub={() => {}}
        onPress={() => navigation.goBack()}
      />
      <EditGroup
        editName={groupName}
        setEditName={(text) => setGroupName(text)}
      />
      <View style={styles.users}>
        <Text style={styles.countUser}>Participants {countUser}</Text>
        {isRecyclerViewShown && (
          <RecyclerListView
            layoutProvider={layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={rowRenderer}
          />
        )}
      </View>
      <ButtonAddParticipants />
    </View>
  );
};

export default GroupSetting;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  subtitleStyle: {
    color: COLORS.holyTosca,
  },
  containerHeader: {marginLeft: 22, marginRight: 20},
  users: {
    paddingTop: 12,
  },
  countUser: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 16.94,
    color: COLORS.holytosca,
    marginLeft: 20,
    marginBottom: 4,
  },
});
