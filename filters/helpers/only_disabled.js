"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyDisabledFiltersChanged = void 0;
var lodash_1 = require("lodash");
var compare_filters_1 = require("./compare_filters");
var isEnabled = function (f) {
  return f && f.meta && !f.meta.disabled;
};
/**
 * Checks to see if only disabled filters have been changed
 * @returns {bool} Only disabled filters
 *
 * @public
 */
var onlyDisabledFiltersChanged = function (
  newFilters,
  oldFilters,
  comparatorOptions
) {
  // If it's the same - compare only enabled filters
  var newEnabledFilters = (0, lodash_1.filter)(newFilters || [], isEnabled);
  var oldEnabledFilters = (0, lodash_1.filter)(oldFilters || [], isEnabled);
  var options =
    comparatorOptions !== null && comparatorOptions !== void 0
      ? comparatorOptions
      : compare_filters_1.COMPARE_ALL_OPTIONS;
  return (0, compare_filters_1.compareFilters)(
    oldEnabledFilters,
    newEnabledFilters,
    options
  );
};
exports.onlyDisabledFiltersChanged = onlyDisabledFiltersChanged;
