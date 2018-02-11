import * as React from "react";

interface ReactComponentProps {
  /** Color of button. */
  color: "green" | "blue";
}

/** This is a React component. */
export class ReactComponent extends React.Component<ReactComponentProps> {
  render() {
    return (
      <button style={{ backgroundColor: this.props.color }}>
        {this.props.children}
      </button>
    );
  }
}
