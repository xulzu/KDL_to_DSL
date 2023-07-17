/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { groupBy, has, isEqual } from 'lodash';
import { buildQueryFromKuery } from './from_kuery';
import { buildQueryFromFilters } from './from_filters';
import { isOfQueryType } from './es_query_sql';
function removeMatchAll(filters) {
    return filters.filter(function (filter) { return !filter || typeof filter !== 'object' || !isEqual(filter, { match_all: {} }); });
}
/**
 * @param indexPattern
 * @param queries - a query object or array of query objects. Each query has a language property and a query property.
 * @param filters - a filter object or array of filter objects
 * @param config - an objects with query:allowLeadingWildcards and query:queryString:options UI
 * settings in form of { allowLeadingWildcards, queryStringOptions }
 * config contains dateformat:tz
 *
 * @public
 */
export function buildEsQuery(indexPattern, queries, filters, config) {
    if (config === void 0) { config = {
        allowLeadingWildcards: false,
        queryStringOptions: {},
        ignoreFilterIfFieldNotInIndex: false,
    }; }
    queries = Array.isArray(queries) ? queries : [queries];
    filters = Array.isArray(filters) ? filters : [filters];
    var validQueries = queries.filter(isOfQueryType).filter(function (query) { return has(query, 'query'); });
    var queriesByLanguage = groupBy(validQueries, 'language');
    var kueryQuery = buildQueryFromKuery(Array.isArray(indexPattern) ? indexPattern[0] : indexPattern, queriesByLanguage.kuery, { allowLeadingWildcards: config.allowLeadingWildcards }, {
        dateFormatTZ: config.dateFormatTZ,
        filtersInMustClause: config.filtersInMustClause,
        nestedIgnoreUnmapped: config.nestedIgnoreUnmapped,
        caseInsensitive: config.caseInsensitive,
    });
    var filterQuery = buildQueryFromFilters(filters, indexPattern, {
        ignoreFilterIfFieldNotInIndex: config.ignoreFilterIfFieldNotInIndex,
        nestedIgnoreUnmapped: config.nestedIgnoreUnmapped,
    });
    return {
        bool: {
            must: removeMatchAll(__spreadArray(__spreadArray([], kueryQuery.must, true), filterQuery.must, true)),
            filter: removeMatchAll(__spreadArray(__spreadArray([], kueryQuery.filter, true), filterQuery.filter, true)),
            should: removeMatchAll(__spreadArray(__spreadArray([], kueryQuery.should, true), filterQuery.should, true)),
            must_not: __spreadArray(__spreadArray([], kueryQuery.must_not, true), filterQuery.must_not, true),
        },
    };
}
