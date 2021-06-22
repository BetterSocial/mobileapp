import * as React from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';

import {Button} from '../../components/Button';
import ItemList from '../../components/Blocking/ItemList';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

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
  const [active, setActive] = React.useState([]);
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
          container: styles.container,
          draggableIcon: styles.draggableIcon,
        }}>
        <View style={styles.content}>
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
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default ReportDomain;

const styles = StyleSheet.create({
  content: {flex: 1},
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
    marginBottom: 30,
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
  container: {
    height: '80%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  draggableIcon: {
    backgroundColor: colors.alto,
    width: 60,
  },
});
