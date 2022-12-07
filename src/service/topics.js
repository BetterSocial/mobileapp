import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

const getUserTopic = async (query) => {
    try {
        const res = await api.get(`/topics/follow${query}`);
        return res.data;
    } catch (error) {
        console.log(error);
        crashlytics().recordError(new Error(error));
        throw new Error(error);
    }
};

const putUserTopic = async (data) => {
    try {
        const res = await api.put('/topics/follow', data);
        return res.data;
    } catch (error) {
        console.log(error);
        crashlytics().recordError(new Error(error));
        throw new Error(error);
    }
};

const getFollowingTopic = async () => {
    try {
        const processGetFollowTopic = await api.get('/topics/followed');
        return processGetFollowTopic.data;
    } catch (e) {
        throw new Error(e);
    }
};

/**
 * 
 * @param {string} name 
 * @param {import('axios').AxiosRequestConfig} axiosOptions 
 * @returns 
 */
const getTopics = async (name, axiosOptions = {}) => {
    try {
        const result = await api.get(`/topics/?name=${name}`, axiosOptions);
        return result.data;
    } catch (e) {
        throw new Error(e);
    }
};


export {
    getUserTopic,
    putUserTopic,
    getFollowingTopic,
    getTopics,
};
