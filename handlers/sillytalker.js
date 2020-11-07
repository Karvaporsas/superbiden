/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const brainMatter = require('../brains.json');
const messageSender = require('../telegramMessageSender');
const DEBUG_MODE = process.env.DEBUG_MODE === 'ON';
const BLABBER_FREQUENCY = parseInt((process.env.BLABBER_FREQUENCY || '1000'), 10);
const _standardResponse = {
    status: 1,
    type: 'text',
    message: 'All good'
};

function _blabberABit(chatId, resolve, reject) {
    var randomNr = Math.floor(Math.random() * brainMatter.Thoughts.length);

    const thought = brainMatter.Thoughts[randomNr];

    var message = `${thought.Idea}\n\n${thought.Link}`;

    messageSender.sendMessageToTelegram(chatId, {type: 'text', message: 'But guess what, folks polks: ' + message}).then(function () {
        resolve(_standardResponse);
    }).catch(function (err) {
        reject(err);
    });
}

/**
 * Commands
 */
module.exports = {
    /**
     * Creates error message
     * @param {Object} error To send
     * @returns Promise
     */
    error(error) {
        return new Promise((resolve, reject) => {
            if (error) {
                reject(error);
            }
            else {
                resolve({status: 1, message: "Mitä täällä tapahtuu?", type: "text"});
            }
        });
    },
    /**
     * Handles processing any command
     *
     * @param {Object} event Message from Telegram
     * @param {int} chatId Id of chat where it came from
     *
     * @returns Promise
     */
    blabber(chatId) {
        return new Promise((resolve, reject) => {
            const seed = Math.floor(Math.random() * BLABBER_FREQUENCY);

            if (DEBUG_MODE) {
                console.log(`Checking blabbers with seed ${seed}`);
            }

            const shouldBlabber = seed === 0;

            if (shouldBlabber) {
                _blabberABit(chatId, resolve, reject);
            } else {
                resolve(_standardResponse);
            }
        });
    }
};
