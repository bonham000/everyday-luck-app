import { WebBrowser } from "expo";
import glamorous from "glamorous-native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import {
  Bold,
  Button,
  Screen,
  ScreenBottom,
  ScreenTop,
  ScrollContainer,
} from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { COLORS } from "@src/constants/Theme";
import { resetNavigation } from "@src/tools/navigation-utils";

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

export class AboutScreenComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <Screen>
        <ScreenTop>
          <ScrollContainer style={{ paddingTop: 5 }}>
            <DescriptionText>
              This app uses the vocabulary content from the{" "}
              <Bold>Hanyu Shuiping Kaoshi</Bold> (Chinese Proficiency Test).
              This test is the standardized test of Standard Chinese language
              proficiency of China for non-native speakers such as foreign
              students and overseas Chinese.
            </DescriptionText>
            <DescriptionText>
              There are 6 levels total, which comprise a total of 5,000 words
              and about 2,500 characters. The goal of the app is to break these
              lessons into a series of small challenges which can be mastered
              with a little practice each day.
            </DescriptionText>
            <Emoji>🌌🌃🌆🌇</Emoji>
            <LinkText onPress={this.handleNavigate(ROUTE_NAMES.CONTACT)}>
              Contact
            </LinkText>
            <LinkText onPress={this.openAboutLink}>
              This app is Open Source
            </LinkText>
            <LinkText onPress={this.openHSKLink}>
              Learn more about the HSK
            </LinkText>
          </ScrollContainer>
        </ScreenTop>
        <ScreenBottom>
          <Button onPress={this.navigateHome}>Next!</Button>
        </ScreenBottom>
      </Screen>
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

  handleNavigate = (route: ROUTE_NAMES) => () => {
    this.props.navigation.navigate(route);
  };

  navigateHome = () => {
    this.props.navigation.dispatch(resetNavigation(ROUTE_NAMES.HOME));
  };
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

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
  marginTop: 22,
  fontWeight: "500",
  color: COLORS.primaryBlue,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default AboutScreenComponent;
