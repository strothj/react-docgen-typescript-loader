import * as React from "react";

interface ColorButtonProps {
  /**
   * Buttons background color
   **/
  color: "blue" | "green";

  /**
   * Font size in rem.
   *
   * @default 2
   */
  fontSize?: number;
}

/** A button with a configurable background color. */
export const ColorButton: React.SFC<ColorButtonProps> = props => (
  <button
    style={{
      padding: 40,
      color: "#eee",
      backgroundColor: props.color,
      fontSize: `${props.fontSize || 2}rem`,
    }}
  >
    {props.children}
  </button>
);

export default ColorButton;
