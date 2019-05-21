import glamorous from "glamorous-native";
import React from "react";
import { ActivityIndicator } from "react-native";

import { COLORS } from "@src/constants/Colors";
import { Text } from "react-native-paper";

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
      backgroundColor: COLORS.white,
    }}
  >
    <ActivityIndicator size="large" color={COLORS.primaryRed} />
  </Container>
);

const WelcomeText = glamorous.text({
  marginTop: 55,
  fontSize: 45,
  fontWeight: "bold",
});

const Container = glamorous.view({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export { LoadingComponent, TransparentLoadingComponent };
