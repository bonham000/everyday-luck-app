import { LanguageSelection } from "@src/AppContext";
import KOREAN, {
  LESSONS as KOREAN_LESSONS,
} from "@src/content/korean/index.ts";
import MANDARIN, {
  LESSONS as MANDARIN_LESSONS,
} from "@src/content/mandarin/index.ts";
import { LessonSet, Word } from "@src/content/types";

/**
 * Gets the lesson set for the user selected language.
 */
export const getLessonSet = (language: LanguageSelection): LessonSet => {
  switch (language) {
    case "Mandarin":
      return MANDARIN_LESSONS;
    case "Korean":
      return KOREAN_LESSONS;
    default:
      return [];
  }
};

/**
 * Gets the language lesson content for the user selected language.
 */
export const getLanguageContent = (
  language: LanguageSelection,
): ReadonlyArray<Word> => {
  switch (language) {
    case "Mandarin":
      return MANDARIN;
    case "Korean":
      return KOREAN;
    default:
      return [];
  }
};
