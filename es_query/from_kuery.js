/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import { fromKueryExpression, toElasticsearchQuery, nodeTypes } from "../kuery";
/** @internal */
export function buildQueryFromKuery(indexPattern, queries, _a, _b) {
  if (queries === void 0) {
    queries = [];
  }
  var _c =
      _a === void 0
        ? {
            allowLeadingWildcards: false,
          }
        : _a,
    _d = _c.allowLeadingWildcards,
    allowLeadingWildcards = _d === void 0 ? false : _d;
  var _e =
      _b === void 0
        ? {
            filtersInMustClause: false,
          }
        : _b,
    _f = _e.filtersInMustClause,
    filtersInMustClause = _f === void 0 ? false : _f,
    dateFormatTZ = _e.dateFormatTZ,
    nestedIgnoreUnmapped = _e.nestedIgnoreUnmapped,
    caseInsensitive = _e.caseInsensitive;
  var queryASTs = queries.map(function (query) {
    return fromKueryExpression(query.query, {
      allowLeadingWildcards: allowLeadingWildcards,
    });
  });
  return buildQuery(indexPattern, queryASTs, {
    filtersInMustClause: filtersInMustClause,
    dateFormatTZ: dateFormatTZ,
    nestedIgnoreUnmapped: nestedIgnoreUnmapped,
    caseInsensitive: caseInsensitive,
  });
}
function buildQuery(indexPattern, queryASTs, config) {
  if (config === void 0) {
    config = {};
  }
  var compoundQueryAST = nodeTypes.function.buildNode("and", queryASTs);
  var kueryQuery = toElasticsearchQuery(compoundQueryAST, indexPattern, config);
  return Object.assign(
    {
      must: [],
      filter: [],
      should: [],
      must_not: [],
    },
    kueryQuery.bool
  );
}
