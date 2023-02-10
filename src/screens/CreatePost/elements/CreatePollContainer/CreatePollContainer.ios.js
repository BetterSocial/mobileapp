import * as React from 'react';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import {StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';

import MemoIcPlus from '../../../../assets/icons/ic_plus';
import MemoIc_arrow_right from '../../../../assets/icons/Ic_arrow_right';
import PollItem from '../PollItem';
import {MAX_POLLING_ALLOWED, MIN_POLLING_ALLOWED} from '../../../../utils/constants';
import {colors} from '../../../../utils/colors';
import {getDurationTimeText} from '../../../../utils/string/StringUtils';

function CreatePollContainer({
  onremoveallpoll = () => {},
  onaddpoll = () => {},
  onremovesinglepoll = () => {},
  onsinglepollchanged = () => {},
  ismultiplechoice = false,
  onmultiplechoicechanged = () => {},
  selectedtime = {day: 1, hour: 0, minute: 0},
  ontimechanged = () => {},
  polls,
  expiredobject = {day: 7, hour: 24}
}) {
  const arrayContentToString = (arr) => {
    const newArray = arr.reduce((acc, current) => {
      acc.push(`${current}`);
      return acc;
    }, []);

    return newArray;
  };

  const days = arrayContentToString([...Array(expiredobject.day).keys()]);
  const hour = arrayContentToString([...Array(expiredobject.hour).keys()]);
  const minute = arrayContentToString([...Array(60).keys()]);

  const [isDurationModalShown, setIsDurationModalShown] = React.useState(false);
  const [pickerDay, setPickerDay] = React.useState(selectedtime.day);
  const [pickerHour, setPickerHour] = React.useState(selectedtime.hour);
  const [pickerMinute, setPickerMinute] = React.useState(selectedtime.minute);

  const onSetTime = () => {
    const selectedTime = {...selectedtime};
    selectedTime.day = Number(pickerDay);
    selectedTime.hour = Number(pickerHour);
    selectedTime.minute = Number(pickerMinute);
    ontimechanged(selectedTime);
    setIsDurationModalShown(false);
  };

  return (
    <View style={S.createpollcontainer}>
      {polls.map((item, index) => (
        <PollItem
          index={index}
          poll={item}
          key={`poll-item-${index}`}
          showdeleteicon={polls.length > MIN_POLLING_ALLOWED}
          onremovepoll={(ind) => onremovesinglepoll(ind)}
          onpollchanged={(v) => {
            onsinglepollchanged(v, index);
          }}
        />
      ))}

      {polls.length < MAX_POLLING_ALLOWED && (
        <TouchableOpacity onPress={() => onaddpoll()} style={S.addpollitemcontainer}>
          <MemoIcPlus width={16} height={16} style={S.addpollitemplusicon} />
        </TouchableOpacity>
      )}

      <View style={S.divider} />

      <TouchableOpacity style={S.polldurationbutton} onPress={() => setIsDurationModalShown(true)}>
        <View style={S.row}>
          <Text style={S.fillparenttext}>Duration</Text>
          <Text style={S.polldurationbuttontext}>{getDurationTimeText(selectedtime)}</Text>
          <MemoIc_arrow_right width={8} height={12} style={S.rightarrow} />
        </View>
      </TouchableOpacity>

      <View style={S.divider} />

      <View style={S.row}>
        <Text style={S.fillparenttext}>Multiple Choice</Text>
        <Text style={S.switchtext}>{ismultiplechoice ? 'On' : 'Off'}</Text>
        <Switch
          value={ismultiplechoice}
          onValueChange={(value) => onmultiplechoicechanged(value)}
        />
      </View>

      <TouchableOpacity onPress={() => onremoveallpoll()} style={S.removepollcontainer}>
        <Text style={S.removepolltext}>Remove Poll</Text>
      </TouchableOpacity>

      <Modal isVisible={isDurationModalShown}>
        <View style={S.parentcolumncontainer}>
          <Text style={S.setdurationtext}>Set Duration</Text>
          <View style={S.modalrowcontainer}>
            <View style={S.pickercontainer}>
              <Text style={S.pickerlabeltext}>Days</Text>
              <View style={{}}>
                <Picker
                  onValueChange={(itemValue) => {
                    setPickerDay(itemValue);
                  }}
                  selectedValue={pickerDay}>
                  {days.map((day, index) => (
                    <Picker.Item key={index} label={day} value={day} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={S.pickercontainer}>
              <Text style={S.pickerlabeltext}>Hours</Text>
              <View style={{}}>
                <Picker
                  onValueChange={(itemValue) => {
                    setPickerHour(itemValue);
                    setPickerDay(0);
                  }}
                  selectedValue={pickerHour}>
                  {hour.map((h, index) => (
                    <Picker.Item key={index} label={h} value={h} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={S.pickercontainer}>
              <Text style={S.pickerlabeltext}>Min</Text>
              <View style={{}}>
                <Picker
                  onValueChange={(itemValue) => {
                    setPickerDay(0);
                    setPickerMinute(itemValue);
                  }}
                  selectedValue={pickerMinute}>
                  {minute.map((m, index) => (
                    <Picker.Item key={index} label={m} value={m} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
          <View style={S.bottombuttonrowcontainer}>
            <TouchableOpacity
              style={S.buttoncontainer}
              onPress={() => setIsDurationModalShown(false)}>
              <Text style={S.bottombuttontext}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.buttoncontainer} onPress={onSetTime}>
              <Text style={S.bottombuttontext}>Set</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const S = StyleSheet.create({
  createpollcontainer: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.gray1,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 16,
    padding: 16
  },

  removepollcontainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 16
  },

  addpollitemcontainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 2,
    paddingVertical: 12
  },

  addpollitemplusicon: {
    color: colors.black,
    alignSelf: 'center'
  },

  removepolltext: {
    color: colors.redalert,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold'
  },

  divider: {
    flex: 1,
    width: '100%',
    height: 1,
    marginVertical: 8,
    backgroundColor: colors.gray1
  },

  row: {
    flexDirection: 'row',
    display: 'flex',
    paddingVertical: 8
  },

  fillparenttext: {
    flex: 1,
    alignSelf: 'center'
  },

  rightarrow: {
    alignSelf: 'center'
  },

  polldurationbutton: {
    backgroundColor: colors.white,
    color: colors.white,
    paddingVertical: 4,
    borderRadius: 4
  },

  polldurationbuttontext: {
    color: colors.white,
    backgroundColor: colors.holytosca,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 6,
    marginEnd: 24
  },

  switchtext: {
    alignSelf: 'center',
    marginRight: 16
  },

  modalcontainer: {
    flexDirection: 'column',
    display: 'flex',
    flex: 1,
    paddingHorizontal: 0
  },

  parentcolumncontainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingVertical: 24,
    borderRadius: 4,
    paddingHorizontal: 12
  },

  modalrowcontainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    display: 'flex',
    width: '100%'
  },

  pickercontainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    flex: 1
    // paddingHorizontal: 20,
  },

  setdurationtext: {
    fontFamily: 'Inter-SemiBold',
    marginBottom: 22
  },

  pickerlabeltext: {
    marginBottom: 32,
    textAlign: 'center'
  },

  bottombuttonrowcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  buttoncontainer: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },

  bottombuttontext: {
    fontFamily: 'Inter-SemiBold'
  }
});

export default CreatePollContainer;
