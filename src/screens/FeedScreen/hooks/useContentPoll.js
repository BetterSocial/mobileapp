import React from 'react';

import { inputSingleChoicePoll } from '../../../service/post';
import {
  isPollExpired
} from '../../../utils/string/StringUtils';

const useContentPoll = ({polls}) => {
    const [isAlreadyPolling, setIsAlreadyPolling] =
    React.useState(false);
      const [singleChoiceSelectedIndex, setSingleChoiceSelectedIndex] =
    React.useState(-1);
      const [multipleChoiceSelected, setMultipleChoiceSelected] = React.useState([]);
      const [newPoll, setNewPoll] = React.useState(null)

  const renderSeeResultButton = (multiplechoice) => {
    if(multiplechoice && multipleChoiceSelected.length > 0) return 'Submit'

    return 'See Results'
  }
  const showSetResultsButton = (pollexpiredat) => !isPollExpired(pollexpiredat) && !isAlreadyPolling;

  const handleMultipleChoice = (item, onnewpollfetched, index) => {
    const newPolls = [...polls];
    const newItem = { ...item };
    newItem.isalreadypolling = true;
      newItem.refreshtoken = new Date().valueOf();
      if (multipleChoiceSelected.length === 0) {
        setIsAlreadyPolling(false)
      } else {
        setIsAlreadyPolling(true);
        const selectedPolls = [];
        for (let i = 0; i < multipleChoiceSelected.length; i++) {
          const changedPollIndex = multipleChoiceSelected[i];
          const selectedPoll = polls[changedPollIndex];
          newPolls[changedPollIndex].counter =
            Number(selectedPoll.counter) + 1;
          selectedPolls.push(selectedPoll);
        }
        newItem.pollOptions = newPolls;
        newItem.mypolling = selectedPolls;
        if(multipleChoiceSelected.length > 0) newItem.voteCount++;
      }
      if(onnewpollfetched && typeof onnewpollfetched === 'function')       onnewpollfetched(newItem, index);
      setNewPoll(newItem)
  }

  const handleNoMultipleChoice = (item, onnewpollfetched, index) => {
    const newPolls = [...polls];
    const newItem = { ...item };
          newItem.isalreadypolling = true;
      newItem.refreshtoken = new Date().valueOf();

      if (singleChoiceSelectedIndex === -1) {
        // inputSingleChoicePoll(polls[0].polling_id, NO_POLL_UUID);
      } else {
        const selectedPoll = polls[singleChoiceSelectedIndex];
        newPolls[singleChoiceSelectedIndex].counter =
          Number(selectedPoll.counter) + 1;
        newItem.pollOptions = newPolls;
        newItem.mypolling = selectedPoll;
        newItem.voteCount++;
        inputSingleChoicePoll(
          selectedPoll.polling_id,
          selectedPoll.polling_option_id,
        );
      }
      if(onnewpollfetched && typeof onnewpollfetched === 'function') {
        onnewpollfetched(newItem, index);
      }
      setIsAlreadyPolling(true);
      setNewPoll(newItem)
  }

  const onSeeResultsClicked = (item, multiplechoice, onnewpollfetched, index) => {
    if (multiplechoice) {
      handleMultipleChoice(item, onnewpollfetched, index)
    } else {
     handleNoMultipleChoice(item, onnewpollfetched, index)
    }
  };

    const modifiedPoll = () => {
      const modifPoll = polls.reduce(
        (acc, current) => {
          acc.totalpoll += Number(current.counter);
          if (current.counter > acc.maxValue) {
            acc.maxValue = current.counter;
            acc.maxId = [];
            acc.maxId.push(current.polling_option_id);
          } else if (current.counter === acc.maxValue) {
            const { maxId } = acc;
            maxId.push(current.polling_option_id);
          }

          return acc;
        },
        { totalpoll: 0, maxId: [], maxValue: 0 },
      );
      return modifPoll
    }

  const handleStyleBar = (percent) => {
      let newPercent = percent
      if(!percent){
        newPercent = 0
      }
      if(percent > 100) {
       newPercent = 100
      }
      return newPercent
    }

  return {
    renderSeeResultButton,
    showSetResultsButton,
    setIsAlreadyPolling,
    isAlreadyPolling,
    singleChoiceSelectedIndex,
    setSingleChoiceSelectedIndex,
    multipleChoiceSelected,
    setMultipleChoiceSelected,
    onSeeResultsClicked,
    modifiedPoll,
    newPoll,
    handleStyleBar
  }
}

export default useContentPoll
