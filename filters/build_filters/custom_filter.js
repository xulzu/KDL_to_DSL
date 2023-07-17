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
exports.buildCustomFilter = void 0;
var types_1 = require("./types");
/**
 *
 * @param indexPatternString
 * @param queryDsl
 * @param disabled
 * @param negate
 * @param alias
 * @param store
 * @returns
 *
 * @public
 */
function buildCustomFilter(
  indexPatternString,
  queryDsl,
  disabled,
  negate,
  alias,
  store
) {
  var meta = {
    index: indexPatternString,
    type: types_1.FILTERS.CUSTOM,
    disabled: disabled,
    negate: negate,
    alias: alias,
  };
  var filter = __assign(__assign({}, queryDsl), { meta: meta });
  filter.$state = { store: store };
  return filter;
}
exports.buildCustomFilter = buildCustomFilter;
