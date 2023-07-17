"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConvertedValueForField = void 0;
/**
 * @internal
 * See issues bellow for the reason behind this change.
 * Values need to be converted to correct types for boolean \ numeric fields.
 * https://github.com/elastic/kibana/issues/74301
 * https://github.com/elastic/kibana/issues/8677
 * https://github.com/elastic/elasticsearch/issues/20941
 * https://github.com/elastic/elasticsearch/pull/22201
 **/
var getConvertedValueForField = function (field, value) {
  if (typeof value !== "boolean" && field.type === "boolean") {
    if ([1, "true"].includes(value)) {
      return true;
    } else if ([0, "false"].includes(value)) {
      return false;
    } else {
      throw new Error(
        ""
          .concat(value, " is not a valid boolean value for boolean field ")
          .concat(field.name)
      );
    }
  }
  if (typeof value !== "number" && field.type === "number") {
    return Number(value);
  }
  return value;
};
exports.getConvertedValueForField = getConvertedValueForField;
