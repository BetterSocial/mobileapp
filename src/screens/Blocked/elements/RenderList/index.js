import React from 'react';
import PropTypes from 'prop-types';

import DomainList from '../../../DiscoveryScreenV2/elements/DiscoveryItemList';

const BlockedList = (props) => {
  const {item, isHashtag, handleSetBlock, handleSetUnblock, onPressBody} = props;
  return (
    <DomainList
      key={`${item.blocked_action_id}`}
      onPressBody={() => onPressBody(item)}
      isBlockedSection={true}
      handleSetBlock={() => handleSetBlock(item)}
      handleSetUnblock={() => handleSetUnblock(item)}
      isHashtag={isHashtag}
      item={{
        name: item.name,
        image: item.image,
        isUnblocked: item.isUnblocked,
        description: item.description
      }}
    />
  );
};

BlockedList.propTypes = {
  item: PropTypes.object,
  onPressBody: PropTypes.func,
  handleSetBlock: PropTypes.func,
  handleSetUnblock: PropTypes.func,
  isHashtag: PropTypes.bool
};

BlockedList.defaultProps = {
  handleSetBlock: () => {},
  handleSetUnblock: () => {},
  onPressBody: () => {}
};

export default BlockedList;
