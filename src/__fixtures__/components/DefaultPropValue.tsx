import * as React from "react";

interface DefaultPropValueComponentProps {
  /**
   * Button color.
   *
   * @default blue
   **/
  color: "blue" | "green";
}

/**
 * Component with a prop with a default value.
 */
export const DefaultPropValueComponent: React.SFC<
  DefaultPropValueComponentProps
> = props => (
  <button style={{ backgroundColor: props.color }}>{props.children}</button>
);
