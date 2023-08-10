import {addDotAndRemoveNewline, trimString} from './index';

it('testing trim String', () => {
  expect(trimString('saya suka makan sayur', 10)).toEqual('saya suka ... ');
});

it('testing trim String error', () => {
  expect(trimString(null, 10)).toEqual('');
});

it('should remove white space and add dot', () => {
  expect(addDotAndRemoveNewline('hello  ')).toEqual('hello');
  expect(addDotAndRemoveNewline('hello    ')).toEqual('hello');
});
