import styled from "@emotion/native";
import React from "react";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";

import { COLORS } from "@src/constants/Theme";
import { Text } from "react-native-paper";
import { NativeStyleThemeProps } from "App";

/** ========================================================================
 * Components
 * =========================================================================
 */

interface ButtonProps {
  style?: ViewStyle;
  children: string | ReadonlyArray<string>;
  onPress: (args?: any) => void;
}

const Button = (buttonProps: ButtonProps) => {
  const { style, onPress, children } = buttonProps;
  return (
    <ButtonBaseStyles style={style} onPress={onPress}>
      <Text style={{ fontWeight: "bold", fontSize: 16, color: COLORS.white }}>
        {children}
      </Text>
    </ButtonBaseStyles>
  );
};

const ButtonBaseStyles = styled.TouchableOpacity({
  marginTop: 15,
  marginBottom: 15,
  height: 40,
  minWidth: 225,
  paddingRight: 15,
  paddingLeft: 15,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: COLORS.primaryBlue,
});

const Bold = styled.Text({
  fontWeight: "bold",
});

const BasicContainer = styled.View({
  flex: 1,
  backgroundColor: COLORS.background,
});

const Container = styled.View({
  flex: 1,
  paddingTop: 25,
  alignItems: "center",
  backgroundColor: COLORS.background,
});

const ScrollContainer = (props: { children: any; style?: ViewStyle }) => (
  <StyledScrollView
    contentContainerStyle={{
      flexGrow: 1,
      width: "100%",
      paddingTop: 25,
      paddingBottom: 50,
      alignItems: "center",
      ...props.style,
    }}
  >
    {props.children}
  </StyledScrollView>
);

const StyledScrollView = styled.ScrollView<any>`
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.backgroundDark : COLORS.background};
`;

const LineBreak = styled.View({
  width: "85%",
  marginTop: 12,
  marginBottom: 12,
  backgroundColor: "black",
  height: StyleSheet.hairlineWidth,
});

const Screen = styled.View`
  flex: 1;
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.backgroundDark : COLORS.background};
`;

const ScreenTop = styled.View({
  flex: 8,
  width: "100%",
});

const ScreenBottom = styled.View({
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
  Button,
  Container,
  BasicContainer,
  ScrollContainer,
  LineBreak,
  Screen,
  ScreenTop,
  ScreenBottom,
};
