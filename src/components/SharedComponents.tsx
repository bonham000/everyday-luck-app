import glamorous from "glamorous-native";
import React from "react";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";

import { COLORS } from "@src/constants/Theme";

/** ========================================================================
 * Components
 * =========================================================================
 */

const Bold = glamorous.text({
  fontWeight: "bold",
});

const BasicContainer = glamorous.view({
  flex: 1,
  backgroundColor: COLORS.background,
});

const Container = glamorous.view({
  flex: 1,
  paddingTop: 25,
  alignItems: "center",
  backgroundColor: COLORS.background,
});

const ScrollContainer = (props: { children: any }) => (
  <ScrollView
    contentContainerStyle={{
      flexGrow: 1,
      width: "100%",
      paddingTop: 25,
      paddingBottom: 50,
      alignItems: "center",
      backgroundColor: COLORS.background,
    }}
  >
    {props.children}
  </ScrollView>
);

const ButtonStyles: ViewStyle = {
  marginTop: 15,
  marginBottom: 15,
  height: 40,
  minWidth: 225,
  alignItems: "center",
  justifyContent: "center",
};

const LineBreak = glamorous.view({
  width: "85%",
  marginTop: 12,
  marginBottom: 12,
  backgroundColor: "black",
  height: StyleSheet.hairlineWidth,
});

const Screen = glamorous.view({
  flex: 1,
  backgroundColor: COLORS.background,
});

const ScreenTop = glamorous.view({
  flex: 8,
  width: "100%",
});

const ScreenBottom = glamorous.view({
  flex: 1,
  width: "100%",
  alignItems: "center",
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export {
  Bold,
  Container,
  BasicContainer,
  ScrollContainer,
  ButtonStyles,
  LineBreak,
  Screen,
  ScreenTop,
  ScreenBottom,
};
