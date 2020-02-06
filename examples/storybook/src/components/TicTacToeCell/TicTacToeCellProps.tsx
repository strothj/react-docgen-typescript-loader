export interface TicTacToeCellProps {
  /**
   * Value to display, either empty (" ") or "X" / "O".
   *
   * @default " "
   **/
  value?: " " | "X" | "O";

  /**
   * Cell position on game board.
   */
  position: {
    x: number;
    y: number;
  };

  /**
   * Called when an empty cell is clicked.
   */
  onClick?: (x: number, y: number) => void;
}
