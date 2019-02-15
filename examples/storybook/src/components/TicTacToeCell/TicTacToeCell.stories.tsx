import React, { CSSProperties } from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import { TicTacToeCell } from "./TicTacToeCell";

const stories = storiesOf("Components", module);

stories.addDecorator(withInfo);
stories.addParameters({ info: { inline: true } });

stories.add("TicTacToeCell", () => (
  <div style={styles.container}>
    <div style={styles.firstCellContainer}>
      <TicTacToeCell
        value="X"
        position={{ x: 0, y: 0 }}
        onClick={action("onClick")}
      />
    </div>
    <div style={styles.cellContainer}>
      <TicTacToeCell
        value=" "
        position={{ x: 0, y: 1 }}
        onClick={action("onClick")}
      />
    </div>
  </div>
));

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
  },
  cellContainer: {
    width: 100,
    height: 100,
    backgroundColor: "rgb(72, 78, 104)",
  },
};
styles.firstCellContainer = { ...styles.cellContainer, marginRight: 20 };
