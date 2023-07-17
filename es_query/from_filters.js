/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import { migrateFilter } from "./migrate_filter";
import { filterMatchesIndex } from "./filter_matches_index";
import { cleanFilter, isFilterDisabled } from "../filters";
import { fromNestedFilter } from "./from_nested_filter";
import { fromCombinedFilter } from "./from_combined_filter";
function isUndefined(obj) {
  return obj === undefined;
}
/**
 * Create a filter that can be reversed for filters with negate set
 * @param {boolean} reverse This will reverse the filter. If true then
 *                          anything where negate is set will come
 *                          through otherwise it will filter out
 * @returns {function}
 */
var filterNegate = function (reverse) {
  return function (filter) {
    if (isUndefined(filter.meta) || isUndefined(filter.meta.negate)) {
      return !reverse;
    }
    return filter.meta && filter.meta.negate === reverse;
  };
};
/**
 * Translate a filter into a query to support es 5+
 * @param  {Object} filter - The filter to translate
 * @return {Object} the query version of that filter
 */
var translateToQuery = function (filter) {
  return filter.query || filter;
};
/**
 * @param filters
 * @param indexPattern
 * @param ignoreFilterIfFieldNotInIndex by default filters that use fields that can't be found in the specified index pattern are not applied. Set this to true if you want to apply them anyway.
 * @returns An EQL query
 *
 * @public
 */
export var buildQueryFromFilters = function (
  inputFilters,
  inputDataViews,
  options
) {
  if (inputFilters === void 0) {
    inputFilters = [];
  }
  if (options === void 0) {
    options = {
      ignoreFilterIfFieldNotInIndex: false,
    };
  }
  var _a = options.ignoreFilterIfFieldNotInIndex,
    ignoreFilterIfFieldNotInIndex = _a === void 0 ? false : _a;
  var filters = inputFilters.filter(function (filter) {
    return filter && !isFilterDisabled(filter);
  });
  var filtersToESQueries = function (negate) {
    return filters
      .filter(function (f) {
        return !!f;
      })
      .filter(filterNegate(negate))
      .filter(function (filter) {
        var _a;
        var indexPattern = findIndexPattern(
          inputDataViews,
          (_a = filter.meta) === null || _a === void 0 ? void 0 : _a.index
        );
        return (
          !ignoreFilterIfFieldNotInIndex ||
          filterMatchesIndex(filter, indexPattern)
        );
      })
      .map(function (filter) {
        return filterToQueryDsl(filter, inputDataViews, options);
      });
  };
  return {
    must: [],
    filter: filtersToESQueries(false),
    should: [],
    must_not: filtersToESQueries(true),
  };
};
function findIndexPattern(inputDataViews, id) {
  var _a;
  var dataViews = Array.isArray(inputDataViews)
    ? inputDataViews
    : [inputDataViews];
  return (_a = dataViews.find(function (index) {
    return (index === null || index === void 0 ? void 0 : index.id) === id;
  })) !== null && _a !== void 0
    ? _a
    : dataViews[0];
}
export function filterToQueryDsl(filter, inputDataViews, options) {
  var _a;
  if (options === void 0) {
    options = {};
  }
  var indexPattern = findIndexPattern(
    inputDataViews,
    (_a = filter.meta) === null || _a === void 0 ? void 0 : _a.index
  );
  var migratedFilter = migrateFilter(filter, indexPattern);
  var nestedFilter = fromNestedFilter(migratedFilter, indexPattern, options);
  var combinedFilter = fromCombinedFilter(
    nestedFilter,
    inputDataViews,
    options
  );
  var cleanedFilter = cleanFilter(combinedFilter);
  return translateToQuery(cleanedFilter);
}
