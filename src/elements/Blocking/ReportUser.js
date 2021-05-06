import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import ItemList from '../../components/Blocking/ItemList';
import {Button} from '../../components/Button';
import Gap from '../../components/Gap';

const ReportUser = ({refReportUser, onSelect}) => {
  const data = [
    {
      id: 1,
      label: 'It’s promotional spam',
    },
    {
      id: 2,
      label: 'It’s intentional disinformation',
    },
    {
      id: 3,
      label: 'The account is fake or not human',
    },
    {
      id: 4,
      label: 'It’s private information (Doxxing)',
    },
    {
      id: 5,
      label: 'It expresses intentions of self-harm',
    },
    {
      id: 6,
      label: 'Violence/threats against humans or animals',
    },
    {
      id: 7,
      label: 'Something else',
    },
  ];
  const [active, setActive] = useState([]);
  const onChoice = (id, type) => {
    if (type === 'add') {
      let newArr = [...active, id];
      setActive(newArr);
    } else {
      let newArr = active.filter((e) => e !== id);
      setActive(newArr);
    }
  };
  const onNext = () => {
    onSelect(active);
  };
  return (
    // <View>
    <RBSheet
      ref={refReportUser}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        container: {
          height: '80%',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
        draggableIcon: {
          backgroundColor: colors.alto,
          width: 60,
        },
      }}>
      {/* <View style={{flex: 1}}> */}
      <ScrollView nestedScrollEnabled={true}>
        <TouchableOpacity style={styles.btnSkip}>
          <Text style={styles.btnSkipText}>Skip & just block this account</Text>
          <IconFA5 name="chevron-right" size={17} color={'#000'} />
        </TouchableOpacity>
        <Text style={styles.title}>
          Or select all which apply to specify the issue - provide more info on
          next screen:
        </Text>
        {data.map((item) => (
          <ItemList
            key={item.id}
            label={item.label}
            id={item.id}
            onSelect={onChoice}
            active={active.includes(item.id)}
          />
        ))}
        <View style={styles.btn}>
          <Button onPress={() => onNext()}>
            <Text>Provide info on next screen</Text>
          </Button>
        </View>
        <Gap style={{height: 30}} />
      </ScrollView>
      {/* </View> */}
    </RBSheet>
    // </View>
  );
};

export default ReportUser;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.inter[700],
    fontSize: 16,
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
  btn: {
    paddingLeft: 18,
    paddingRight: 22,
    paddingTop: 8,
  },
  btnSkip: {
    backgroundColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    paddingVertical: 18,
    marginVertical: 22,
  },
  btnSkipText: {
    fontFamily: fonts.inter[700],
    fontSize: 14,
    color: '#000',
  },
});
