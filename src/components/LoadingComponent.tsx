import glamorous from "glamorous-native";
import React from "react";
import { ActivityIndicator } from "react-native";

import { COLORS } from "@src/constants/Colors";
import { Container } from "./SharedComponents";

/** ========================================================================
 * Component
 * =========================================================================
 */

const LoadingComponent = ({ transparent }: { transparent?: boolean }) => (
  <Container style={{ opacity: transparent ? 0.5 : 1 }}>
    <ActivityIndicator size="large" color={COLORS.primaryRed} />
    <WelcomeText>大家好</WelcomeText>
  </Container>
);

const TransparentLoadingComponent = () => (
  <Container
    style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      opacity: 0.65,
      backgroundColor: COLORS.lightWhite,
    }}
  >
    <ActivityIndicator size="large" color={COLORS.primaryRed} />
  </Container>
);

const WelcomeText = glamorous.text({
  marginTop: 55,
  fontSize: 45,
  fontWeight: "bold",
  color: COLORS.darkText,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export { LoadingComponent, TransparentLoadingComponent };
