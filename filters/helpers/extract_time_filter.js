"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTimeRange = exports.extractTimeFilter = void 0;
var lodash_1 = require("lodash");
var build_filters_1 = require("../build_filters");
var convert_range_filter_1 = require("./convert_range_filter");
function extractTimeFilter(timeFieldName, filters) {
  var _a = (0, lodash_1.partition)(filters, function (obj) {
      var key;
      if ((0, build_filters_1.isRangeFilter)(obj)) {
        key = (0, lodash_1.keys)(obj.query.range)[0];
      }
      return Boolean(key && key === timeFieldName);
    }),
    timeRangeFilter = _a[0],
    restOfFilters = _a[1];
  return {
    restOfFilters: restOfFilters,
    timeRangeFilter: timeRangeFilter[0],
  };
}
exports.extractTimeFilter = extractTimeFilter;
function extractTimeRange(filters, timeFieldName) {
  if (!timeFieldName) return { restOfFilters: filters, timeRange: undefined };
  var _a = extractTimeFilter(timeFieldName, filters),
    timeRangeFilter = _a.timeRangeFilter,
    restOfFilters = _a.restOfFilters;
  return {
    restOfFilters: restOfFilters,
    timeRange: timeRangeFilter
      ? (0, convert_range_filter_1.convertRangeFilterToTimeRangeString)(
          timeRangeFilter
        )
      : undefined,
  };
}
exports.extractTimeRange = extractTimeRange;
