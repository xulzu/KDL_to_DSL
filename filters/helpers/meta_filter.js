"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanFilter =
  exports.isFilters =
  exports.isFilter =
  exports.unpinFilter =
  exports.pinFilter =
  exports.disableFilter =
  exports.enableFilter =
  exports.toggleFilterPinned =
  exports.toggleFilterNegated =
  exports.toggleFilterDisabled =
  exports.isFilterDisabled =
  exports.isFilterPinned =
    void 0;
var lodash_1 = require("lodash");
var build_filters_1 = require("../build_filters");
/**
 *
 * @param filter
 * @returns `true` if the filter should be applied to global scope
 *
 * @public
 */
var isFilterPinned = function (filter) {
  return (
    filter.$state &&
    filter.$state.store === build_filters_1.FilterStateStore.GLOBAL_STATE
  );
};
exports.isFilterPinned = isFilterPinned;
/**
 * @param filter
 * @returns `true` if the filter is disabled
 *
 * @public
 */
var isFilterDisabled = function (filter) {
  return (0, lodash_1.get)(filter, "meta.disabled", false);
};
exports.isFilterDisabled = isFilterDisabled;
/**
 *
 * @param filter
 * @returns A copy of the filter with a toggled disabled state
 *
 * @public
 */
var toggleFilterDisabled = function (filter) {
  var disabled = !filter.meta.disabled;
  var meta = __assign(__assign({}, filter.meta), { disabled: disabled });
  return __assign(__assign({}, filter), { meta: meta });
};
exports.toggleFilterDisabled = toggleFilterDisabled;
/**
 *
 * @param filter
 * @returns A copy of the filter with a toggled negated state
 *
 * @public
 */
var toggleFilterNegated = function (filter) {
  var negate = !filter.meta.negate;
  var meta = __assign(__assign({}, filter.meta), { negate: negate });
  return __assign(__assign({}, filter), { meta: meta });
};
exports.toggleFilterNegated = toggleFilterNegated;
/**
 *
 * @param filter
 * @returns A copy of the filter with a toggled pinned state (toggles store from app to global and vice versa)
 *
 * @public
 */
var toggleFilterPinned = function (filter) {
  var store = (0, exports.isFilterPinned)(filter)
    ? build_filters_1.FilterStateStore.APP_STATE
    : build_filters_1.FilterStateStore.GLOBAL_STATE;
  var $state = __assign(__assign({}, filter.$state), { store: store });
  return __assign(__assign({}, filter), { $state: $state });
};
exports.toggleFilterPinned = toggleFilterPinned;
/**
 * @param filter
 * @returns An enabled copy of the filter
 *
 * @public
 */
var enableFilter = function (filter) {
  return !filter.meta.disabled
    ? filter
    : (0, exports.toggleFilterDisabled)(filter);
};
exports.enableFilter = enableFilter;
/**
 * @param filter
 * @returns A disabled copy of the filter
 *
 * @public
 */
var disableFilter = function (filter) {
  return filter.meta.disabled
    ? filter
    : (0, exports.toggleFilterDisabled)(filter);
};
exports.disableFilter = disableFilter;
/**
 * @param filter
 * @returns A pinned (global) copy of the filter
 *
 * @public
 */
var pinFilter = function (filter) {
  return (0, exports.isFilterPinned)(filter)
    ? filter
    : (0, exports.toggleFilterPinned)(filter);
};
exports.pinFilter = pinFilter;
/**
 * @param filter
 * @returns An unpinned (app scoped) copy of the filter
 *
 * @public
 */
var unpinFilter = function (filter) {
  return !(0, exports.isFilterPinned)(filter)
    ? filter
    : (0, exports.toggleFilterPinned)(filter);
};
exports.unpinFilter = unpinFilter;
/**
 * @param {unknown} filter
 * @returns `true` if the given object is a filter
 *
 * @public
 */
var isFilter = function (x) {
  return !!x && typeof x === "object" && !!x.meta && typeof x.meta === "object";
};
exports.isFilter = isFilter;
/**
 * @param {unknown} filters
 * @returns `true` if the given object is an array of filters
 *
 * @public
 */
var isFilters = function (x) {
  return (
    Array.isArray(x) &&
    !x.find(function (y) {
      return !(0, exports.isFilter)(y);
    })
  );
};
exports.isFilters = isFilters;
/**
 * Clean out decorators from the filters
 * @param {object} filter The filter to clean
 * @returns {object}
 *
 * @public
 */
var cleanFilter = function (filter) {
  return (0, lodash_1.omit)(filter, ["meta", "$state"]);
};
exports.cleanFilter = cleanFilter;
