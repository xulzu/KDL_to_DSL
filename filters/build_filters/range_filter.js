"use strict";
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
exports.getRangeScript =
  exports.buildRangeFilter =
  exports.getRangeFilterField =
  exports.isScriptedRangeFilter =
  exports.isRangeFilterParams =
  exports.isRangeFilter =
  exports.hasRangeKeys =
    void 0;
var lodash_1 = require("lodash");
var types_1 = require("./types");
var OPERANDS_IN_RANGE = 2;
var operators = {
  gt: ">",
  gte: ">=",
  lte: "<=",
  lt: "<",
};
var comparators = {
  gt: "boolean gt(Supplier s, def v) {return s.get() > v}",
  gte: "boolean gte(Supplier s, def v) {return s.get() >= v}",
  lte: "boolean lte(Supplier s, def v) {return s.get() <= v}",
  lt: "boolean lt(Supplier s, def v) {return s.get() < v}",
};
var dateComparators = {
  gt: "boolean gt(Supplier s, def v) {return s.get().toInstant().isAfter(Instant.parse(v))}",
  gte: "boolean gte(Supplier s, def v) {return !s.get().toInstant().isBefore(Instant.parse(v))}",
  lte: "boolean lte(Supplier s, def v) {return !s.get().toInstant().isAfter(Instant.parse(v))}",
  lt: "boolean lt(Supplier s, def v) {return s.get().toInstant().isBefore(Instant.parse(v))}",
};
var hasRangeKeys = function (params) {
  return Boolean(
    (0, lodash_1.keys)(params).find(function (key) {
      return ["gte", "gt", "lte", "lt", "from", "to"].includes(key);
    })
  );
};
exports.hasRangeKeys = hasRangeKeys;
/**
 * @param filter
 * @returns `true` if a filter is an `RangeFilter`
 *
 * @public
 */
function isRangeFilter(filter) {
  var _a;
  if (
    (_a = filter === null || filter === void 0 ? void 0 : filter.meta) ===
      null || _a === void 0
      ? void 0
      : _a.type
  )
    return filter.meta.type === types_1.FILTERS.RANGE;
  return (0, lodash_1.has)(filter, "query.range");
}
exports.isRangeFilter = isRangeFilter;
function isRangeFilterParams(params) {
  return (
    typeof params === "object" &&
    (0, lodash_1.get)(params, "type", "") === "range"
  );
}
exports.isRangeFilterParams = isRangeFilterParams;
/**
 *
 * @param filter
 * @returns `true` if a filter is a scripted `RangeFilter`
 *
 * @public
 */
var isScriptedRangeFilter = function (filter) {
  var params = (0, lodash_1.get)(filter, "query.script.script.params", {});
  return (0, exports.hasRangeKeys)(params);
};
exports.isScriptedRangeFilter = isScriptedRangeFilter;
/**
 * @internal
 */
var getRangeFilterField = function (filter) {
  var _a, _b;
  return (_b =
    (_a = filter.meta) === null || _a === void 0 ? void 0 : _a.field) !==
    null && _b !== void 0
    ? _b
    : filter.query.range && Object.keys(filter.query.range)[0];
};
exports.getRangeFilterField = getRangeFilterField;
var formatValue = function (params) {
  return (0, lodash_1.map)(params, function (val, key) {
    return (0, lodash_1.get)(operators, key) + val;
  }).join(" ");
};
/**
 * Creates a filter where the value for the given field is in the given range
 * params should be an object containing `lt`, `lte`, `gt`, and/or `gte`
 *
 * @param field
 * @param params
 * @param indexPattern
 * @param formattedValue
 * @returns
 *
 * @public
 */
var buildRangeFilter = function (field, params, indexPattern, formattedValue) {
  var _a;
  params = (0, lodash_1.mapValues)(params, function (value) {
    return field.type === "number" ? parseFloat(value) : value;
  });
  if ("gte" in params && "gt" in params)
    throw new Error("gte and gt are mutually exclusive");
  if ("lte" in params && "lt" in params)
    throw new Error("lte and lt are mutually exclusive");
  var totalInfinite = ["gt", "lt"].reduce(function (acc, op) {
    var key = op in params ? op : "".concat(op, "e");
    var value = (0, lodash_1.get)(params, key);
    var numericValue = typeof value === "number" ? value : 0;
    var isInfinite = Math.abs(numericValue) === Infinity;
    if (isInfinite) {
      acc++;
      // @ts-ignore
      delete params[key];
    }
    return acc;
  }, 0);
  var meta = __assign(
    {
      index:
        indexPattern === null || indexPattern === void 0
          ? void 0
          : indexPattern.id,
      params: {},
      field: field.name,
    },
    formattedValue ? { formattedValue: formattedValue } : {}
  );
  if (totalInfinite === OPERANDS_IN_RANGE) {
    return { meta: meta, query: { match_all: {} } };
  } else if (field.scripted) {
    var scr = (0, exports.getRangeScript)(field, params);
    // TODO: type mismatch enforced
    scr.script.params.value = formatValue(scr.script.params);
    return { meta: meta, query: { script: scr } };
  } else {
    return {
      meta: meta,
      query: { range: ((_a = {}), (_a[field.name] = params), _a) },
    };
  }
};
exports.buildRangeFilter = buildRangeFilter;
/**
 * @internal
 */
var getRangeScript = function (field, params) {
  var knownParams = (0, lodash_1.mapValues)(
    (0, lodash_1.pickBy)(params, function (val, key) {
      return key in operators;
    }),
    function (value) {
      return field.type === "number" && typeof value === "string"
        ? parseFloat(value)
        : value;
    }
  );
  var script = (0, lodash_1.map)(knownParams, function (_, key) {
    return "(" + field.script + ")" + (0, lodash_1.get)(operators, key) + key;
  }).join(" && ");
  // We must wrap painless scripts in a lambda in case they're more than a simple expression
  if (field.lang === "painless") {
    var comp_1 = field.type === "date" ? dateComparators : comparators;
    var currentComparators = (0, lodash_1.reduce)(
      knownParams,
      function (acc, val, key) {
        return acc.concat((0, lodash_1.get)(comp_1, key));
      },
      []
    ).join(" ");
    var comparisons = (0, lodash_1.map)(knownParams, function (val, key) {
      return ""
        .concat(key, "(() -> { ")
        .concat(field.script, " }, params.")
        .concat(key, ")");
    }).join(" && ");
    script = "".concat(currentComparators).concat(comparisons);
  }
  return {
    script: {
      source: script,
      params: knownParams,
      lang: field.lang,
    },
  };
};
exports.getRangeScript = getRangeScript;
