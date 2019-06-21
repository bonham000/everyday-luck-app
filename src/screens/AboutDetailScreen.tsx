import glamorous from "glamorous-native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import {
  Button,
  Screen,
  ScreenBottom,
  ScreenTop,
} from "@src/components/SharedComponents";
import { ROUTE_NAMES } from "@src/constants/RouteNames";
import { resetNavigation } from "@src/tools/navigation-utils";
import { Image, View } from "react-native";

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

export class AboutDetailScreenComponent extends React.Component<IProps, {}> {
  render(): JSX.Element {
    return (
      <Screen>
        <ScreenTop style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              resizeMode="contain"
              style={{ width: 100, height: 100 }}
              source={require("../assets/icon.png")}
            />
          </View>
          <DescriptionText>
            The HSK content is organized into 6 lists. Each list in the app
            divides the content into many lessons, which you must complete in
            order. To complete a lesson, you must complete all 4 quizzes in the
            lesson with a perfect score.
          </DescriptionText>
          <DescriptionText>
            Passing a quiz earns you experience points which you can use to
            correct missed answers on a quiz attempt. The best way to earn
            experience points is to practice the Daily Challenge Quiz (天天桔)！
          </DescriptionText>
          <DescriptionText>
            The Daily Challenge Quiz is a shuffled review of all the words you
            have studied so far.
          </DescriptionText>
        </ScreenTop>
        <ScreenBottom>
          <Button onPress={this.navigateHome}>Start Learning!</Button>
        </ScreenBottom>
      </Screen>
    );
  }

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

/** ========================================================================
 * Export
 * =========================================================================
 */

export default AboutDetailScreenComponent;
