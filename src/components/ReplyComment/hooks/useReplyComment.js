import moment from "moment";
import React from 'react'

const useReplyComment = () => {
    const [temporaryText, setTemporaryText] = React.useState('')
      const [textComment, setTextComment] = React.useState('');

    const setCommentHook = (text) => {
      setTemporaryText(text)
    };

    const handleFirstTextCommentHook = () => {
        setTextComment(temporaryText)

    }
  
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

    const isLastInParentHook = (index, item) => index === (item.children_counts.comment || 0) - 1;


    return {getThisCommentHook, updateReplyPostHook, setTemporaryText, setCommentHook, temporaryText, handleFirstTextCommentHook, textComment, isLastInParentHook}
}



export default useReplyComment