import React from "react";
import handleHastagMention from "../../utils/hastag/hastagMention";

const useTagging = (initial = "") => {
  const [state, setState] = React.useState(initial);

  const setTagging = (text) => {
    if (text.length === 0) {
      setState("");
      return;
    }
    handleHastagMention(text, setState);
  };
  return [state, setTagging];
};

export default useTagging;
