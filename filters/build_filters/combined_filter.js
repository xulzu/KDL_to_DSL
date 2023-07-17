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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCombinedFilter =
  exports.isCombinedFilter =
  exports.BooleanRelation =
    void 0;
var types_1 = require("./types");
/**
 * @public
 */
var BooleanRelation;
(function (BooleanRelation) {
  BooleanRelation["AND"] = "AND";
  BooleanRelation["OR"] = "OR";
})(BooleanRelation || (exports.BooleanRelation = BooleanRelation = {}));
/**
 * @public
 */
function isCombinedFilter(filter) {
  var _a;
  return (
    ((_a = filter === null || filter === void 0 ? void 0 : filter.meta) ===
      null || _a === void 0
      ? void 0
      : _a.type) === types_1.FILTERS.COMBINED
  );
}
exports.isCombinedFilter = isCombinedFilter;
var cleanUpFilter = function (filter) {
  var $state = filter.$state,
    meta = filter.meta,
    cleanedUpFilter = __rest(filter, ["$state", "meta"]);
  var alias = meta.alias,
    disabled = meta.disabled,
    cleanedUpMeta = __rest(meta, ["alias", "disabled"]);
  return __assign(__assign({}, cleanedUpFilter), { meta: cleanedUpMeta });
};
/**
 * Builds an COMBINED filter. An COMBINED filter is a filter with multiple sub-filters. Each sub-filter (FilterItem)
 * represents a condition.
 * @param relation The type of relation with which to combine the filters (AND/OR)
 * @param filters An array of sub-filters
 * @public
 */
function buildCombinedFilter(
  relation,
  filters,
  indexPattern,
  disabled,
  negate,
  alias,
  store
) {
  if (disabled === void 0) {
    disabled = false;
  }
  if (negate === void 0) {
    negate = false;
  }
  if (store === void 0) {
    store = types_1.FilterStateStore.APP_STATE;
  }
  return {
    $state: { store: store },
    meta: {
      type: types_1.FILTERS.COMBINED,
      relation: relation,
      params: filters.map(cleanUpFilter),
      index: indexPattern.id,
      disabled: disabled,
      negate: negate,
      alias: alias,
    },
  };
}
exports.buildCombinedFilter = buildCombinedFilter;
