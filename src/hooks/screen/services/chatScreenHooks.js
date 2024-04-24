import {useQuery} from 'react-query';
import ChatSchema from '../../../database/schema/ChatSchema';

export function useGetAllMessage(payload, options) {
  return useQuery(
    ['getAllMesage', payload],
    () =>
      ChatSchema.getAll(
        payload.localDb,
        payload.selectedChannelId,
        payload.signedProfileId,
        payload.anonProfileId
      ),
    options
  );
}
