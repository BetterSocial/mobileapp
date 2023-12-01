import React from 'react';

const useMedia = () => {
  const [count, setCount] = React.useState(5);
  const getSpace = (index) => {
    if (index === 0 && index + 1 === count) {
      setCount(index + 1 === count);
      return true;
    }
    return false;
  };

  return {
    getSpace,
    count,
    setCount
  };
};

export default useMedia;
