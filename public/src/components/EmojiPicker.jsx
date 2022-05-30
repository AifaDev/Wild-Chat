import React, { useEffect, useRef } from "react";

import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";

export function EmojiPicker(props) {
  const ref = useRef();

  useEffect(() => {
    new Picker({ ...props, data, ref });
  }, []);

  return <div ref={ref} />;
}
