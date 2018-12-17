/** ========================================================================
 * KOREAN content for app
 * =========================================================================
 */

const Content = [
  {
    characters: "안녕하세요",
    phonetic: "annyeonghaseyo",
    english: "Hello",
  },
  {
    characters: "안녕",
    phonetic: "annyeong",
    english: "Goodbye",
  },
];

export default (process.env.NODE_ENV === "development"
  ? Content.slice(0, 5)
  : Content);
