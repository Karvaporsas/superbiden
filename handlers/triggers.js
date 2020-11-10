/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const brainMatter = require('../brains.json');
const helper = require('../helper');
const messageSender = require('../telegramMessageSender');
const TEST_MODE = process.env.TEST_MODE === 'ON';
const TRIGGER_PROPABILITY = parseInt( (process.env.TRIGGER_PROPABILITY || '1'), 10);
const _standardResponse = {
    status: 1,
    type: 'text',
    message: 'All good'
};

function _scanForTriggers(text) {
    const lcString = (text || '').toLowerCase();

    for (const trigger of brainMatter.Triggers) {
        if (lcString.indexOf(trigger) > -1) {
            return {status: 1, triggersActivated: true};
        }
    }

    return {status: 1, triggersActivated: TEST_MODE ? true : false};
}

function _sendFrontalCortexResponse(chatId, resolve, reject) {
    var randomNr = Math.floor(Math.random() * brainMatter.FrontalCortexResponses.length);

    messageSender.sendMessageToTelegram(chatId, {type: 'text', message: brainMatter.FrontalCortexResponses[randomNr]}).then(function () {
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
    process(event, chatId) {
        return new Promise((resolve, reject) => {
            var messageText = helper.getEventMessageText(event);

            var triggerScanResult = _scanForTriggers(messageText);
            var heRemembered = Math.floor(Math.random() * TRIGGER_PROPABILITY) === TRIGGER_PROPABILITY -1;
            if (triggerScanResult.triggersActivated && heRemembered) {
                _sendFrontalCortexResponse(chatId, resolve, reject);
            } else {
                resolve(_standardResponse);
            }
        });
    }
};
