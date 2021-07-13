# These events occur during signalling for WebRTC and on the user being ready and leaving the socket as well

CALL_CONNECTED = "CALL_CONNECTED"
ICE_CANDIDATE = 'ICE_CANDIDATE'
OFFER = 'OFFER'
ANSWER = 'ANSWER'
PARTICIPANT_LEFT = 'PARTICIPANT_LEFT'

specific_user_messages = [
    ICE_CANDIDATE,
    OFFER,
    ANSWER
]
