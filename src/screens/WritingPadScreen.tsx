import styled from "@emotion/native";
import { Sketch } from "expo-pixi";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { BasicContainer } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Theme";
import {
  GlobalStateContextProps,
  withGlobalStateContext,
} from "@src/providers/GlobalStateProvider";
import { LessonScreenParams } from "@src/tools/types";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps extends GlobalStateContextProps {
  navigation: NavigationScreenProp<{}, LessonScreenParams>;
}

interface IState {
  renderNull: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class WritingPadScreenComponent extends React.Component<IProps, IState> {
  sketch: any = null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      renderNull: false,
    };
  }

  render(): JSX.Element | null {
    const { renderNull } = this.state;

    // This is shit we all know it!
    if (renderNull) {
      return null;
    }

    // Sketch configuration settings
    const width = 25;
    const alpha = 1;
    const white = 0xe3e1da;
    const dark = 0x21211f;
    const color = this.props.appTheme === "dark" ? white : dark;

    return (
      <BasicContainer>
        <Sketch
          style={{ flex: 1 }}
          strokeColor={color}
          strokeWidth={width}
          strokeAlpha={alpha}
          ref={this.assignSketchRef}
        />
        <Controls>
          <Control
            onPress={this.resetPad}
            style={{ backgroundColor: COLORS.actionButtonRed }}
          >
            <ControlText>Reset Pad</ControlText>
          </Control>
          <Control
            onPress={this.undoSketchLine}
            style={{ backgroundColor: COLORS.actionButtonYellow }}
          >
            <ControlText>Undo Stroke</ControlText>
          </Control>
        </Controls>
      </BasicContainer>
    );
  }

  undoSketchLine = () => {
    if (this.sketch) {
      this.sketch.undo();
    }
  };

  resetPad = () => {
    // Suck it expo-pixi .clear method, yeah - that's right!!!
    this.setState(
      {
        renderNull: true,
      },
      () => {
        this.setState(ps => ({ renderNull: false }));
      },
    );
  };

  assignSketchRef = (ref: any) => {
    // tslint:disable-next-line
    this.sketch = ref;
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const CONTROLS_HEIGHT = 75;

const Controls = styled.View({
  height: CONTROLS_HEIGHT,
  backgroundColor: COLORS.actionButtonYellow,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
});

const Control = styled.TouchableOpacity({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
});

const ControlText = styled.Text({
  fontSize: 18,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default withGlobalStateContext(WritingPadScreenComponent);
