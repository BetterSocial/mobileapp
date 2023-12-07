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
import {COLORS} from '../../utils/theme';

const ReportDomain = React.forwardRef((props, ref) => {
  const {onSelect, onSkip} = props
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
  const [activeLabel, setActiveLabel] = React.useState([]);

  const onChoice = (id, value, type) => {
    if (type === 'add') {
      let newArr = [...active, id];
      let newArrLabel = [...activeLabel, value];
      setActiveLabel(newArrLabel);
      setActive(newArr);
    } else {
      let newArr = active.filter((e) => e !== id);
      setActive(newArr);
      let newArrLabel = activeLabel.filter((e) => e !== value);
      setActiveLabel(newArrLabel);
    }
  };
  const onNext = () => {
    onSelect(activeLabel);
  };

  return (
    <View>
      <RBSheet
        ref={ref}
        closeOnDragDown={false}
        closeOnPressMask={true}
        customStyles={{
          container: styles.container,
          draggableIcon: styles.draggableIcon,
        }}>
        <View style={styles.content}>
          <ScrollView nestedScrollEnabled={true}>
            <TouchableOpacity style={styles.btnSkip} onPress={() => onSkip()}>
              <Text style={styles.btnSkipText}>
                Skip & just block this account
              </Text>
              <IconFA5 name="chevron-right" size={17} color={COLORS.black} />
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
              <Button onPress={onNext}>
                <Text>Provide info on next screen</Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
})

export default ReportDomain;

const styles = StyleSheet.create({
  content: {flex: 1},
  title: {
    fontFamily: fonts.inter[700],
    fontSize: 16,
    color: COLORS.black,
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
    backgroundColor: COLORS.alto,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    paddingVertical: 18,
    marginVertical: 22,
  },
  btnSkipText: {
    fontFamily: fonts.inter[700],
    fontSize: 14,
    color: COLORS.black,
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
