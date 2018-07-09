import React, { SFC } from "react";

interface IProps {
  /**
   * Some color.
   *
   * @default blue
   */
  color: string;
}

export const ExampleComponent: SFC<IProps> = ({ color }) => <div>{color}</div>;
