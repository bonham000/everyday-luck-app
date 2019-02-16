import React from "react";
import { ActivityIndicator } from "react-native";

import { COLORS } from "@src/constants/Colors";

export default () => (
  <ActivityIndicator size="large" color={COLORS.primaryBlue} />
);
