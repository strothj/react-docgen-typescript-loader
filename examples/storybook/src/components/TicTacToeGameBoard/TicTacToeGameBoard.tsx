import React, { ReactElement, FC } from "react";
import "./TicTacToeGameBoard.css";

interface Props {
  /**
   * An array of 9 React elements to serve as the Tic Tac Toe game cells.
   */
  cells: ReactElement<any>[];

  /**
   * Line style to use when dividing game cells.
   *
   * @default "solid"
   */
  lineStyle?: "solid" | "dashed";
}

/**
 * Arranges the React elements provided by "cells" within a Tic Tac Toe board.
 * It requires that 9 elements be provided. The game board maintains a 1:1 size
 * ratio.
 */
export const TicTacToeGameBoard: FC<Props> = props => {
  const { cells, lineStyle = "solid", ...rest } = props;

  return (
    <div className="ttt-game-board" {...rest}>
      <div className="ttt-game-board__content">
        {cells.map((cell, index) => (
          <div
            key={index}
            className="ttt-game-board__cell"
            style={{ borderStyle: lineStyle }}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
};
