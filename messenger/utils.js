'use strict';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function randomString(length) {
    return Math.random().toString(36).slice(-length);
}

module.exports = {
    sleep,
    capitalizeFirstLetter,
    randomString,
};