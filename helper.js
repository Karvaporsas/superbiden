/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const _monthNames = ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'];
const _shortMonthNames = ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu'];

function getIndentedColMessage(message, maxLength) {
    const countValue = maxLength + 1 - message.toString().length;
    return '' + message + (' ').repeat(countValue);
}

/**
 * Helper
 */
module.exports = {
    getEventMessageText(event) {
        var message = '';
        if (event.body.channel_post && event.body.channel_post.text) {
            message = event.body.channel_post.text;
        } else if (event.body.message && event.body.message.text) {
            message = event.body.message.text;
        }

        if (!message && event.body && event.body.message) {
            message = event.body.message.caption;
        }
        if (!message && event.body && event.body.edited_message) {
            message = event.body.edited_message.text;
        }

        return message;
    },
    getEventChatId(event) {
        var chatId = 0;
        if (event.body.message && event.body.message.chat && event.body.message.chat.id) {
            chatId = event.body.message.chat.id;
        } else if (event.body.channel_post && event.body.channel_post.chat && event.body.channel_post.chat.id) {
            chatId = event.body.channel_post.chat.id;
        } else if (event.body.edited_message && event.body.edited_message.chat) {
            chatId = event.body.edited_message.chat.id;
        }

        return chatId;
    },
    getEventUserId(event) {
        var userId = 0;

        if (event.body.message && event.body.message.from) userId = event.body.message.from.id;
        if(!userId && event.body.edited_message && event.body.edited_message.from) userId = event.body.edited_message.from.id;

        return userId;
    },
    getEventMessageName(event) {
        var name = '';

        if (event.body.message && event.body.message.from) {
            name = '' + event.body.message.from.first_name;

            if (event.body.message.from.last_name) name += (' ' + event.body.message.from.last_name);
        }
        if (!name && event.body.edited_message && event.body.edited_message.from) {
            name = '' + event.body.edited_message.from.first_name;

            if (event.body.edited_message.from.last_name) name += (' ' + event.body.edited_message.from.last_name);
        }

        return name;
    },
    parseCommand(message) {
        const tokens = message.split(' ');
        if (!tokens[0].match(/^\//)) {
            return null;
        }
        const command = [];
        const cmd = tokens.shift();
        const match = cmd.match(/\/(\w*)/);
        if (match.length > 0) {
            command[match[1]] = tokens;
        }

        return command;
    },
    formatMessage(title, description, users) {
        let message = '';

        if (title.length > 0) {
            message = `<strong>${title}</strong>`;
        }
        if (description && description.length > 0) {
            message += `\n<em>${description}</em>`;
        }

        if(users && users.length > 0) {
            message += '\n<pre>';
            for (const row of users) {
                message += `${row.name}: ${row.toxicity}\n`;
            }
            message += '</pre>';
        }

        return message;
    },
    formatListMessage(title, description, items) {
        let message = '';

        if (title.length > 0) {
            message = `<strong>${title}</strong>`;
        }
        if (description && description.length > 0) {
            message += `\n<em>${description}</em>`;
        }

        if(items && items.length > 0) {
            message += '\n<pre>';
            for (let i = 0; i < items.length; i += 2) {
                message += '' + items[i];
                if (i + 1 < items.length) message += ', ' + items[i+1] + '\n';
            }
            message += '</pre>';
        }

        return message;
    },
    getRandomItem(arr) {
        var idx = Math.floor(Math.random() * arr.length);
        return arr[idx];
    },
    /**
     * Converts Date to database format
     * @param {Date} d to convert
     *
     * @returns date as string in db format
     */
    getDBDate(d) {
        var dayNumber = d.getDate();
        var month = d.getMonth() + 1;
        return '' + d.getFullYear() + (month < 10 ? '0' : '') + month + (dayNumber < 10 ? '0' : '') + dayNumber;
    },
    /**
     * Creates list type message to show to user
     * @param {string} title of message
     * @param {string} description of message
     * @param {Array} rows to show as list
     * @param {Array} cols to show from rows
     *
     * @returns Listing kind message as string
     */
    formatCustomListMessage(title, description, rows, cols) {
        let message = '';

        if (title.length > 0) {
            message = `<strong>${title}</strong>`;
        }

        var colLenghts = {};
        for (const col of cols) {
            var maxLength = col.headerName.length;
            for (const row of rows) {
                var rowLenght = row[col.colProperty].toString().length;
                if (rowLenght > maxLength) maxLength = rowLenght;
            }
            colLenghts[col.colProperty] = maxLength;
        }

        if (description && description.length > 0) {
            message += `\n<em>${description}</em>`;
        }

        if(rows && rows.length > 0) {
            message += '\n<pre>';
            var header = '';
            for (const col of cols) {
                header += getIndentedColMessage(col.headerName, colLenghts[col.colProperty]);
            }
            message += header + '\n';
            for (const row of rows) {
                var rowString = '';
                for (const col of cols) {
                    rowString += getIndentedColMessage(row[col.colProperty], colLenghts[col.colProperty]);
                }
                message += rowString + '\n';
            }
            message += '</pre>';
        }

        return message;
    },

    getMonthName(monthNumber) {
        return _monthNames[monthNumber];
    },
    getShortMonthName(monthNumber) {
        return _shortMonthNames[monthNumber];
    }
};
