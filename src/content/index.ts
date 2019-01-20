import Korean from "@src/content/korean/index.ts";
import Mandarin from "@src/content/mandarin/index.ts";
import { Word } from "@src/content/mandarin/types";

/**
 * Gets the language lesson content for the user selected language.
 */
export const getLanguageContent = (
  language: "Mandarin" | "Korean",
): ReadonlyArray<Word> => {
  switch (language) {
    case "Mandarin":
      return Mandarin;
    case "Korean":
      return Korean;
    default:
      return [];
  }
};
