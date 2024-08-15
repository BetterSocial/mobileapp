import * as React from 'react';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import {Switch, Text, TouchableOpacity, View} from 'react-native';

import CreatePollContainerBaseStyle from './style/CreatePollContainerBaseStyle';
import IconArowRight from '../../../../assets/icons/Ic_arrow_right';
import MemoIcPlus from '../../../../assets/icons/ic_plus';
import PollItem from '../PollItem';
import useCreatePostScreenAnalyticsHook from '../../../../libraries/analytics/useCreatePostScreenAnalyticsHook';
import {COLORS} from '../../../../utils/theme';
import {MAX_POLLING_ALLOWED, MIN_POLLING_ALLOWED} from '../../../../utils/constants';
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
  expiredobject = {day: 7, hour: 24},
  isAnonym,
  expiration
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

  const eventTrack = useCreatePostScreenAnalyticsHook();

  const onSetTime = () => {
    const selectedTime = {...selectedtime};
    selectedTime.day = Number(pickerDay);
    selectedTime.hour = Number(pickerHour);
    selectedTime.minute = Number(pickerMinute);
    ontimechanged(selectedTime);
    setIsDurationModalShown(false);
    eventTrack.onSetPollDurationSetButtonClicked();
  };

  const onDurationClicked = () => {
    setIsDurationModalShown(true);
    eventTrack.onPollSectionDurationButtonClicked();
  };

  const onCancelDurationClicked = () => {
    setIsDurationModalShown(false);
    eventTrack.onSetPollDurationCancelClicked();
  };

  const onPollItemPressIn = (index) => {
    eventTrack.onPollSectionEditChoiceClicked(index);
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
          isAnonym={isAnonym}
          eventTrack={{
            onPollSectionEditChoiceClicked: onPollItemPressIn
          }}
        />
      ))}

      {polls.length < MAX_POLLING_ALLOWED && (
        <TouchableOpacity onPress={() => onaddpoll()} style={S.addpollitemcontainer}>
          <MemoIcPlus
            width={20}
            height={20}
            style={S.addpollitemplusicon}
            fill={isAnonym ? COLORS.anon_secondary : COLORS.signed_secondary}
          />
        </TouchableOpacity>
      )}

      <View style={S.divider} />

      <TouchableOpacity style={S.polldurationbutton} onPress={onDurationClicked}>
        <View style={S.row}>
          <Text style={S.fillparenttext}>Duration</Text>
          <View style={S.polldurationbuttonview(isAnonym)}>
            <Text style={S.polldurationbuttontext}>{getDurationTimeText(selectedtime)}</Text>
          </View>
          <IconArowRight width={8} height={12} style={S.rightarrow} fill={COLORS.white} />
        </View>
      </TouchableOpacity>

      <View style={S.divider} />

      <View style={S.row}>
        <Text style={S.fillparenttext}>Allow multiple answers</Text>
        <Text style={S.switchtext}>{ismultiplechoice ? 'On' : 'Off'}</Text>
        {/* TODO: Garry pakai komponen ToggleSwitch seperti yang lain */}
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
          <View style={S.setdurationview}>
            <Text style={S.setdurationtext}>Set Duration</Text>
            {expiration !== 'Never' && (
              <Text style={S.setdurationdesc}>
                The poll duration has to be shorter than the expiration time of your post, currently
                set to {expiration}.
              </Text>
            )}
          </View>
          <View style={S.modalrowcontainer}>
            <View style={S.pickercontainer}>
              <Text style={S.pickerlabeltext}>Days</Text>
              <View style={{}}>
                <Picker
                  onValueChange={(itemValue) => {
                    setPickerDay(itemValue);
                    eventTrack.onSetPollDurationChangeDaysSet(itemValue);
                  }}
                  selectedValue={pickerDay}>
                  {days.map((day, index) => (
                    <Picker.Item key={index} label={day} value={day} color={COLORS.white} />
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
                    eventTrack.onSetPollDurationChangeHoursSet(itemValue);
                  }}
                  selectedValue={pickerHour}>
                  {hour.map((h, index) => (
                    <Picker.Item key={index} label={h} value={h} color={COLORS.white} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={S.pickercontainer}>
              <Text style={S.pickerlabeltext}>Minutes</Text>
              <View style={{}}>
                <Picker
                  onValueChange={(itemValue) => {
                    setPickerMinute(itemValue);
                    eventTrack.onSetPollDurationChangeMinutesSet(itemValue);
                  }}
                  selectedValue={pickerMinute}>
                  {minute.map((m, index) => (
                    <Picker.Item key={index} label={m} value={m} color={COLORS.white} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
          <View style={S.bottombuttonrowcontainer}>
            <TouchableOpacity style={S.buttoncontainer} onPress={onCancelDurationClicked}>
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

function modifyStyle(baseStyle) {
  const returnStyle = {...baseStyle};
  returnStyle.modalcontainer = {
    ...returnStyle.modalcontainer,
    paddingHorizontal: 0
  };

  returnStyle.pickerlabeltext = {
    ...returnStyle.pickerlabeltext,
    textAlign: 'center'
  };
  return returnStyle;
}

export default CreatePollContainer;
