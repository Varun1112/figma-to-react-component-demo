import React from "react";
import { useTokens } from "../tokens/provider";

interface Props {
  label: React.ReactNode;
  primary?: boolean;
}

export function Button(props: Props) {
  const tokens = useTokens("button");

  const buttonStyle: React.CSSProperties = {
    color: tokens.textColor,
    borderRadius: tokens.borderRadius,
  };

  if (props.primary) {
    buttonStyle.backgroundColor = tokens.background;
  }

  return React.createElement(
    "button",
    {
      style: buttonStyle,
    },
    props.label
  );
}