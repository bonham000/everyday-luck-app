import styled from "@emotion/native";
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

export class IntroScreenComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <Screen>
        <ScreenTop>
          <ScrollContainer style={{ paddingTop: 5 }}>
            <DescriptionText>
              Chinese is a complex family of languages, predominated by the
              official Beijing dialect of Mandarin, which is the official
              language of China, Taiwan, and one the four official languages of
              Singapore.
            </DescriptionText>
            <DescriptionText>
              There are two main writing systems for Chinese:{" "}
              <Bold>Traditional</Bold> and <Bold>Simplified</Bold>. As the names
              imply, Simplified Chinese (简化字: jiǎnhuàzì) is a simplified
              version of the often more complex Traditional Chinese characters.
              These were recently created and adopted in mainland China to
              encourage literacy.
            </DescriptionText>
            <DescriptionText>
              <Bold>Pinyin</Bold> is the official romanization system for
              standard Chinese. It represents words like 中文 (Chinese) with the
              Roman alphabet: Zhōngwén. Pinyin is very useful for teaching and
              writing Chinese.
            </DescriptionText>
            <DescriptionText>
              For instance, you can enable Chinese language on modern computer
              devices (phone, computer, etc) to type pinyin and then see a
              selection of Chinese characters which match what you typed. Then
              you just select the characters you intended. This is the method we
              recommend for typing pinyin in the quizzes in this app.
            </DescriptionText>
            <DescriptionText>
              On the next screen, you will see some more information about this
              app and how it works.
            </DescriptionText>
          </ScrollContainer>
        </ScreenTop>
        <ScreenBottom>
          <Button onPress={this.handleNavigate}>Next!</Button>
        </ScreenBottom>
      </Screen>
    );
  }

  handleNavigate = () => {
    this.props.navigation.navigate(ROUTE_NAMES.ABOUT);
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

/** ========================================================================
 * Export
 * =========================================================================
 */

export default IntroScreenComponent;
