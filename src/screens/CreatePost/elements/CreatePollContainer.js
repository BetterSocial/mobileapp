import * as React from 'react';
import {StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';

import Modal from 'react-native-modal';
import {WheelPicker} from '@victorzimnikov/react-native-wheel-picker-android';

import PollItem from './PollItem';
import MemoIcPlus from '../../../assets/icons/ic_plus';
import {colors} from '../../../utils/colors';
import {
  MAX_POLLING_ALLOWED,
  MIN_POLLING_ALLOWED,
} from '../../../utils/constants';
import MemoIc_arrow_right from '../../../assets/icons/Ic_arrow_right';

export default function CreatePollContainer({
  onremoveallpoll = () => {},
  onaddpoll = () => {},
  onremovesinglepoll = (index) => {},
  onsinglepollchanged = (item, index) => {},
  ismultiplechoice = false,
  onmultiplechoicechanged = (ismultiple) => {},
  selectedtime = {day: 1, hour: 0, minute: 0},
  ontimechanged = (timeobject) => {},
  polls,
  expiredobject = {day: 7, hour: 24},
}) {
  let arrayContentToString = (arr) => {
    let newArray = arr.reduce((acc, current) => {
      acc.push(`${current}`);
      return acc;
    }, []);

    return newArray;
  };

  let days = arrayContentToString([...Array(expiredobject.day).keys()]);
  let hour = arrayContentToString([...Array(expiredobject.hour).keys()]);
  let minute = arrayContentToString([...Array(60).keys()]);

  let [isDurationModalShown, setIsDurationModalShown] = React.useState(false);
  let [pickerDay, setPickerDay] = React.useState(selectedtime.day);
  let [pickerHour, setPickerHour] = React.useState(selectedtime.hour);
  let [pickerMinute, setPickerMinute] = React.useState(selectedtime.minute);

  const getDurationTimeText = () => {
    let dayText = selectedtime.day > 0 ? `${selectedtime.day} Day(s)` : '';
    let hourText =
      selectedtime.hour > 0
        ? `${selectedtime.day > 0 ? ', ' : ' '}${selectedtime.hour}h`
        : '';
    let minuteText =
      selectedtime.minute > 0
        ? `${selectedtime.hour > 0 ? ', ' : ' '}${selectedtime.minute}m`
        : '';

    return `${dayText}${hourText}${minuteText}`;
  };

  return (
    <View style={S.createpollcontainer}>
      {polls.map((item, index) => {
        return (
          <PollItem
            index={index}
            poll={item}
            key={`poll-item-${index}`}
            showdeleteicon={polls.length > MIN_POLLING_ALLOWED}
            onremovepoll={(index) => onremovesinglepoll(index)}
            onpollchanged={(item) => {
              onsinglepollchanged(item, index);
            }}
          />
        );
      })}

      {polls.length < MAX_POLLING_ALLOWED && (
        <TouchableOpacity
          onPress={() => onaddpoll()}
          style={S.addpollitemcontainer}>
          <MemoIcPlus width={16} height={16} style={S.addpollitemplusicon} />
        </TouchableOpacity>
      )}

      <View style={S.divider} />

      <TouchableOpacity
        style={S.polldurationbutton}
        onPress={() => setIsDurationModalShown(true)}>
        <View style={S.row}>
          <Text style={S.fillparenttext}>Duration</Text>
          <Text style={S.polldurationbuttontext}>{getDurationTimeText()}</Text>
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

      <TouchableOpacity
        onPress={() => onremoveallpoll()}
        style={S.removepollcontainer}>
        <Text style={S.removepolltext}>Remove Poll</Text>
      </TouchableOpacity>

      <Modal isVisible={isDurationModalShown} style={S.modalcontainer}>
        <View style={S.parentcolumncontainer}>
          <Text style={S.setdurationtext}>Set Duration</Text>
          <View style={S.modalrowcontainer}>
            <View style={S.pickercontainer}>
              <Text style={S.pickerlabeltext}>Days</Text>
              <View style={{}}>
                <WheelPicker
                  data={days}
                  selectedItem={selectedtime.day}
                  indicatorColor={colors.holytosca}
                  indicatorWidth={3}
                  onItemSelected={(value) => setPickerDay(value)}
                  isCyclic={true}
                />
              </View>

              <View style={S.pickercontainer}>
                <Text style={S.pickerlabeltext}>Hours</Text>
                <View style={{}}>
                  <WheelPicker
                    data={hour}
                    selectedItem={selectedtime.hour}
                    indicatorColor={colors.holytosca}
                    indicatorWidth={3}
                    onItemSelected={(value) => setPickerHour(value)}
                    isCyclic={true}
                  />
                </View>
              </View>
              <View style={S.pickercontainer}>
                <Text style={S.pickerlabeltext}>Min</Text>
                <View style={{}}>
                  <WheelPicker
                    data={minute}
                    selectedItem={selectedtime.minute}
                    onItemSelected={(value) => setPickerMinute(value)}
                    indicatorColor={colors.holytosca}
                    indicatorWidth={3}
                    isCyclic={true}
                  />
                </View>
              </View>
            </View>

            <View style={S.bottombuttonrowcontainer}>
              <TouchableOpacity
                style={S.buttoncontainer}
                onPress={() => setIsDurationModalShown(false)}>
                <Text style={S.bottombuttontext}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={S.buttoncontainer}
                onPress={() => {
                  let selectedTime = {...selectedtime};
                  selectedTime.day = pickerDay;
                  selectedTime.hour = pickerHour;
                  selectedTime.minute = pickerMinute;
                  ontimechanged(selectedTime);
                  setIsDurationModalShown(false);
                }}>
                <Text style={S.bottombuttontext}>Set</Text>
              </TouchableOpacity>
            </View>
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
    padding: 16,
  },

  removepollcontainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 16,
  },

  addpollitemcontainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 2,
    paddingVertical: 12,
  },

  addpollitemplusicon: {
    color: colors.black,
    alignSelf: 'center',
  },

  removepolltext: {
    color: colors.redalert,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },

  divider: {
    flex: 1,
    width: '100%',
    height: 1,
    marginVertical: 8,
    backgroundColor: colors.gray1,
  },

  row: {
    flexDirection: 'row',
    display: 'flex',
    paddingVertical: 8,
  },

  fillparenttext: {
    flex: 1,
    alignSelf: 'center',
  },

  rightarrow: {
    alignSelf: 'center',
  },

  polldurationbutton: {
    backgroundColor: colors.white,
    color: colors.white,
    paddingVertical: 4,
    borderRadius: 4,
  },

  polldurationbuttontext: {
    color: colors.white,
    backgroundColor: colors.holytosca,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 6,
    marginEnd: 24,
  },

  switchtext: {
    alignSelf: 'center',
    marginRight: 16,
  },

  modalcontainer: {
    flexDirection: 'column',
    display: 'flex',
    flex: 1,
  },

  parentcolumncontainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 38,
    borderRadius: 4,
  },

  modalrowcontainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
  },

  pickercontainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    flex: 1,
    paddingHorizontal: 20,
  },

  setdurationtext: {
    fontFamily: 'Inter-SemiBold',
    marginBottom: 22,
  },

  pickerlabeltext: {
    marginBottom: 32,
  },

  bottombuttonrowcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  buttoncontainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  bottombuttontext: {
    fontFamily: 'Inter-SemiBold',
  },
});
