import { WORDS } from "../constants/wordlist";


export const wordList = ['dance', 'rings', 'altar', 'bride', 'groom', 'unity', 'dress', 'feast']

export const isWordInWordList = (word: string) => {
  return WORDS.includes(word.toLowerCase());
};

export const isWinningWord = (word: string) => {
    return wordList[solution] === word;
};

export const getWordOfDay = () => {
    let min = Math.ceil(0);
    let max = Math.floor(7);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const solution = getWordOfDay();
