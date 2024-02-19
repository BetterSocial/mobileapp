import * as React from 'react';

import PropTypes from 'prop-types';
import UsersFragment from '../DiscoveryScreenV2/fragment/UsersFragment';

const Followings = ({dataFollower = [], isLoading, setDataFollower = () => {}}) => {
  return (
    <UsersFragment
      followedUsers={dataFollower}
      setFollowedUsers={setDataFollower}
      isLoadingDiscoveryUser={isLoading}
      showRecentSearch={true}
      withoutRecent={true}
      isUser={true}
    />
  );
};

Followings.propTypes = {
  dataFollower: PropTypes.array,
  setDataFollower: PropTypes.func,
  isLoading: PropTypes.bool
};

export default Followings;
