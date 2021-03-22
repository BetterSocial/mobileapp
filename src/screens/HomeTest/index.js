import React, {useContext} from 'react';
import {Button, Text, View} from 'react-native';
import {Context} from '../../context';
import {
  setDataHumenId,
  setImage,
  setUsername,
} from '../../context/actions/users';

const Home = () => {
  const [state, dispatch] = useContext(Context).users;
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <Text>ini screen hanya untuk testing</Text>
      {/* <Button title="hman" onPress={() => setImage('hasilimage', dispatch)} />
      <Button
        title="username"
        onPress={() => setUsername('username', dispatch)}
      />
      <Button
        title="image"
        onPress={() =>
          setDataHumenId(
            {
              appUserId: 'idhu',
              countryCode: 'ID',
            },
            dispatch,
          )
        }
      />
      <Button title="hasil" onPress={() => console.log(state)} /> */}
    </View>
  );
};

export default Home;
