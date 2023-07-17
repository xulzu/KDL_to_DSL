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
import { get, omit, pick } from "lodash";
import { getConvertedValueForField } from "../filters";
function isDeprecatedMatchPhraseFilter(filter) {
  var _a, _b;
  // @ts-ignore
  var fieldName = Object.keys(
    (_b =
      filter.match ||
      ((_a = filter.query) === null || _a === void 0 ? void 0 : _a.match)) !==
      null && _b !== void 0
      ? _b
      : {}
  )[0];
  return Boolean(
    fieldName &&
      (get(filter, ["query", "match", fieldName, "type"]) === "phrase" ||
        get(filter, ["match", fieldName, "type"]) === "phrase")
  );
}
/** @internal */
export function migrateFilter(filter, indexPattern) {
  var _a;
  if (isDeprecatedMatchPhraseFilter(filter)) {
    // @ts-ignore
    var match = filter.match || filter.query.match;
    var fieldName_1 = Object.keys(match)[0];
    var params = get(match, [fieldName_1]);
    var query = params.query;
    if (indexPattern) {
      var field = indexPattern.fields.find(function (f) {
        return f.name === fieldName_1;
      });
      if (field) {
        query = getConvertedValueForField(field, params.query);
      }
    }
    return {
      meta: filter.meta,
      $state: filter.$state,
      query: {
        match_phrase:
          ((_a = {}),
          (_a[fieldName_1] = omit(
            __assign(__assign({}, params), { query: query }),
            "type"
          )),
          _a),
      },
    };
  }
  if (!filter.query) {
    filter = __assign(__assign({}, filter), { query: {} });
  } else {
    // handle the case where .query already exists and filter has other top level keys on there
    filter = pick(filter, ["meta", "query", "$state"]);
  }
  // @ts-ignore
  if (filter.exists) {
    // @ts-ignore
    filter.query.exists = filter.exists;
    // @ts-ignore
    delete filter.exists;
  }
  // @ts-ignore
  if (filter.range) {
    // @ts-ignore
    filter.query.range = filter.range;
    // @ts-ignore
    delete filter.range;
  }
  // @ts-ignore
  if (filter.match_all) {
    // @ts-ignore
    filter.query.match_all = filter.match_all;
    // @ts-ignore
    delete filter.match_all;
  }
  // move all other keys under query
  Object.keys(filter).forEach(function (key) {
    if (key === "meta" || key === "query" || key === "$state") {
      return;
    }
    // @ts-ignore
    filter.query[key] = filter[key];
    // @ts-ignore
    delete filter[key];
  });
  return filter;
}
