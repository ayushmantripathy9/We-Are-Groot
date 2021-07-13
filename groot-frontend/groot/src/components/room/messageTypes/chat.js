// These are the messages sent and recieved via the chat web-socket //

/**
 * Web-Socket Message:
 * 
 * This event is triggered whenever any person joins a room
 * @data message_list: A list of all the messages that were sent in the room before the user joined
 */
export const MESSAGES_SENT_BEFORE = 'MESSAGES_SENT_BEFORE'

/**
 * Web-Socket Message:
 * 
 * This event is triggered while obtaining the room history
 * @data message_list: A list of all the messages that were sent in the room while the call happened
 */
export const GET_MESSAGES_SENT_BEFORE = 'GET_MESSAGES_SENT_BEFORE'

/**
 * Web-Socket Message (Burst Message):
 * 
 * This event is triggered while anyone sends a new message in the room chat
 * @data message: Contains all the information related to a message.
 * 
 * Message Info includes:
 *  - Message content
 *  - Time sent
 *  - Sender info
 *  - Message id
 */
export const NEW_MESSAGE = 'NEW_MESSAGE'