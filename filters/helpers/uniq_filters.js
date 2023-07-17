"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqFilters = void 0;
var lodash_1 = require("lodash");
var dedup_filters_1 = require("./dedup_filters");
/**
 * Remove duplicate filters from an array of filters
 *
 * @param {array} filters The filters to remove duplicates from
 * @param {object} comparatorOptions - Parameters to use for comparison
 * @returns {object} The original filters array with duplicates removed
 * @public
 */
var uniqFilters = function (filters, comparatorOptions) {
  if (comparatorOptions === void 0) {
    comparatorOptions = {};
  }
  var results = [];
  (0, lodash_1.each)(filters, function (filter) {
    results = (0, lodash_1.union)(
      results,
      (0, dedup_filters_1.dedupFilters)(results, [filter], comparatorOptions)
    );
  });
  return results;
};
exports.uniqFilters = uniqFilters;
