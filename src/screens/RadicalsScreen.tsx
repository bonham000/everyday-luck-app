import styled from "@emotion/native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { Screen, ScrollContainer } from "@src/components/SharedComponents";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

export class RadicalsScreenComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <Screen>
        <ScrollContainer style={{ paddingTop: 5 }}>
          <DescriptionText>Learn about radicals in Chinese!</DescriptionText>
          <Italics>Work in progress...</Italics>
        </ScrollContainer>
      </Screen>
    );
  }
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const DescriptionText = styled.Text({
  marginTop: 18,
  fontSize: 18,
  width: "90%",
  fontWeight: "bold",
  textAlign: "center",
});

const Italics = styled.Text({
  marginTop: 24,
  fontStyle: "italic",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default RadicalsScreenComponent;
