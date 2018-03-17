import React, { Component } from "react";
import * as styles from "./TicTacToeCell.css";

interface Props {
  /**
   * Value to display, either empty (" ") or "X" / "O".
   *
   * @default " "
   **/
  value?: " " | "X" | "O";

  /** Cell position on game board. */
  position: { x: number; y: number };

  /** Called when an empty cell is clicked. */
  onClick?: (x: number, y: number) => void;
}

/**
 * TicTacToe game cell. Displays a clickable button when the value is " ",
 * otherwise displays "X" or "O".
 */
export class TicTacToeCell extends Component<Props> {
  handleClick = () => {
    const { position: { x, y }, onClick } = this.props;
    if (!onClick) return;

    onClick(x, y);
  };

  render() {
    const { value = " " } = this.props;
    const disabled = value !== " ";
    const classes = `${styles.button} ${disabled ? styles.disabled : ""}`;

    return (
      <button
        className={classes}
        disabled={disabled}
        onClick={this.handleClick}
      >
        {value}
      </button>
    );
  }
}
