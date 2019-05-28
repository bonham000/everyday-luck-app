import glamorous from "glamorous-native";
import React from "react";
import { Button, TextInput } from "react-native-paper";

import Shaker from "@src/components/ShakerComponent";
import { COMPLIMENTS } from "@src/constants/Compliments";
import { COLORS } from "@src/constants/Theme";
import { QuizScreenComponentProps } from "@src/tools/types";
import { formatUserLanguageSetting, randomInRange } from "@src/tools/utils";

/** ========================================================================
 * React Class
 * =========================================================================
 */

const QuizInput = ({
  valid,
  value,
  revealAnswer,
  currentWord,
  shouldShake,
  attempted,
  setInputRef,
  handleChange,
  handleCheck,
  handleProceed,
  handleToggleRevealAnswer,
  didReveal,
  languageSetting,
}: QuizScreenComponentProps) => {
  /**
   * TODO: Account for overlapping English word definitions when defining the
   * correct answer...
   */
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
      <Button
        dark
        mode="contained"
        style={{
          marginTop: 25,
          minWidth: 225,
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
  height: 150,
  marginTop: 25,
  width: "100%",
  alignItems: "center",
});

const TextInputStyles = {
  width: "95%",
  fontSize: 34,
  marginTop: 12,
  backgroundColor: "rgb(231,237,240)",
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
