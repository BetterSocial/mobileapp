import * as serviceToken from '../token';
import {getAnonymousUserId, getUserId} from './index';

describe('users test should run correctly', () => {
  // it('getUserId should run correctly', async () => {
  //   const spyGetAccessToken = jest.spyOn(serviceToken, 'getAccessToken').mockResolvedValue({
  //     id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDE4OGJiYTMtNGRlZi00MDRiLTg3NmQtZWNkNTQyMTQ5Mzg5IiwiZXhwIjoxNjkyNDkyODY3fQ.2_iKOGQFbNNYjAmrd1Lnx0SChJxRs4fcmc2UsvJ4ars'
  //   });

  //   await getUserId();
  //   expect(spyGetAccessToken).toHaveBeenCalled();
  // });

  // it('getAnonymousUserId should run correctly', async () => {
  //   const spyGetAccessToken = jest
  //     .spyOn(serviceToken, 'getAnonymousToken')
  //     .mockResolvedValue(
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDE4OGJiYTMtNGRlZi00MDRiLTg3NmQtZWNkNTQyMTQ5Mzg5IiwiZXhwIjoxNjkyNDkyODY3fQ.2_iKOGQFbNNYjAmrd1Lnx0SChJxRs4fcmc2UsvJ4ars'
  //     );

  //   await getAnonymousUserId();
  //   expect(spyGetAccessToken).toHaveBeenCalled();
  // });

  it('getAnonymousUserId mock null should run correctly', async () => {
    jest.spyOn(serviceToken, 'getAnonymousToken').mockResolvedValue(null);

    const resp = await getAnonymousUserId();
    expect(resp).toBeNull();
  });

  it('getAnonymousUserId catch error should run correctly', async () => {
    jest.spyOn(serviceToken, 'getAnonymousToken').mockRejectedValue(null);

    const resp = await getAnonymousUserId();
    expect(resp).toBeNull();
  });
});
