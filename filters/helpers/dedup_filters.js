"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dedupFilters = void 0;
var lodash_1 = require("lodash");
var compare_filters_1 = require("./compare_filters");
/**
 * Combine 2 filter collections, removing duplicates
 *
 * @param {object} existingFilters - The filters to compare to
 * @param {object} filters - The filters being added
 * @param {object} comparatorOptions - Parameters to use for comparison
 *
 * @returns {object} An array of filters that were not in existing
 *
 * @internal
 */
var dedupFilters = function (existingFilters, filters, comparatorOptions) {
  if (comparatorOptions === void 0) {
    comparatorOptions = {};
  }
  if (!Array.isArray(filters)) {
    filters = [filters];
  }
  return (0, lodash_1.filter)(filters, function (f) {
    return !(0, lodash_1.find)(existingFilters, function (existingFilter) {
      return (0,
      compare_filters_1.compareFilters)(existingFilter, f, comparatorOptions);
    });
  });
};
exports.dedupFilters = dedupFilters;
