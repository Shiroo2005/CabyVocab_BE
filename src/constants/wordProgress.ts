export enum MasteryLevel {
    Level1 = '1',
    Level2 = '2',
    Level3 = '3',
    Level4 = '4',
    MASTERED = 'mastered'
}

export enum IntervalLevel {
    Level1 = 1,
    Level2 = 2,
    Level3 = 4,
    Level4 = 7,
    MASTERED = 14
}

export const MasteryToIntervalMap: Record<MasteryLevel, number> = {
    [MasteryLevel.Level1]: IntervalLevel.Level1,
    [MasteryLevel.Level2]: IntervalLevel.Level2,
    [MasteryLevel.Level3]: IntervalLevel.Level3,
    [MasteryLevel.Level4]: IntervalLevel.Level4,
    [MasteryLevel.MASTERED]: IntervalLevel.MASTERED,
}