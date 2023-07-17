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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKqlExpression =
  exports.toElasticsearchQuery =
  exports.buildNodeParams =
  exports.isNode =
  exports.KQL_FUNCTION_IS =
    void 0;
var filters_1 = require("../../filters");
var get_fields_1 = require("./utils/get_fields");
var utils_1 = require("../../utils");
var get_full_field_name_node_1 = require("./utils/get_full_field_name_node");
var ast = require("../ast");
var literal = require("../node_types/literal");
var wildcard = require("../node_types/wildcard");
function isUndefined(obj) {
  return obj === undefined;
}
exports.KQL_FUNCTION_IS = "is";
function isNode(node) {
  return node.function === exports.KQL_FUNCTION_IS;
}
exports.isNode = isNode;
function buildNodeParams(fieldName, value) {
  if ((0, isUndefined)(fieldName)) {
    throw new Error("fieldName is a required argument");
  }
  if ((0, isUndefined)(value)) {
    throw new Error("value is a required argument");
  }
  var fieldNode =
    typeof fieldName === "string"
      ? ast.fromLiteralExpression(fieldName)
      : literal.buildNode(fieldName);
  var valueNode =
    typeof value === "string"
      ? ast.fromLiteralExpression(value)
      : literal.buildNode(value);
  return {
    arguments: [fieldNode, valueNode],
  };
}
exports.buildNodeParams = buildNodeParams;
function toElasticsearchQuery(node, indexPattern, config, context) {
  if (config === void 0) {
    config = {};
  }
  if (context === void 0) {
    context = {};
  }
  var _a = node.arguments,
    fieldNameArg = _a[0],
    valueArg = _a[1];
  var isExistsQuery =
    wildcard.isNode(valueArg) && wildcard.isLoneWildcard(valueArg);
  var isAllFieldsQuery =
    wildcard.isNode(fieldNameArg) && wildcard.isLoneWildcard(fieldNameArg);
  var isMatchAllQuery = isExistsQuery && isAllFieldsQuery;
  if (isMatchAllQuery) {
    return { match_all: {} };
  }
  var fullFieldNameArg = (0, get_full_field_name_node_1.getFullFieldNameNode)(
    fieldNameArg,
    indexPattern,
    (context === null || context === void 0 ? void 0 : context.nested)
      ? context.nested.path
      : undefined
  );
  var value = !(0, isUndefined)(valueArg)
    ? ast.toElasticsearchQuery(valueArg)
    : valueArg;
  var type = valueArg.isQuoted ? "phrase" : "best_fields";
  if (fullFieldNameArg.value === null) {
    if (wildcard.isNode(valueArg)) {
      return {
        query_string: {
          query: wildcard.toQueryStringQuery(valueArg),
        },
      };
    }
    return {
      multi_match: {
        type: type,
        query: value,
        lenient: true,
      },
    };
  }
  var fields = indexPattern
    ? (0, get_fields_1.getFields)(fullFieldNameArg, indexPattern)
    : [];
  // If no fields are found in the index pattern we send through the given field name as-is. We do this to preserve
  // the behaviour of lucene on dashboards where there are panels based on different index patterns that have different
  // fields. If a user queries on a field that exists in one pattern but not the other, the index pattern without the
  // field should return no results. It's debatable whether this is desirable, but it's been that way forever, so we'll
  // keep things familiar for now.
  if (fields && fields.length === 0) {
    fields.push({
      name: ast.toElasticsearchQuery(fullFieldNameArg),
      scripted: false,
      type: "",
    });
  }
  // Special case for wildcards where there are no fields or all fields share the same prefix
  if (
    isExistsQuery &&
    (!(fields === null || fields === void 0 ? void 0 : fields.length) ||
      (fields === null || fields === void 0 ? void 0 : fields.length) ===
        (indexPattern === null || indexPattern === void 0
          ? void 0
          : indexPattern.fields.length))
  ) {
    return { match_all: {} };
  }
  var queries = fields.reduce(function (accumulator, field) {
    var _a, _b, _c, _d, _e;
    var _f;
    var isKeywordField =
      ((_f = field.esTypes) === null || _f === void 0 ? void 0 : _f.length) ===
        1 && field.esTypes.includes("keyword");
    var wrapWithNestedQuery = function (query) {
      // Wildcards can easily include nested and non-nested fields. There isn't a good way to let
      // users handle this themselves so we automatically add nested queries in this scenario.
      var subTypeNested = (0, utils_1.getDataViewFieldSubtypeNested)(field);
      if (
        !wildcard.isNode(fullFieldNameArg) ||
        !(subTypeNested === null || subTypeNested === void 0
          ? void 0
          : subTypeNested.nested) ||
        (context === null || context === void 0 ? void 0 : context.nested)
      ) {
        return query;
      } else {
        return {
          nested: __assign(
            {
              path: subTypeNested.nested.path,
              query: query,
              score_mode: "none",
            },
            typeof config.nestedIgnoreUnmapped === "boolean" && {
              ignore_unmapped: config.nestedIgnoreUnmapped,
            }
          ),
        };
      }
    };
    if (field.scripted) {
      // Exists queries don't make sense for scripted fields
      if (!isExistsQuery) {
        return __spreadArray(
          __spreadArray([], accumulator, true),
          [
            {
              script: __assign(
                {},
                (0, filters_1.getPhraseScript)(field, value)
              ),
            },
          ],
          false
        );
      }
    } else if (isExistsQuery) {
      return __spreadArray(
        __spreadArray([], accumulator, true),
        [
          wrapWithNestedQuery({
            exists: {
              field: field.name,
            },
          }),
        ],
        false
      );
    } else if (wildcard.isNode(valueArg)) {
      var query = isKeywordField
        ? {
            wildcard:
              ((_a = {}),
              (_a[field.name] = __assign(
                { value: value },
                typeof config.caseInsensitive === "boolean" && {
                  case_insensitive: config.caseInsensitive,
                }
              )),
              _a),
          }
        : {
            query_string: {
              fields: [field.name],
              query: wildcard.toQueryStringQuery(valueArg),
            },
          };
      return __spreadArray(
        __spreadArray([], accumulator, true),
        [wrapWithNestedQuery(query)],
        false
      );
    } else if (field.type === "date") {
      /*
            If we detect that it's a date field and the user wants an exact date, we need to convert the query to both >= and <= the value provided to force a range query. This is because match and match_phrase queries do not accept a timezone parameter.
            dateFormatTZ can have the value of 'Browser', in which case we guess the timezone using moment.tz.guess.
          */
      var timeZoneParam = config.dateFormatTZ
        ? {
            time_zone: (0, utils_1.getTimeZoneFromSettings)(
              config.dateFormatTZ
            ),
          }
        : {};
      return __spreadArray(
        __spreadArray([], accumulator, true),
        [
          wrapWithNestedQuery({
            range:
              ((_b = {}),
              (_b[field.name] = __assign(
                { gte: value, lte: value },
                timeZoneParam
              )),
              _b),
          }),
        ],
        false
      );
    } else if (isKeywordField) {
      return __spreadArray(
        __spreadArray([], accumulator, true),
        [
          wrapWithNestedQuery({
            term:
              ((_c = {}),
              (_c[field.name] = __assign(
                { value: value },
                typeof config.caseInsensitive === "boolean" && {
                  case_insensitive: config.caseInsensitive,
                }
              )),
              _c),
          }),
        ],
        false
      );
    } else {
      var queryType = type === "phrase" ? "match_phrase" : "match";
      return __spreadArray(
        __spreadArray([], accumulator, true),
        [
          wrapWithNestedQuery(
            ((_d = {}),
            (_d[queryType] = ((_e = {}), (_e[field.name] = value), _e)),
            _d)
          ),
        ],
        false
      );
    }
  }, []);
  return {
    bool: {
      should: queries || [],
      minimum_should_match: 1,
    },
  };
}
exports.toElasticsearchQuery = toElasticsearchQuery;
function toKqlExpression(node) {
  var _a = node.arguments,
    field = _a[0],
    value = _a[1];
  if (field.value === null) return "".concat(ast.toKqlExpression(value));
  return ""
    .concat(ast.toKqlExpression(field), ": ")
    .concat(ast.toKqlExpression(value));
}
exports.toKqlExpression = toKqlExpression;
