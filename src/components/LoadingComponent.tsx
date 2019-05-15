import glamorous from "glamorous-native";
import React from "react";
import { ActivityIndicator } from "react-native";

import { COLORS } from "@src/constants/Colors";

export default () => (
  <Container>
    <ActivityIndicator size="large" color={COLORS.primaryRed} />
  </Container>
);

const Container = glamorous.view({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
});
