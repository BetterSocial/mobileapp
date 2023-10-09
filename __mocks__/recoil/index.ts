// jest.mock('recoil', () => ({
//     useRecoilState: () => [{}, jest.fn()],
//     atom: jest.fn(),
//     useSetRecoilState: () => jest.fn()
//   }));

export const atom = jest.fn();
export const useRecoilState = () => [{}, jest.fn()];
export const useSetRecoilState = () => jest.fn();
