export enum WORD_MASTERY_LEVEL {
  NEW = 0, // easeFactor  = 0
  LEARNING = 1, // 1 <= easeFactor <= 5
  REVIEWING = 2, // 6 < easeFactor <= 7
  MASTERED = 3 //  8 <= easeFactor
}

export const MAX_EASE_FACTOR = 20

export const LEVEL_UP_FOR_EACH_LEVEL = {
  NEW: {
    maxWrong: 20,
    easeFactorForLevelUp: 0
  },
  LEARNING: {
    maxWrong: 10,
    easeFactorForLevelUp: 1
  },
  REVIEWING: {
    maxWrong: 2,
    easeFactorForLevelUp: 2
  },
  MASTERED: {
    maxWrong: 1,
    easeFactorForLevelUp: 3
  }
}

export const DEFAULT_MASTERY_LEVEL = WORD_MASTERY_LEVEL.NEW
export const INTERVAL_BASE = 1 // space repetition
export const MULTI_BASE = 2
export const DEFAULT_EASE_FACTOR = 0
export const DEFAULT_REVIEW_COUNT = 0
