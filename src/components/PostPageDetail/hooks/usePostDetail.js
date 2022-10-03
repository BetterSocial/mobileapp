

const usePostDetail = () => {

    const updateVoteLatestChildrenLevel3 = (commentList, dataUpdated) => {
    const updateComment = commentList.map((comment) => {
      if(comment.activity_id === dataUpdated.activity_id) {
        const latestChildrenMap = comment.latest_children.comment.map((com) => {
          if(com.id ===  dataUpdated.parent) {
            const mappingChildren2 = com.latest_children.comment.map((com1) => {
              if(com1.id === dataUpdated.id) {
                return {...com1, data: dataUpdated.data}
              } 
                return {...com1}
              
            })
            return {...com, latest_children: {comment: mappingChildren2}}
          }
          return {...com}
        })
        return {...comment, latest_children: {comment: latestChildrenMap}}
      }
      return {...comment}
    })
    return updateComment
  }

  const updateVoteChildrenLevel1 = (commentList, dataUpdated) => {
          const newComment = commentList.map((myComment) => {
          if(myComment.id === dataUpdated.parent) {
            const newChild = myComment.latest_children.comment.map((child) => {
              if(child.id === dataUpdated.id) {
                return {...child, data: dataUpdated.data}
              } 
                return {...child}
              
            })
            return {...myComment, latest_children: {comment: newChild}}
          }
        return {...myComment}
      })
      return newComment
  }

    return {updateVoteLatestChildrenLevel3, updateVoteChildrenLevel1}
}



export default usePostDetail