const useContainerComment = () => {
  const isLast = (index, item, comments) =>
    index === comments.length - 1 && (item.children_counts.comment || 0) === 0;

  const isLastInParent = (index, comments) => index === comments.length - 1;

  const hideLeftConnector = (index, comments) => index === comments.length - 1;

  return {
    isLast,
    isLastInParent,
    hideLeftConnector
  };
};

export default useContainerComment;
