import glamorous from "glamorous-native";
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

const BarContainer = glamorous.touchableOpacity({
  zIndex: 25,
  marginTop: 42,
  width: "100%",
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
});

const Bar = glamorous.view({
  width: "90%",
  borderRadius: 3,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(45,45,45,0.91)",
});

const ToastText = glamorous.text({
  color: "white",
  fontSize: 18,
  margin: 10,
});

/** ========================================================================
 * Export
 * =========================================================================
 */

export { CustomToast };
