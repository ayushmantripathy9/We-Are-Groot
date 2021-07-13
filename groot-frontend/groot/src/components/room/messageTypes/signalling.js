// These are the messages sent and recieved via the signalling web-socket //

/**
 * Web-Socket Message:
 * 
 * This event is triggered whenever any person joins a room
 * @data participant_list: A list of all the participants currently present in the room before the user joined
 * (These all would be called once list is received)
 */
export const CALL_CONNECTED = 'CALL_CONNECTED'

/**
 * Web-Socket Message(Burst Message):
 * 
 * This event is triggered whenever any person who joins a room calls the peers
 * @data offer: A WebRTC offer containing the Local Description of the user who called
 * 
 * Offer contains:
 *  - targetID: This should match the current userID for offer to be accepted
 *  - senderID: Id of the user who sent the offer
 *  - sdp: Session description of the sender (Local Description)
 */
export const OFFER = 'OFFER'

/**
 * Web-Socket Message:
 * 
 * This event is triggered whenever a user receives an offer and answers it
 * @data answer: A WebRTC answer containing the Local Description of the user who answered to the offer recieved
 * 
 * Answer contains:
 *  - targetID: This should match the current userID for answer to be valid
 *  - senderID: Id of the user who sent the answer
 *  - sdp: Session description of the sender (Local Description)
 */
export const ANSWER = 'ANSWER'

/**
 * Web-Socket Message:
 * 
 * This event is triggered whenever a user receives an ice-candidate from the peer
 * @data candidate: A WebRTC answer containing the ICE candidate of the peer
 */
export const ICE_CANDIDATE = 'ICE_CANDIDATE'

/**
 * Web-Socket Message(Burst Message):
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
export const PARTICIPANT_LEFT = 'PARTICIPANT_LEFT'