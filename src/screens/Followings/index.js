import * as React from 'react';
import PropTypes from 'prop-types';

import UsersFragment from '../DiscoveryScreenV2/fragment/UsersFragment';

const Followings = ({
  dataFollower = [],
  isLoading,
  setDataFollower = () => {},
  eventTrack = {
    common: {
      onCommonClearRecentSearch: () => {},
      onCommonRecentItemClicked: () => {}
    },
    user: {
      onUserPageOpened: () => {},
      onUserPageFollowButtonClicked: () => {},
      onUserPageUnfollowButtonClicked: () => {}
    }
  }
}) => {
  return (
    <UsersFragment
      followedUsers={dataFollower}
      setFollowedUsers={setDataFollower}
      isLoadingDiscoveryUser={isLoading}
      showRecentSearch={true}
      withoutRecent={true}
      isUser={true}
      eventTrack={eventTrack}
    />
  );
};

Followings.propTypes = {
  dataFollower: PropTypes.array,
  setDataFollower: PropTypes.func,
  isLoading: PropTypes.bool
};

export default Followings;
