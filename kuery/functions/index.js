"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.functions = exports.KQL_FUNCTION_RANGE = exports.KQL_FUNCTION_OR = exports.KQL_FUNCTION_NOT = exports.KQL_FUNCTION_NESTED = exports.KQL_FUNCTION_IS = exports.KQL_FUNCTION_EXISTS = exports.KQL_FUNCTION_AND = void 0;
var is = require("./is");
var and = require("./and");
var or = require("./or");
var not = require("./not");
var range = require("./range");
var exists = require("./exists");
var nested = require("./nested");
var and_1 = require("./and");
Object.defineProperty(exports, "KQL_FUNCTION_AND", { enumerable: true, get: function () { return and_1.KQL_FUNCTION_AND; } });
var exists_1 = require("./exists");
Object.defineProperty(exports, "KQL_FUNCTION_EXISTS", { enumerable: true, get: function () { return exists_1.KQL_FUNCTION_EXISTS; } });
var is_1 = require("./is");
Object.defineProperty(exports, "KQL_FUNCTION_IS", { enumerable: true, get: function () { return is_1.KQL_FUNCTION_IS; } });
var nested_1 = require("./nested");
Object.defineProperty(exports, "KQL_FUNCTION_NESTED", { enumerable: true, get: function () { return nested_1.KQL_FUNCTION_NESTED; } });
var not_1 = require("./not");
Object.defineProperty(exports, "KQL_FUNCTION_NOT", { enumerable: true, get: function () { return not_1.KQL_FUNCTION_NOT; } });
var or_1 = require("./or");
Object.defineProperty(exports, "KQL_FUNCTION_OR", { enumerable: true, get: function () { return or_1.KQL_FUNCTION_OR; } });
var range_1 = require("./range");
Object.defineProperty(exports, "KQL_FUNCTION_RANGE", { enumerable: true, get: function () { return range_1.KQL_FUNCTION_RANGE; } });
exports.functions = {
    is: is,
    and: and,
    or: or,
    not: not,
    range: range,
    exists: exists,
    nested: nested,
};
