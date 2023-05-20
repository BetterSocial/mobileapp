export const getFileName = (uri) => {
  const splitter = uri.split('/');
  const fileName = splitter[splitter.length - 1];
  return fileName;
};

export const composeImageMeta = (path) => {
  return {
    uri: path,
    name: getFileName(path),
    type: 'image/jpeg'
  };
};
