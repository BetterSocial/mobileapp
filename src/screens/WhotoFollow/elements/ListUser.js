import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import ItemUser from './ItemUser';
import Label from './Label';

function compire(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
const MemoItemUser = React.memo(ItemUser, compire);

const ListUser = ({users, followed, onPress}) => {
  return (
    <View>
      {users !== undefined &&
        users.length > 0 &&
        users.map((value, index) => {
          if (value.name === 'topic') {
            return (
              <View key={index}>
                {value.data.map((val, idx) => {
                  return (
                    <View key={idx}>
                      <Label label={val.name} />
                      <FlatList
                        style={styles.flatList}
                        data={val.users}
                        renderItem={({item}) => (
                          <MemoItemUser
                            photo={item.profile_pic_path}
                            bio={item.bio}
                            username={item.username}
                            followed={followed.includes(item.user_id)}
                            onPress={() => onPress(item.user_id)}
                          />
                        )}
                        listKey={(item) => item.user_id + 'topic'}
                        keyExtractor={(item) => item.user_id + 'topic'}
                      />
                    </View>
                  );
                })}
              </View>
            );
          } else if (value.name === 'location') {
            return (
              <View key={index}>
                {value.data.map((val, idx) => {
                  return (
                    <View key={idx}>
                      <Label label={val.neighborhood} />
                      <FlatList
                        style={styles.flatList}
                        data={val.users}
                        // renderItem={renderItem}
                        renderItem={({item}) => (
                          <MemoItemUser
                            photo={item.profile_pic_path}
                            bio={item.bio}
                            username={item.username}
                            followed={followed.includes(item.user_id)}
                            onPress={() => onPress(item.user_id)}
                          />
                        )}
                        listKey={(item) => item.user_id + 'location'}
                        keyExtractor={(item) => item.user_id + 'location'}
                      />
                    </View>
                  );
                })}
              </View>
            );
          } else {
            return null;
          }
        })}
    </View>
  );
};

export default ListUser;

const styles = StyleSheet.create({
  flatList: {
    paddingLeft: 22,
    paddingRight: 22,
  },
});
