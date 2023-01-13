import api from './config';

const getUserForTagging = async (name) => {
    try {
        const url = `/mention/users/${name}`;
        const result = await api.get(url);
        return result.data.data;
    } catch (e) {
        throw new Error(e);
    }

}

export {
    getUserForTagging,
}
