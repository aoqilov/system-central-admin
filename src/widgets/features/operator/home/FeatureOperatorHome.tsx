import { useState } from "react";
import dayjs from "dayjs";
import { AttractionSmenaCard } from "./components/AttractionSmenaCard";
import { RoundsTable } from "./components/RoundsTable";
import { MOCK_ATTRACTION_NAME, MOCK_SMENA, MOCK_ROUNDS } from "./api/homeApi";

export default function FeatureOperatorHome() {
  const [smenaOpen, setSmenaOpen] = useState(false);
  const [smenaStartTime, setSmenaStartTime] = useState("");

  function openSmena() {
    setSmenaStartTime(dayjs().format("HH:mm"));
    setSmenaOpen(true);
  }

  function closeSmena() {
    setSmenaOpen(false);
    setSmenaStartTime("");
  }

  return (
    <div className="p-4 space-y-4 pb-6">
      <AttractionSmenaCard
        attractionName={MOCK_ATTRACTION_NAME}
        smenaOpen={smenaOpen}
        smenaInfo={{ ...MOCK_SMENA, openedAt: smenaStartTime }}
        rounds={MOCK_ROUNDS}
        onOpen={openSmena}
        onClose={closeSmena}
      />
      <RoundsTable rounds={MOCK_ROUNDS} />
    </div>
  );
}
