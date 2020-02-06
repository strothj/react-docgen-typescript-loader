import React, { Component } from "react";
import "./TicTacToeCell.css";
import { TicTacToeCellProps } from "./TicTacToeCellProps";

export { TicTacToeCellProps };

/**
 * TicTacToe game cell. Displays a clickable button when the value is " ",
 * otherwise displays "X" or "O".
 */
export class TicTacToeCell extends Component<TicTacToeCellProps> {
  handleClick = () => {
    const {
      position: { x, y },
      onClick,
    } = this.props;
    if (!onClick) return;

    onClick(x, y);
  };

  render() {
    const { value = " " } = this.props;
    const disabled = value !== " ";
    const classes = `ttt-cell ${disabled ? "ttt-cell--hidden" : ""}`;

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
