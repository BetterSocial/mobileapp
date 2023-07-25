export const usePollOptionMultiple = ({
  item,
  mypoll,
  index,
  // total,
  selectedindex,
  isexpired,
  isalreadypolling = false,
  maxpolls = [],
  onselected = () => {},
  totalVotingUser = 0
}) => {
  const counter = item?.counter || 0;
  const optionPercentage =
    totalVotingUser === 0 ? 0 : ((counter / totalVotingUser) * 100).toFixed(0);

  const isPollDisabled = () => isalreadypolling || isexpired;

  const selected = selectedindex.includes(index);

  const isMyPoll = () =>
    mypoll.reduce((acc, current) => {
      const isCurrentItemMyPoll = item?.polling_option_id === current?.polling_option_id;
      return acc || isCurrentItemMyPoll;
    }, false);

  const onOptionsClicked = () => {
    if (isPollDisabled()) {
      return null;
    }
    if (selected) {
      const idx = selectedindex.indexOf(index);
      const newSelectedIndex = [...selectedindex];
      newSelectedIndex.splice(idx, 1);
      onselected(newSelectedIndex);
    } else {
      const newSelectedIndex = [...selectedindex];
      newSelectedIndex.push(index);
      onselected(newSelectedIndex);
    }
  };

  const isPollNotEndedAndIsMine = isalreadypolling && isMyPoll() && !isexpired;
  const isMax = maxpolls.includes(item.polling_option_id);

  const handleStyleBar = (percent) => {
    let newPercent = percent;
    if (!percent) {
      newPercent = 0;
    }
    if (percent > 100) {
      newPercent = 100;
    }
    return newPercent;
  };

  return {
    counter,
    optionPercentage,
    isPollDisabled,
    selected,
    isMax,
    isMyPoll,
    onOptionsClicked,
    isPollNotEndedAndIsMine,
    handleStyleBar
  };
};

export default usePollOptionMultiple;
