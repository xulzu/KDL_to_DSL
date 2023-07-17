/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
import { isCombinedFilter } from "../filters";
import { buildQueryFromFilters } from "./from_filters";
import { BooleanRelation } from "../filters/build_filters";
var fromAndFilter = function (filter, dataViews, options) {
  if (options === void 0) {
    options = {};
  }
  var bool = buildQueryFromFilters(filter.meta.params, dataViews, options);
  return __assign(__assign({}, filter), { query: { bool: bool } });
};
var fromOrFilter = function (filter, dataViews, options) {
  if (options === void 0) {
    options = {};
  }
  var should = filter.meta.params.map(function (subFilter) {
    return {
      bool: buildQueryFromFilters([subFilter], dataViews, options),
    };
  });
  var bool = { should: should, minimum_should_match: 1 };
  return __assign(__assign({}, filter), { query: { bool: bool } });
};
export var fromCombinedFilter = function (filter, dataViews, options) {
  if (options === void 0) {
    options = {};
  }
  if (!isCombinedFilter(filter)) {
    return filter;
  }
  if (filter.meta.relation === BooleanRelation.AND) {
    return fromAndFilter(filter, dataViews, options);
  }
  return fromOrFilter(filter, dataViews, options);
};
