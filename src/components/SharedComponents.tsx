import glamorous from "glamorous-native";
import React from "react";
import { ScrollView } from "react-native";

import { COLORS } from "@src/constants/Colors";

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
      paddingBottom: 150,
      alignItems: "center",
    }}
  >
    {props.children}
  </ScrollView>
);

/** ========================================================================
 * Export
 * =========================================================================
 */

export { Bold, Container, BasicContainer, ScrollContainer };
