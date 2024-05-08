import * as React from 'react';
import Modal from 'react-native-modal';
import {Switch, Text, TouchableOpacity, View} from 'react-native';
import {WheelPicker} from '@victorzimnikov/react-native-wheel-picker-android';

import CreatePollContainerBaseStyle from './style/CreatePollContainerBaseStyle';
import MemoIcPlus from '../../../../assets/icons/ic_plus';
import MemoIc_arrow_right from '../../../../assets/icons/Ic_arrow_right';
import PollItem from '../PollItem';
import {MAX_POLLING_ALLOWED, MIN_POLLING_ALLOWED} from '../../../../utils/constants';
import {getDurationTimeText} from '../../../../utils/string/StringUtils';
import {COLORS} from '../../../../utils/theme';

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
  expiredobject = {day: 7, hour: 24},
  isAnonym
}) {
  const arrayContentToString = (arr) => {
    const newArray = arr.reduce((acc, current) => {
      acc.push(`${current}`);
      return acc;
    }, []);

    return newArray;
  };

  const S = modifyStyle(CreatePollContainerBaseStyle);
  const days = arrayContentToString([...Array(expiredobject.day).keys()]);
  const hour = arrayContentToString([...Array(expiredobject.hour).keys()]);
  const minute = arrayContentToString([...Array(60).keys()]);

  const [isDurationModalShown, setIsDurationModalShown] = React.useState(false);
  const [pickerDay, setPickerDay] = React.useState(selectedtime.day);
  const [pickerHour, setPickerHour] = React.useState(selectedtime.hour);
  const [pickerMinute, setPickerMinute] = React.useState(selectedtime.minute);

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
          isAnonym={isAnonym}
        />
      ))}

      {polls.length < MAX_POLLING_ALLOWED && (
        <TouchableOpacity onPress={() => onaddpoll()} style={S.addpollitemcontainer}>
          <MemoIcPlus
            width={16}
            height={16}
            style={S.addpollitemplusicon}
            fill={isAnonym ? COLORS.anon_secondary : COLORS.signed_secondary}
          />
        </TouchableOpacity>
      )}

      <View style={S.divider} />

      <TouchableOpacity style={S.polldurationbutton} onPress={() => setIsDurationModalShown(true)}>
        <View style={S.row}>
          <Text style={S.fillparenttext}>Duration</Text>
          <View style={S.polldurationbuttonview(isAnonym)}>
            <Text style={S.polldurationbuttontext}>{getDurationTimeText(selectedtime)}</Text>
          </View>
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
                  indicatorColor={COLORS.anon_primary}
                  indicatorWidth={3}
                  onItemSelected={(value) => setPickerDay(value)}
                  isCyclic={true}
                />
              </View>
            </View>
            <View style={S.pickercontainer}>
              <Text style={S.pickerlabeltext}>Hours</Text>
              <View style={{}}>
                <WheelPicker
                  data={hour}
                  selectedItem={selectedtime.hour}
                  indicatorColor={COLORS.anon_primary}
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
                  indicatorColor={COLORS.anon_primary}
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
                const selectedTime = {...selectedtime};
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
      </Modal>
    </View>
  );
}

function modifyStyle(baseStyle) {
  const returnStyle = {...baseStyle};

  returnStyle.parentcolumncontainer = {
    ...returnStyle.parentcolumncontainer,
    paddingHorizontal: 38
  };

  returnStyle.pickercontainer = {
    ...returnStyle.pickercontainer,
    paddingHorizontal: 20
  };

  returnStyle.pickerlabeltext = {
    marginBottom: 32,
    textAlign: 'center'
  };

  return returnStyle;
}

export default CreatePollContainer;
