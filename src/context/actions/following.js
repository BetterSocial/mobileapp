/* eslint-disable indent */
import { SET_FOLLOWING_DOMAIN, SET_FOLLOWING_TOPICS, SET_FOLLOWING_USER } from '../Types';

const setFollowingUsers = (data, dispatch) => {
    dispatch({
        type: SET_FOLLOWING_USER,
        payload: data,
    });
};

const setFollowingTopics = (data, dispatch) => {
    dispatch({
        type: SET_FOLLOWING_TOPICS,
        payload: data,
    });
};

const setFollowingDomain = (data, dispatch) => {
    dispatch({
        type: SET_FOLLOWING_DOMAIN,
        payload: data,
    });
};

export default {
    setFollowingUsers,
    setFollowingTopics,
    setFollowingDomain,
};
