import moment from "moment";


const useReplyComment = () => {

    const getThisCommentHook = (itemProp) => { 
            let comments = [];
            if (
            itemProp.latest_children &&
            itemProp.latest_children.comment &&
            Array.isArray(itemProp.latest_children.comment)
            ) {
                comments = itemProp.latest_children.comment.sort(
                    (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix(),
                );
            }
            return comments
    }

      const updateReplyPostHook = (comment, itemParentProps, commentId) => {
            console.log(comment, itemParentProps, commentId, 'meme2')
            if(itemParentProps) {
                const updateComment = itemParentProps.latest_children.comment.map((dComment) => {
                    if(dComment.id === commentId) {
                    return {...dComment, latest_children: {...dComment.latest_children, comment}, children_counts: {comment: comment.length}}
                    } 
                    return {...dComment}
                    
                })
                const replaceComment = {...itemParentProps, latest_children: {...itemParentProps.latest_children, comment: updateComment}}
                return {replaceComment, updateComment}


            }
            return {replaceComment: itemParentProps, updateComment: itemParentProps}

    }

      const initReplyHook = (item) => {
        if (item.latest_children && item.latest_children.comment) {
          return item.latest_children.comment.length
        }
        return 0
  }

    return {getThisCommentHook, updateReplyPostHook, initReplyHook}
}



export default useReplyComment