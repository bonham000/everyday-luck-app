import { WebBrowser } from "expo";
import glamorous from "glamorous-native";
import React from "react";
import { Text } from "react-native-paper";
import { NavigationScreenProp } from "react-navigation";

import { COLORS } from "@src/constants/Colors";

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
          This is an app to help you learn Mandarin! All the content is
          organized into a series of lessons. Future lessons are locked and
          require you to complete unlocked lessons first. To complete a lesson
          and unlock the next one, you have to get a perfect score on the quiz
          and multiple choice tests for that lesson. Good luck!
        </Text>
        <Text>✨✨✨</Text>
        <Text onPress={this.openAboutLink} style={LinkStyles}>
          Source Code 👨‍💻
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
