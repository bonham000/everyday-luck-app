import glamorous from "glamorous-native";
import React from "react";
import { TextInput } from "react-native-paper";

import Shaker from "@src/components/ShakerComponent";
import { Button } from "@src/components/SharedComponents";
import { COMPLIMENTS } from "@src/constants/Compliments";
import { COLORS } from "@src/constants/Theme";
import { QuizScreenComponentProps } from "@src/tools/types";
import {
  determineAnyPossibleCorrectAnswerForFreeInput,
  formatUserLanguageSetting,
  randomInRange,
} from "@src/tools/utils";

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
    ? handleProceed()
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
            <TextInput
              mode="outlined"
              value={value}
              error={attempted}
              ref={setInputRef}
              style={TextInputStyles}
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

const QuizBox = glamorous.touchableOpacity({
  height: 150,
  marginTop: 25,
  width: "100%",
  alignItems: "center",
});

const TextInputStyles = {
  width: "95%",
  fontSize: 34,
  marginTop: 12,
  backgroundColor: COLORS.background,
};

const EnglishText = glamorous.text({
  fontSize: 24,
  marginTop: 15,
  marginBottom: 15,
  fontWeight: "bold",
});

const MandarinText = glamorous.text({
  fontSize: 40,
  marginTop: 15,
  marginBottom: 15,
  fontWeight: "bold",
});

const PinyinText = glamorous.text({
  fontSize: 22,
  marginBottom: 15,
  fontWeight: "bold",
});

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

export default QuizInput;
