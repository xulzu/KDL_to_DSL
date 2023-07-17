// Checks if the query is of type Query
export function isOfQueryType(arg) {
  return Boolean(arg && "query" in arg);
}
// Checks if the query is of type AggregateQuery
// currently only supports the sql query type
// should be enhanced to support other query types
export function isOfAggregateQueryType(query) {
  return Boolean(query && ("sql" in query || "esql" in query));
}
// returns the language of the aggregate Query, sql, esql etc
export function getAggregateQueryMode(query) {
  return Object.keys(query)[0];
}
// retrieves the index pattern from the aggregate query
export function getIndexPatternFromSQLQuery(sqlQuery) {
  var _a;
  var sql =
    sqlQuery === null || sqlQuery === void 0
      ? void 0
      : sqlQuery.replaceAll('"', "").replaceAll("'", "");
  var splitFroms =
    sql === null || sql === void 0
      ? void 0
      : sql.split(new RegExp(/FROM\s/, "ig"));
  var fromsLength =
    (_a =
      splitFroms === null || splitFroms === void 0
        ? void 0
        : splitFroms.length) !== null && _a !== void 0
      ? _a
      : 0;
  if (
    splitFroms &&
    (splitFroms === null || splitFroms === void 0
      ? void 0
      : splitFroms.length) > 2
  ) {
    sql = ""
      .concat(splitFroms[fromsLength - 2], " FROM ")
      .concat(splitFroms[fromsLength - 1]);
  }
  // case insensitive match for the index pattern
  var regex = new RegExp(/FROM\s+([\w*-.!@$^()~;]+)/, "i");
  var matches = sql === null || sql === void 0 ? void 0 : sql.match(regex);
  if (matches) {
    return matches[1];
  }
  return "";
}
