import glamorous from "glamorous-native";
import React from "react";
import { GestureResponderEvent } from "react-native";
import { Button, Text } from "react-native-paper";

import { LanguageSelection } from "@src/AppContext";
import { getLanguageContent } from "@src/content";
import { Word } from "@src/content/types";
import { COLORS } from "@src/styles/Colors";
import { getAlternateChoices } from "@src/utils";

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
  selectedLanguage: LanguageSelection;
  setInputRef: () => void;
  handleChange: () => void;
  handleCheck: (event: GestureResponderEvent) => void;
  handleProceed: () => (event: GestureResponderEvent) => void;
  handleToggleRevealAnswer: (event: GestureResponderEvent) => void;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

const MultipleChoiceInput = ({
  valid,
  revealAnswer,
  selectedLanguage,
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
}: IProps) => {
  const ALTERNATE_CHOICES = getAlternateChoices(
    currentWord.characters,
    getLanguageContent(selectedLanguage),
  );
  return (
    <React.Fragment>
      <TitleContainer>
        <PinyinText>{currentWord.english}</PinyinText>
      </TitleContainer>
      {ALTERNATE_CHOICES.map(choice => (
        <Choice>
          <MandarinText>{choice}</MandarinText>
        </Choice>
      ))}
    </React.Fragment>
  );
};

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

const TitleContainer = glamorous.view({
  marginTop: 35,
  padding: 15,
  width: "100%",
  alignItems: "center",
});

const MandarinText = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 45,
      marginTop: 15,
      marginBottom: 15,
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

const Choice = ({ children }: { children: JSX.Element }) => (
  <Button
    dark
    mode="contained"
    style={{
      marginTop: 12,
      width: "90%",
      backgroundColor: COLORS.actionButtonMint,
    }}
    onPress={() => null}
  >
    {children}
  </Button>
);

/** ========================================================================
 * Helpers & Styles
 * =========================================================================
 */

export default MultipleChoiceInput;
