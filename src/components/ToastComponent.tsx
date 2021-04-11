import styled from "@emotion/native";
import { NativeStyleThemeProps } from "@src/AppContainer";
import { COLORS } from "@src/constants/Theme";
import React from "react";

/** ========================================================================
 * React Class
 * =========================================================================
 */

const CustomToast = ({
  message,
  close,
}: {
  message: string;
  close: () => void;
}) => {
  if (!message) {
    return null;
  }

  return (
    <BarContainer onPress={close}>
      <Bar>
        <ToastText>{message}</ToastText>
      </Bar>
    </BarContainer>
  );
};

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const BarContainer = styled.TouchableOpacity({
  zIndex: 25,
  marginTop: 55,
  width: "100%",
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
});

const Bar = styled.View<any>`
  width: 90%;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  background-color: rgba(45,45,45,0.91);
  /* background-color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark"
      ? "rgba(215,215,215,0.95)"
      : "rgba(45,45,45,0.91)"}; */
`;

const ToastText = styled.Text<any>`
  margin: 10px;
  font-size: 18px;
  color: ${COLORS.textDarkTheme};
  /* color: ${(props: NativeStyleThemeProps) =>
    props.theme.type === "dark" ? COLORS.darkText : COLORS.textDarkTheme}; */
`;

/** ========================================================================
 * Export
 * =========================================================================
 */

export { CustomToast };
