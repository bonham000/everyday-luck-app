import React from "react";
import styled from "@emotion/native";

import { COLORS } from "@src/constants/Theme";

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
      <Bar style={{ background: "rgb(25,25,25)" }}>
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
  marginTop: 52,
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
  background-color: rgba(52, 52, 52, 0.95);
  border: 1px solid ${COLORS.actionButtonMint};
`;

const ToastText = styled.Text<any>`
  margin: 10px;
  font-size: 18px;
  color: ${COLORS.textDarkTheme};
`;

/** ========================================================================
 * Export
 * =========================================================================
 */

export { CustomToast };
