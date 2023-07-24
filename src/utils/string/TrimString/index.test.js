import {trimString} from './index';

it('testing trim String', () => {
  expect(trimString('saya suka makan sayur', 10)).toEqual('saya suka ... ');
});

it('testing trim String error', () => {
  expect(trimString(null, 10)).toEqual('');
});
