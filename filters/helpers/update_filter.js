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
exports.updateFilter = void 0;
var lodash_1 = require("lodash");
var range_filter_1 = require("../build_filters/range_filter");
var updateFilter = function (filter, field, operator, params, fieldType) {
  if (!field || !operator) {
    return updateField(filter, field);
  }
  if (operator.type === "exists") {
    return updateWithExistsOperator(filter, operator);
  }
  if (operator.type === "range") {
    return updateWithRangeOperator(filter, operator, params, field);
  }
  if (Array.isArray(params)) {
    return updateWithIsOneOfOperator(filter, operator, params);
  }
  return updateWithIsOperator(filter, operator, params, fieldType);
};
exports.updateFilter = updateFilter;
function updateField(filter, field) {
  return __assign(__assign({}, filter), {
    meta: __assign(__assign({}, filter.meta), {
      key: field,
      // @todo: check why we need to pass "key" and "field" with the same data
      field: field,
      params: { query: undefined },
      value: undefined,
      type: undefined,
    }),
    query: undefined,
  });
}
function updateWithExistsOperator(filter, operator) {
  return __assign(__assign({}, filter), {
    meta: __assign(__assign({}, filter.meta), {
      negate:
        operator === null || operator === void 0 ? void 0 : operator.negate,
      type: operator === null || operator === void 0 ? void 0 : operator.type,
      params: undefined,
      value: "exists",
    }),
    query: { exists: { field: filter.meta.key } },
  });
}
function updateWithIsOperator(filter, operator, params, fieldType) {
  var _a, _b;
  var safeParams = fieldType === "number" && !params ? 0 : params;
  if (typeof filter.meta.params === "object") {
    return __assign(__assign({}, filter), {
      meta: __assign(__assign({}, filter.meta), {
        negate:
          operator === null || operator === void 0 ? void 0 : operator.negate,
        type: operator === null || operator === void 0 ? void 0 : operator.type,
        params: __assign(__assign({}, filter.meta.params), { query: params }),
        value: undefined,
      }),
      query: {
        match_phrase:
          ((_a = {}),
          (_a[filter.meta.key] =
            safeParams !== null && safeParams !== void 0 ? safeParams : ""),
          _a),
      },
    });
  } else {
    return __assign(__assign({}, filter), {
      meta: __assign(__assign({}, filter.meta), {
        negate:
          operator === null || operator === void 0 ? void 0 : operator.negate,
        type: operator === null || operator === void 0 ? void 0 : operator.type,
        params: { query: params },
        value: undefined,
      }),
      query: {
        match_phrase:
          ((_b = {}),
          (_b[filter.meta.key] =
            safeParams !== null && safeParams !== void 0 ? safeParams : ""),
          _b),
      },
    });
  }
}
function updateWithRangeOperator(filter, operator, rawParams, field) {
  var _a, _b;
  if ((0, range_filter_1.isRangeFilterParams)(rawParams)) {
    var from = rawParams.from,
      to = rawParams.to;
    var params = {
      gte: from,
      lt: to,
    };
    var updatedFilter = __assign(__assign({}, filter), {
      meta: __assign(__assign({}, filter.meta), {
        negate:
          operator === null || operator === void 0 ? void 0 : operator.negate,
        type: operator === null || operator === void 0 ? void 0 : operator.type,
        params: params,
      }),
      query: {
        range: ((_a = {}), (_a[field] = params), _a),
      },
    });
    return updatedFilter;
  } else {
    var from = (0, lodash_1.get)(rawParams, "from", undefined);
    var to = (0, lodash_1.get)(rawParams, "to", undefined);
    var params = {
      gte: from,
      lt: to,
    };
    var updatedFilter = __assign(__assign({}, filter), {
      meta: __assign(__assign({}, filter.meta), {
        negate:
          operator === null || operator === void 0 ? void 0 : operator.negate,
        type: operator === null || operator === void 0 ? void 0 : operator.type,
        params: params,
      }),
      query: {
        range: ((_b = {}), (_b[field] = params), _b),
      },
    });
    return updatedFilter;
  }
}
function updateWithIsOneOfOperator(filter, operator, params) {
  var _a;
  if (Array.isArray(params)) {
    return __assign(__assign({}, filter), {
      meta: __assign(__assign({}, filter.meta), {
        negate:
          operator === null || operator === void 0 ? void 0 : operator.negate,
        type: operator === null || operator === void 0 ? void 0 : operator.type,
        params: params,
      }),
      query: {
        bool: __assign(
          __assign(
            { minimum_should_match: 1 },
            (_a = filter.query) === null || _a === void 0 ? void 0 : _a.should
          ),
          {
            should:
              params === null || params === void 0
                ? void 0
                : params.map(function (param) {
                    var _a;
                    return {
                      match_phrase:
                        ((_a = {}), (_a[filter.meta.key] = param), _a),
                    };
                  }),
          }
        ),
      },
    });
  } else {
    return filter;
  }
}
