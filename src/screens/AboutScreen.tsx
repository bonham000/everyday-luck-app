import { WebBrowser } from "expo";
import glamorous from "glamorous-native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { Bold } from "@src/components/SharedComponents";
import { COLORS } from "@src/constants/Colors";
import { ROUTE_NAMES } from "@src/constants/RouteNames";

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
        <DescriptionText>
          This app uses the vocabulary content from the{" "}
          <Bold>Hanyu Shuiping Kaoshi</Bold> (Chinese Proficiency Test). This
          test is the standardized test of Standard Chinese language proficiency
          of China for non-native speakers such as foreign students and overseas
          Chinese.
        </DescriptionText>
        <DescriptionText>
          There are 6 levels total, which comprise a total of 5,000 words and
          about 2,500 characters. The goal of the app is to break these lessons
          into a series of small challenges which can be mastered with a little
          practice each day.
        </DescriptionText>
        <Emoji>🌌🌃🌆🌇</Emoji>
        <LinkText onPress={this.navigateToContact}>Contact</LinkText>
        <LinkText onPress={this.openAboutLink}>
          This app is Open Source
        </LinkText>
        <LinkText onPress={this.openHSKLink}>Learn more about the HSK</LinkText>
      </Container>
    );
  }

  openAboutLink = async () => {
    try {
      await WebBrowser.openBrowserAsync(
        "https://github.com/bonham000/mandarin",
      );
    } catch (_) {
      return;
    }
  };

  openHSKLink = async () => {
    try {
      await WebBrowser.openBrowserAsync(
        "https://en.wikipedia.org/wiki/Hanyu_Shuiping_Kaoshi",
      );
    } catch (_) {
      return;
    }
  };

  navigateToContact = () => {
    this.props.navigation.navigate(ROUTE_NAMES.CONTACT);
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const Container = glamorous.view({
  flex: 1,
  paddingTop: 25,
  alignItems: "center",
  backgroundColor: COLORS.wordCardBackground,
});

const DescriptionText = glamorous.text({
  marginTop: 18,
  fontSize: 18,
  width: "90%",
  fontWeight: "400",
  textAlign: "center",
});

const Emoji = glamorous.text({
  fontSize: 34,
  marginTop: 22,
});

const LinkText = glamorous.text({
  fontSize: 16,
  marginTop: 28,
  fontWeight: "500",
  color: COLORS.primaryBlue,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default AboutScreen;
