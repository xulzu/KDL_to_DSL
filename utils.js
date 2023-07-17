/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import moment from 'moment-timezone';
/** @internal */
export function getTimeZoneFromSettings(dateFormatTZ) {
    var detectedTimezone = moment.tz.guess();
    return dateFormatTZ === 'Browser' ? detectedTimezone : dateFormatTZ;
}
export function isDataViewFieldSubtypeNested(field) {
    var _a;
    var subTypeNested = field === null || field === void 0 ? void 0 : field.subType;
    return !!((_a = subTypeNested === null || subTypeNested === void 0 ? void 0 : subTypeNested.nested) === null || _a === void 0 ? void 0 : _a.path);
}
export function getDataViewFieldSubtypeNested(field) {
    return isDataViewFieldSubtypeNested(field) ? field.subType : undefined;
}
export function isDataViewFieldSubtypeMulti(field) {
    var _a;
    var subTypeNested = field === null || field === void 0 ? void 0 : field.subType;
    return !!((_a = subTypeNested === null || subTypeNested === void 0 ? void 0 : subTypeNested.multi) === null || _a === void 0 ? void 0 : _a.parent);
}
export function getDataViewFieldSubtypeMulti(field) {
    return isDataViewFieldSubtypeMulti(field) ? field.subType : undefined;
}
