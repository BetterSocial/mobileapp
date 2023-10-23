export const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
export const promiseRejectSpy = jest.spyOn(Promise, 'reject').mockImplementation();
