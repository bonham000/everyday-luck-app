import HSK_LISTS from "@src/lessons";

const parseForUniqueContent = () => {
  const lessons = HSK_LISTS;
  const unique = new Set();
  let duplicate: ReadonlyArray<string> = [];

  for (const lesson of lessons) {
    for (const word of lesson.content) {
      const english = word.english.toLowerCase();

      if (english !== word.english) {
        console.log(word.english);
      }

      if (unique.has(english)) {
        duplicate = duplicate.concat(english);
      } else {
        unique.add(english);
      }
    }
  }

  console.log(duplicate.length);
};

parseForUniqueContent();
