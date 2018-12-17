import { WebBrowser } from "expo";
import glamorous from "glamorous-native";
import React from "react";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { COLORS } from "@src/styles/Colors";

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

class AboutScreen extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <Container>
        <Text style={TextStyles}>
          This is an app to help you learn languages! It currently supports
          Mandarin and Korean.
        </Text>
        <Text onPress={this.openAboutLink} style={LinkStyles}>
          Source 👨‍💻
        </Text>
      </Container>
    );
  }

  openAboutLink = async () => {
    try {
      await WebBrowser.openBrowserAsync(
        "https://github.com/bonham000/mandarin",
      );
    } catch (_) {
      return; // no-op
    }
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = glamorous.view({
  flex: 1,
  paddingTop: 75,
  alignItems: "center",
  backgroundColor: "rgb(231,237,240)",
});

const TextStyles = {
  fontSize: 16,
  width: "88%",
  fontWeight: "bold",
  textAlign: "center",
};

const LinkStyles = {
  fontSize: 16,
  marginTop: 28,
  fontWeight: "bold",
  color: COLORS.primaryBlue,
};

/** ========================================================================
 * Export
 * =========================================================================
 */

export default AboutScreen;
