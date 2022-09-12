import api from './config';

const getUserForTagging = async (name) => {
    try {
        const url = `/mention/users/${name}`;
        console.log('name: ', url);
        const result = await api.get(url);
        return result.data.data;
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }

}

export {
    getUserForTagging,
}