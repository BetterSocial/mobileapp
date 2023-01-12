

const useReplyComment = () => {

    const isLast = (item, index, countComment) => (
      index === countComment - 1 && (item.children_counts.comment || 0) === 0
    );

    const isLastInParent = (index, countComment) => index === countComment - 1;

  return {
    isLast,
    isLastInParent
  }

}

export default useReplyComment