// These are the messages sent and recieved via the room web-socket //

/**
 * Web-Socket Message (Burst Message):
 * 
 * This event occurs whenever any person joins a room
 * @data user_info: ALl information pertaining to the user who joined
 * 
 * User Info includes:
 *  - User id
 *  - Name
 *  - Username
 *  - Email
 *  - Profile pic url
 */
export const USER_JOINED = 'USER_JOINED'

/**
 * Web-Socket Message:
 * 
 * This event is triggered whenever any person joins a room
 * @data participants_list: A list of all the participants currently present in the room before the user joined
 */
export const ROOM_PARTICIPANTS = 'ROOM_PARTICIPANTS'

/**
 * Web-Socket Message (Burst Message):
 * 
 * This event occurs whenever any person leaves a room
 * @data user_info: All information pertaining to the user who left
 * 
 * User Info includes:
 *  - User id
 *  - Name
 *  - Username
 *  - Email
 *  - Profile pic url
 */
export const USER_LEFT = 'USER_LEFT'