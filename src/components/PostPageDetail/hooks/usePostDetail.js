

const usePostDetail = () => {

    const updateVoteLatestChildrenHook = (commentList, dataUpdated) => {
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

    return {updateVoteLatestChildrenHook}
}



export default usePostDetail