import * as React from 'react';

import PropTypes from 'prop-types';
import UsersFragment from '../DiscoveryScreenV2/fragment/UsersFragment';
import {Context} from '../../context';

const Followings = ({
  dataFollower = [],
  dataUnfollowed = [],
  isLoading,
  setDataFollower = () => {}
}) => {
  return (
    <UsersFragment
      followedUsers={dataFollower}
      unfollowedUsers={dataUnfollowed}
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
  dataUnfollowed: PropTypes.array,
  setDataFollower: PropTypes.func,
  isLoading: PropTypes.bool
};

export default Followings;
