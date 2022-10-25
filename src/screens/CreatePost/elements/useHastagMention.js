import React from "react";

import handleHastagMention from "../../../utils/hastag/hastagMention";

const useHastagMention = (initial = "") => {
  const [state, setState] = React.useState(initial);
  const [hashtags, setHashtags] = React.useState([]);
  const handleStateHastag = (text) => {
    if (!text) {
      setState("");
      return;
    }
    handleHastagMention(text, setState, hashtags);
  };

  const handleStateMention = (text) => {
    console.log("lengteh", text.length);
    if (text.length === 0) {
      setState("");
      return;
    }
    handleHastagMention(text, setState, hashtags);
  };
  return [state, handleStateHastag, handleStateMention, setHashtags];
};

export default useHastagMention;
