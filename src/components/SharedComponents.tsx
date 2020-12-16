import styled from "@emotion/native";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

import { NativeStyleThemeProps } from "@src/AppContainer";
import { COLORS } from "@src/constants/Theme";
import { Text, TextInput } from "react-native-paper";

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

const BasicContainer = styled.View<any>`
  flex: 1;
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.backgroundDark : COLORS.background};
`;

const Container = styled.View<any>`
  flex: 1;
  padding-top: 25px;
  align-items: center;
  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.backgroundDark : COLORS.background};
`;

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

const Screen = styled.View<any>`
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

interface LessonBlockProps {
  hskLocked: boolean;
  isLocked: boolean;
  inProgress: boolean;
}

export const LessonBlock = styled.TouchableOpacity<any>`
  height: 50px;
  padding: 12px;
  margin: 4px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  background-color: ${(props: NativeStyleThemeProps & LessonBlockProps) => {
    if (!props.hskLocked) {
      return COLORS.lessonMTC;
    }

    if (props.theme.type === "dark") {
      if (props.isLocked) {
        return COLORS.lessonBlockDarkInactive;
      } else if (props.inProgress) {
        return COLORS.lessonBlockInProgress;
      }
    } else {
      if (props.isLocked) {
        return COLORS.lessonBlockLightInactive;
      } else if (props.inProgress) {
        return COLORS.lessonBlockInProgress;
      }
    }

    return COLORS.lessonBlock;
  }};
`;

export const LessonBlockText = styled.Text<any>`
  font-size: 14px;
  font-weight: 500;

  color: ${(
    props: NativeStyleThemeProps & { isLocked: boolean; mtcLesson: boolean },
  ) => {
    if (props.theme.type === "dark") {
      if (props.isLocked) {
        return COLORS.inactive;
      } else {
        return "black";
      }
    } else {
      if (props.isLocked) {
        return COLORS.fadedText;
      } else {
        return "black";
      }
    }
  }};
`;

export const StyledText = styled.Text<any>`
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.whiteThemeText : COLORS.darkText};
`;

export const StyledTextInput = styled(TextInput)<any>`
  width: 95%;
  font-size: 18px;
  margin-top: 12px;
  color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.white : COLORS.darkText};

  background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark"
      ? COLORS.textInputDarkTheme
      : COLORS.textInputLightTheme};
`;

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
