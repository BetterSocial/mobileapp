import {atom} from 'recoil';
import {removeAccessToken} from '../../../utils/token';
import {getTargetUserIdList, setTargetUserIdList} from '../datasource/targetUserIdList';

export const followersOrFollowingAtom = atom({
  key: 'followersOrFollowingAtom',
  default: [],
  effects_UNSTABLE: [
    ({setSelf, onSet}) => {
      // If there's a persisted value - set it on load
      const loadPersisted = async () => {
        const savedValue = await getTargetUserIdList();
        if (savedValue !== null && savedValue !== '') {
          setSelf(savedValue);
        } else {
          setSelf([]);
        }
      };

      loadPersisted();

      // Subscribe to state changes and persist them to localStorage
      onSet((idList) => {
        if (idList !== null && idList !== undefined) {
          setTargetUserIdList(idList);
        } else {
          removeAccessToken();
        }
      });
    }
  ]
});
