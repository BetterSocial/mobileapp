export const trimString = (string, length) => {
  if (string && typeof string === 'string') {
    return string.length > length ? `${string.substring(0, length)}... ` : string;
  }
  return '';
};

export const addDotAndRemoveNewline = (text) => {
  const trimmedText = text.trim();

  const textWithoutNewline = trimmedText.replace(/(?:\n+)$/, '');

  if (textWithoutNewline.length > 0) {
    return `${textWithoutNewline}`;
  }
  return text;
};
