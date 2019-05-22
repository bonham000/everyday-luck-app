import React from "react";
import { Text } from "react-native";

import { Container } from "@src/components/SharedComponents";

/** ========================================================================
 * Component
 * =========================================================================
 */

const ErrorComponent = () => (
  <Container style={{ justifyContent: "center" }}>
    <Text>Everything is broken... 🎭</Text>
  </Container>
);

/** ========================================================================
 * Export
 * =========================================================================
 */

export default ErrorComponent;
