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

const getTopics = async (name) => {
    try {
        const result = await api.get(`/topics/?name=${name}`);
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
