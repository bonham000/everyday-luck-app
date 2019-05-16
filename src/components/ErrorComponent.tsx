import glamorous from "glamorous-native";
import React from "react";
import { Text } from "react-native";

/** ========================================================================
 * Component
 * =========================================================================
 */

const ErrorComponent = () => (
  <Container>
    <Text>Everything is broken... 🎭</Text>
  </Container>
);

const Container = glamorous.view({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export default ErrorComponent;
