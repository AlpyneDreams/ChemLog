// Special search ranks that override the order of search results
// and affect how they are displayed (e.g. like SubstanceListItem)
export default {
  EXACT_MATCH: -200,
  ALIAS_MATCH: -100,
  START_MATCH: -50,

  SCORE_BONUS_NAME: -50,
  SCORE_BONUS_ALIAS: -25,
}