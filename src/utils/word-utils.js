import WordBank from '../utils/word-bank.json'

export default function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * WordBank.length);
    return WordBank[randomIndex];
}