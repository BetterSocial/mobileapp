const useImageLayout = () => {
  const handleImageWidth = (length, index) => {
    if (length > 2 && length % 2 === 0) {
      return {
        height: '50%',
        width: '50%'
      };
    }
    if (length > 2 && length % 2 === 1) {
      if (index === length - 1) {
        return {
          height: '50%',
          width: '100%'
        };
      }
      return {
        height: '50%',
        width: '50%'
      };
    }
    if (length === 2) {
      return {
        height: '100%',
        width: '50%'
      };
    }
    return {
      height: '100%',
      width: '100%'
    };
  };

  return {
    handleImageWidth
  };
};

export default useImageLayout;
