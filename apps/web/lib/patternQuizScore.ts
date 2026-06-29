/** PatternQuiz skor mantığı — son soruda çift sayım olmaması için tek kaynak */
export function advancePatternQuizScore(correctSoFar: number, answeredCorrectly: boolean): number {
  return correctSoFar + (answeredCorrectly ? 1 : 0);
}
