import React, { FC } from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { TicTacToeGameBoard } from "./TicTacToeGameBoard";
import TicTacToeCell, { TicTacToeCellProps } from "../TicTacToeCell";

const stories = storiesOf("Components", module);

stories.addDecorator(withInfo);
stories.addParameters({ info: { inline: true } });

stories.add("TicTacToeGameBoard", () => (
  <div style={{ display: "flex" }}>
    <div style={{ width: 300, marginRight: 20 }}>
      <TicTacToeGameBoard cells={placeholderCells} />
    </div>
    <div style={{ width: 300 }}>
      <TicTacToeGameBoard cells={gameCells} lineStyle="dashed" />
    </div>
  </div>
));

const PlaceholderCell: FC = () => (
  <p style={{ margin: 0, color: "#eee" }}>Cell</p>
);

const placeholderCells = Array.from({ length: 9 }, (_, index) => (
  <PlaceholderCell key={index} />
));

const gameCellValues = "XOX O O X".split("") as TicTacToeCellProps["value"][];
const gameCells = Array.from(gameCellValues, (char, index) => (
  <TicTacToeCell
    key={index}
    value={char}
    position={{ x: index % 3, y: index / 3 }}
  />
));
