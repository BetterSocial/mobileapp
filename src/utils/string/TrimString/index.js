export const trimString = (string, length) => {
  if(string && typeof string === 'string') {
      return string.length > length ? `${string.substring(0, length)  }... ` : string;

  }
  return ''
};
