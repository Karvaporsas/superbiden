/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const commands = require('./commands');
const triggers = require('./handlers/triggers');
const sillytalk = require('./handlers/sillytalker');
const helper = require('./helper');
const DEBUG_MODE = process.env.DEBUG_MODE === 'ON';

/**
 * Basic AWS Lambda handler. This is called when Telegram sends any messages to AWS API
 * @param event Message from Telegram
 * @param context Lambda context
 * @returns HTML status response with statusCode 200
 */
exports.handler = (event, context) => {
    console.log('starting to process message');

    const chatId = helper.getEventChatId(event);
    const standardResponse = {
        statusCode: 200,
    };

    if (DEBUG_MODE) {
        console.log(event.body);
    }

    commands.processCommand(event, chatId).then((result) => {
        if (DEBUG_MODE) {
            console.log('Done, result is: ');
            console.log(result);
        }
    }).then(function () {
        return triggers.process(event, chatId);
    }).then(function () {
        return sillytalk.blabber(chatId);
    }).catch((e) => {
        console.log("Error handling command");
        console.log(e);
        context.fail(e);
    });

    return standardResponse;
};