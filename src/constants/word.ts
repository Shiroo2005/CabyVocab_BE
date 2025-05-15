export enum WordPosition {
  NOUN = 'Noun',
  VERB = 'Verb',
  ADJECTIVE = 'Adjective',
  ADVERB = 'Adverb',
  OTHERS = 'Others'
}

export function getWordPosition() {
  return Object.values(WordPosition)
}
