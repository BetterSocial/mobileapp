import React from 'react'

function useFollow(defaultValue) {
  const [state, setState] = React.useState(defaultValue);
  const handleFollow = () => {
    setState(!state);
  }

  return [
    state,
    handleFollow
  ]

}

export default useFollow;