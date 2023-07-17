"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareFilters = exports.COMPARE_ALL_OPTIONS = void 0;
var lodash_1 = require("lodash");
var build_filters_1 = require("../build_filters");
/**
 * Include disabled, negate and store when comparing filters
 * @public
 */
exports.COMPARE_ALL_OPTIONS = {
  index: true,
  disabled: true,
  negate: true,
  state: true,
  alias: true,
};
// Combined filters include sub-filters in the `meta` property and the relation type in the `relation` property, so
// they should never be excluded in the comparison
var removeRequiredAttributes = function (excludedAttributes) {
  return excludedAttributes.filter(function (attribute) {
    return !["meta", "relation"].includes(attribute);
  });
};
var mapFilter = function (filter, comparators, excludedAttributes) {
  var _a, _b;
  var attrsToExclude = (0, build_filters_1.isCombinedFilter)(filter)
    ? removeRequiredAttributes(excludedAttributes)
    : excludedAttributes;
  var cleaned = (0, lodash_1.omit)(filter, attrsToExclude);
  if (comparators.index)
    cleaned.index =
      (_a = filter.meta) === null || _a === void 0 ? void 0 : _a.index;
  if (comparators.negate)
    cleaned.negate = filter.meta && Boolean(filter.meta.negate);
  if (comparators.disabled)
    cleaned.disabled = filter.meta && Boolean(filter.meta.disabled);
  if (comparators.alias)
    cleaned.alias =
      (_b = filter.meta) === null || _b === void 0 ? void 0 : _b.alias;
  return cleaned;
};
var mapFilterArray = function (filters, comparators, excludedAttributes) {
  return (0, lodash_1.map)(filters, function (filter) {
    return mapFilter(filter, comparators, excludedAttributes);
  });
};
/**
 * Compare two filters or filter arrays to see if they match.
 * For filter arrays, the assumption is they are sorted.
 *
 * @param {Filter | Filter[]} first The first filter or filter array to compare
 * @param {Filter | Filter[]} second The second filter or filter array to compare
 * @param {FilterCompareOptions} comparatorOptions Parameters to use for comparison
 *
 * @returns {bool} Filters are the same
 *
 * @public
 */
var compareFilters = function (first, second, comparatorOptions) {
  if (comparatorOptions === void 0) {
    comparatorOptions = {};
  }
  if (!first || !second) return false;
  var comparators = {};
  var excludedAttributes = ["$$hashKey", "meta"];
  comparators = (0, lodash_1.defaults)(comparatorOptions || {}, {
    index: false,
    state: false,
    negate: false,
    disabled: false,
    alias: false,
  });
  if (!comparators.state) excludedAttributes.push("$state");
  if (Array.isArray(first) && Array.isArray(second)) {
    return (0, lodash_1.isEqual)(
      mapFilterArray(first, comparators, excludedAttributes),
      mapFilterArray(second, comparators, excludedAttributes)
    );
  } else if (!Array.isArray(first) && !Array.isArray(second)) {
    return (0, lodash_1.isEqual)(
      mapFilter(first, comparators, excludedAttributes),
      mapFilter(second, comparators, excludedAttributes)
    );
  } else {
    return false;
  }
};
exports.compareFilters = compareFilters;
