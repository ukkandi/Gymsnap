import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const AccountabilityRoomsContext = createContext(null);

const buildPersonKey = (person) =>
  `${person?.name ?? "anon"}-${person?.age ?? "x"}-${person?.energyType ?? "mix"}`;

export function AccountabilityRoomsProvider({ children }) {
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);

  const addRoom = useCallback((person, compatibility, explanation) => {
    if (!person) return null;
    const key = buildPersonKey(person);
    let newRoomId = null;

    setRooms((prev) => {
      const existing = prev.find((room) => room.personKey === key);
      if (existing) {
        newRoomId = existing.id;
        return prev;
      }

      const room = {
        id: `${key}-${Date.now()}`,
        person,
        personKey: key,
        compatibility,
        explanation,
        messages: [
          {
            id: `intro-${Date.now()}`,
            sender: "ai",
            text: explanation,
          },
          {
            id: `match-${Date.now()}`,
            sender: person.name,
            text: "Let’s lock a session this week.",
          },
        ],
      };

      newRoomId = room.id;
      return [room, ...prev];
    });

    if (newRoomId) {
      setActiveRoomId(newRoomId);
    }

    return newRoomId;
  }, []);

  const appendMessage = useCallback((roomId, message) => {
    if (!roomId || !message) return;

    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              messages: [
                ...room.messages,
                {
                  id: message.id || `${roomId}-${Date.now()}`,
                  text: message.text,
                  sender: message.sender || "system",
                },
              ],
            }
          : room
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      rooms,
      activeRoomId,
      setActiveRoomId,
      addRoom,
      appendMessage,
    }),
    [rooms, activeRoomId, addRoom, appendMessage]
  );

  return (
    <AccountabilityRoomsContext.Provider value={value}>
      {children}
    </AccountabilityRoomsContext.Provider>
  );
}

export const useAccountabilityRooms = () => {
  const ctx = useContext(AccountabilityRoomsContext);
  if (!ctx) {
    throw new Error(
      "useAccountabilityRooms must be used within an AccountabilityRoomsProvider"
    );
  }
  return ctx;
};
