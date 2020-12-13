import styled from "@emotion/native";
import { WebBrowser } from "expo";
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
            </DescriptionText>
            <DescriptionText>
              The HSK is the standardized test of Standard Chinese language
              proficiency of China for non-native speakers such as foreign
              students and overseas Chinese. This app provides 5,000 words to
              learn from these vocabulary lists.
            </DescriptionText>
            <DescriptionText>
              The goal of the app is to provide an easy and approachable way to
              practice learning and reviewing these words everyday. That's where
              the notion 天天吉 comes into play.
            </DescriptionText>
            <DescriptionText>
              You just need a little luck everyday to learn Chinese! The name
              itself also hides a clever joke, if you read "jí" differently as
              "jú", the name is 天天桔 - "Everyday Orange" or "Everyday
              Mandarin".
            </DescriptionText>
            <Emoji>🌌🌃🌆🌇</Emoji>
            <LinkText onPress={this.openHSKLink}>
              Learn more about the HSK
            </LinkText>
          </ScrollContainer>
        </ScreenTop>
        <ScreenBottom>
          <Button onPress={this.handleNavigate(ROUTE_NAMES.ABOUT_DETAIL)}>
            Next!
          </Button>
        </ScreenBottom>
      </Screen>
    );
  }

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
}

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const DescriptionText = styled.Text({
  marginTop: 18,
  fontSize: 18,
  width: "90%",
  fontWeight: "400",
  textAlign: "center",
});

const Emoji = styled.Text({
  fontSize: 34,
  marginTop: 22,
});

const LinkText = styled.Text({
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
