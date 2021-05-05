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

const ReportDomain = ({refReportDomain, onSelect}) => {
  const data = [
    {
      id: 1,
      label: 'It’s spreading fake news',
    },
    {
      id: 2,
      label: 'It’s is pretending to be a domain it is not',
    },
    {
      id: 3,
      label: 'It’s phishing',
    },
    {
      id: 4,
      label: 'It’s promotional spam',
    },
    {
      id: 5,
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

  return (
    <View>
      <RBSheet
        ref={refReportDomain}
        closeOnDragDown={false}
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
        <View style={{flex: 1}}>
          <ScrollView nestedScrollEnabled={true}>
            <TouchableOpacity style={styles.btnSkip}>
              <Text style={styles.btnSkipText}>
                Skip & just block this account
              </Text>
              <IconFA5 name="chevron-right" size={17} color={'#000'} />
            </TouchableOpacity>
            <Text style={styles.title}>
              Or select all which apply to specify the issue - provide more info
              on next screen:
            </Text>
            {data.map((item) => (
              <ItemList
                key={item.id}
                id={item.id}
                label={item.label}
                onSelect={onChoice}
                active={active.includes(item.id)}
              />
            ))}
            <View style={styles.btn}>
              <Button>
                <Text>Provide info on next screen</Text>
              </Button>
            </View>
            <Gap style={{height: 30}} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default ReportDomain;

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
