import { useSelector } from "react-redux"

export default function Room() {
    const RoomInfo = useSelector(state => state.roomInfo)

    console.log("Room info:",RoomInfo)
    return (
        <div>
            <h2>Room component</h2>
            <h3>
                Room Code : {RoomInfo.room_code}
            </h3>

        </div>
    )
}