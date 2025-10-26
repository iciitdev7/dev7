export function generateAssessmentSummary(categoryScores, language = 'en') {
  const categories = Object.entries(categoryScores).map(([name, score]) => ({
    name,
    score: Math.round(score),
  }));

  const sortedCategories = [...categories].sort((a, b) => b.score - a.score);
  const highest = sortedCategories[0];
  const secondHighest = sortedCategories[1];
  const lowest = sortedCategories[sortedCategories.length - 1];
  const secondLowest = sortedCategories[sortedCategories.length - 2];

  const overallScore = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length
  );

  const highScores = sortedCategories.filter(c => c.score >= 7).length;
  const lowScores = sortedCategories.filter(c => c.score < 5).length;
  const midScores = sortedCategories.filter(c => c.score >= 5 && c.score < 7).length;

  const profileKey = `${highScores}-${midScores}-${lowScores}-${overallScore}`;

  const summaryIndex = Math.abs(
    highest.name.charCodeAt(0) +
    lowest.name.charCodeAt(0) +
    overallScore
  ) % 50;

  return {
    highest,
    secondHighest,
    lowest,
    secondLowest,
    overallScore,
    highScores,
    lowScores,
    midScores,
    summaryIndex,
    profileKey,
  };
}
