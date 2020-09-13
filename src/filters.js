import Vue from 'vue'
import humanizeString from "humanize-string";

export const FILTERS = {
    humanize: (value) => {
        return humanizeString(value);
    }
}

export const registerFilters = function () {
    Object.keys(FILTERS).forEach(key => {
        Vue.filter(key, FILTERS[key]);
    })
}