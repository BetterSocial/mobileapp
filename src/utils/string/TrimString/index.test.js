import {trimString, addDotAndRemoveNewline} from './index';

describe('TrimString function should run correctly', () => {
  it('testing trim String', () => {
    expect(trimString('saya suka makan sayur', 10)).toEqual('saya suka ... ');
    expect(trimString(null)).toEqual('');
  });
  it('addDotAndRemoveNewline should run correctly', () => {
    expect(addDotAndRemoveNewline('     halo pak \n')).toEqual('halo pak');
    expect(addDotAndRemoveNewline('\n')).toEqual('\n');
  });
});
