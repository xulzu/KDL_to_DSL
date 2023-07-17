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
import { getFilterField, cleanFilter } from "../filters";
import { getDataViewFieldSubtypeNested } from "../utils";
/** @internal */
export var fromNestedFilter = function (filter, indexPattern, config) {
  if (config === void 0) {
    config = {};
  }
  if (!indexPattern) return filter;
  var fieldName = getFilterField(filter);
  if (!fieldName) {
    return filter;
  }
  var field = indexPattern.fields.find(function (indexPatternField) {
    return indexPatternField.name === fieldName;
  });
  var subTypeNested = field && getDataViewFieldSubtypeNested(field);
  if (!subTypeNested) {
    return filter;
  }
  var query = cleanFilter(filter);
  return {
    meta: filter.meta,
    query: {
      nested: __assign(
        { path: subTypeNested.nested.path, query: query.query || query },
        typeof config.nestedIgnoreUnmapped === "boolean" && {
          ignore_unmapped: config.nestedIgnoreUnmapped,
        }
      ),
    },
  };
};
