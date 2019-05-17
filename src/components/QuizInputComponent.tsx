import glamorous from "glamorous-native";
import React from "react";
import { GestureResponderEvent } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import Shaker from "@src/components/ShakerComponent";
import { COLORS } from "@src/constants/Colors";
import { COMPLIMENTS } from "@src/constants/Compliments";
import { APP_LANGUAGE_SETTING } from "@src/GlobalState";
import { Word } from "@src/tools/types";
import { randomInRange } from "@src/tools/utils";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
  valid: boolean;
  revealAnswer: boolean;
  didReveal: boolean;
  currentWord: Word;
  shouldShake: boolean;
  attempted: boolean;
  value: string;
  languageSetting: APP_LANGUAGE_SETTING;
  setInputRef: () => void;
  handleChange: () => void;
  handleProceed: () => (event: GestureResponderEvent) => void;
  handleToggleRevealAnswer: (event: GestureResponderEvent) => void;
  handleCheck: (
    correct: boolean,
  ) => (event: { nativeEvent: { text: string } }) => void;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

const QuizInput = ({
  valid,
  revealAnswer,
  currentWord,
  shouldShake,
  attempted,
  setInputRef,
  value,
  handleChange,
  handleCheck,
  handleProceed,
  handleToggleRevealAnswer,
  didReveal,
  languageSetting,
}: IProps) => {
  const correctValue = currentWord[languageSetting];

  /**
   * Function to check answer on submit.
   */
  const handleCheckAnswer = () => {
    if (value) {
      handleCheck(value === correctValue);
    }
  };

  return (
    <React.Fragment>
      {valid || revealAnswer ? (
        <QuizBox>
          <MandarinText>{correctValue}</MandarinText>
          <PinyinText>{currentWord.pinyin}</PinyinText>
        </QuizBox>
      ) : (
        <Shaker style={{ width: "100%" }} shouldShake={shouldShake}>
          <QuizBox>
            <EnglishText>"{currentWord.english}"</EnglishText>
            <TextInput
              mode="outlined"
              error={attempted}
              ref={setInputRef}
              style={TextInputStyles}
              value={value}
              onChangeText={handleChange}
              label="Translate the English to Mandarin please"
              onSubmitEditing={handleCheckAnswer}
            />
          </QuizBox>
        </Shaker>
      )}
      <Button
        dark
        mode="contained"
        style={{
          marginTop: 30,
          minWidth: 215,
          backgroundColor: revealAnswer
            ? COLORS.actionButtonMint
            : !valid && attempted
            ? COLORS.primaryRed
            : COLORS.primaryBlue,
        }}
        onPress={
          valid
            ? handleProceed()
            : revealAnswer
            ? handleToggleRevealAnswer
            : handleCheckAnswer
        }
      >
        {valid
          ? `✨ ${COMPLIMENTS[randomInRange(0, COMPLIMENTS.length - 1)]}! ✨`
          : revealAnswer
          ? "Hide Answer 🧐"
          : attempted && didReveal
          ? "Try again 🔖"
          : attempted
          ? `Wrong! Tap to reveal 🙏`
          : "Check Answer!"}
      </Button>
    </React.Fragment>
  );
};

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const QuizBox = glamorous.view({
  marginTop: 25,
  height: 125,
  width: "100%",
  alignItems: "center",
});

const TextInputStyles = {
  width: "95%",
  fontSize: 34,
  marginTop: 6,
  backgroundColor: "rgb(231,237,240)",
};

const EnglishText = ({ children }: { children: ReadonlyArray<string> }) => (
  <Text
    style={{
      fontSize: 20,
      marginTop: 15,
      marginBottom: 15,
      fontWeight: "bold",
    }}
  >
    {children}
  </Text>
);

const MandarinText = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 40,
      marginTop: 15,
      marginBottom: 15,
      fontWeight: "bold",
    }}
  >
    {children}
  </Text>
);

const PinyinText = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 22,
      marginBottom: 15,
      fontWeight: "bold",
    }}
  >
    {children}
  </Text>
);

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

export default QuizInput;
