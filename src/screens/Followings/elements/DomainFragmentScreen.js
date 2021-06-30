import * as React from 'react';
import {Text} from 'react-native';

const DomainFragmentScreen = ({navigation}) => {
  React.useEffect(() => {
    navigation.setOptions({
      title: 'Domains (3)',
    });
  }, []);

  return <Text>Domain</Text>;
};

export default DomainFragmentScreen;
