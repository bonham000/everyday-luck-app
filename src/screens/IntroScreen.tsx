import glamorous from "glamorous-native";
import React from "react";
import { NavigationScreenProp } from "react-navigation";

import { Bold, Container } from "@src/components/SharedComponents";
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
      <Container>
        <DescriptionText>
          <Bold>TODO:</Bold> Add Intro Screen(s).
        </DescriptionText>
      </Container>
    );
  }

  navigateToContact = () => {
    this.props.navigation.navigate(ROUTE_NAMES.HOME);
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

// const Emoji = glamorous.text({
//   fontSize: 34,
//   marginTop: 22,
// });

// const LinkText = glamorous.text({
//   fontSize: 16,
//   marginTop: 28,
//   fontWeight: "500",
//   color: COLORS.primaryBlue,
// });

/** ========================================================================
 * Export
 * =========================================================================
 */

export default IntroScreenComponent;
