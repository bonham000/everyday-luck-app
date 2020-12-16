import styled from "@emotion/native";
import React from "react";
import { TextInput } from "react-native-paper";

import Shaker from "@src/components/ShakerComponent";
import { Button, StyledText } from "@src/components/SharedComponents";
import { COMPLIMENTS } from "@src/constants/Compliments";
import { COLORS } from "@src/constants/Theme";
import { QuizScreenComponentProps } from "@src/tools/types";
import {
  determineAnyPossibleCorrectAnswerForFreeInput,
  formatUserLanguageSetting,
  randomInRange,
} from "@src/tools/utils";
import { NativeStyleThemeProps } from "@src/AppContainer";

/** ========================================================================
 * React Class
 * =========================================================================
 */

const QuizInput = ({
  valid,
  value,
  didReveal,
  attempted,
  currentWord,
  shouldShake,
  setInputRef,
  handleCheck,
  handleChange,
  revealAnswer,
  handleProceed,
  wordDictionary,
  languageSetting,
  autoProceedQuestion,
  handleCopyToClipboard,
  handleToggleRevealAnswer,
}: QuizScreenComponentProps) => {
  /**
   * Determine if the user's input is correct.
   *
   * NOTE: It's possible they entered Chinese characters which do not match
   * the provided word but still translate to the provided English phrase.
   */
  const {
    correct,
    correctWord,
  } = determineAnyPossibleCorrectAnswerForFreeInput(
    value,
    currentWord,
    languageSetting,
    wordDictionary,
  );

  /**
   * Function to check answer on submit.
   */
  const handleCheckAnswer = () => handleCheck(correct);

  /**
   * Get the correct text.
   */
  const correctText = correctWord[languageSetting];

  const buttonText = valid
    ? `✨ ${COMPLIMENTS[randomInRange(0, COMPLIMENTS.length - 1)]}! ✨`
    : revealAnswer
    ? "Hide Answer 🧐"
    : attempted && didReveal
    ? "Try again 🔖"
    : attempted
    ? `Wrong! Tap to reveal 🙏`
    : "Check Answer!";

  const buttonStyles = {
    marginTop: 25,
    minWidth: 225,
    backgroundColor: revealAnswer
      ? COLORS.actionButtonMint
      : !valid && attempted
      ? COLORS.primaryRed
      : COLORS.primaryBlue,
  };

  const onPressHandler = valid
    ? handleProceed
    : revealAnswer
    ? handleToggleRevealAnswer
    : handleCheckAnswer;

  return (
    <React.Fragment>
      {valid || revealAnswer ? (
        <QuizBox onPress={() => handleCopyToClipboard(correctText)}>
          <MandarinText>{correctText}</MandarinText>
          <PinyinText>{correctWord.pinyin}</PinyinText>
        </QuizBox>
      ) : (
        <Shaker style={{ width: "100%" }} shouldShake={shouldShake}>
          <QuizBox>
            <EnglishText>"{currentWord.english}"</EnglishText>
            <StyledTextInput
              mode="outlined"
              value={value}
              error={attempted}
              ref={setInputRef}
              onChangeText={handleChange}
              onSubmitEditing={handleCheckAnswer}
              label={`Enter ${formatUserLanguageSetting(languageSetting)}`}
            />
          </QuizBox>
        </Shaker>
      )}
      {(!autoProceedQuestion || !valid) && (
        <Button style={buttonStyles} onPress={onPressHandler}>
          {buttonText}
        </Button>
      )}
    </React.Fragment>
  );
};

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const QuizBox = styled.TouchableOpacity({
  height: 150,
  marginTop: 25,
  width: "100%",
  alignItems: "center",
});

const StyledTextInput = styled(TextInput)<any>`
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

const EnglishText = styled(StyledText)({
  fontSize: 24,
  marginTop: 15,
  marginBottom: 15,
  fontWeight: "bold",
});

const MandarinText = styled(StyledText)({
  fontSize: 40,
  marginTop: 15,
  marginBottom: 15,
  fontWeight: "bold",
});

const PinyinText = styled(StyledText)({
  fontSize: 22,
  marginBottom: 15,
  fontWeight: "bold",
});

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

export default QuizInput;
