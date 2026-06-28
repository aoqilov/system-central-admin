import { useState } from "react";
import dayjs from "dayjs";
import { AttractionSmenaCard } from "./components/AttractionSmenaCard";
import { RoundsTable } from "./components/RoundsTable";
import { MOCK_ATTRACTION_NAME, MOCK_SMENA, MOCK_ROUNDS } from "./api/homeApi";

export default function FeatureOperatorHome() {
  const [smenaOpen, setSmenaOpen]           = useState(false);
  const [smenaStartTime, setSmenaStartTime] = useState("");
  const [operatorName, setOperatorName]     = useState(MOCK_SMENA.operatorName);
  const [paused, setPaused]                 = useState(false);
  const [pauseReason, setPauseReason]       = useState("");

  function openSmena(name: string) {
    setOperatorName(name);
    setSmenaStartTime(dayjs().format("HH:mm"));
    setSmenaOpen(true);
  }

  function closeSmena() {
    setSmenaOpen(false);
    setSmenaStartTime("");
    setPaused(false);
    setPauseReason("");
  }

  function pauseSmena(reason: string) {
    setPaused(true);
    setPauseReason(reason);
  }

  function resumeSmena() {
    setPaused(false);
    setPauseReason("");
  }

  return (
    <div className="p-4 space-y-4 pb-6">
      <AttractionSmenaCard
        attractionName={MOCK_ATTRACTION_NAME}
        smenaOpen={smenaOpen}
        smenaInfo={{ ...MOCK_SMENA, operatorName, openedAt: smenaStartTime }}
        rounds={MOCK_ROUNDS}
        paused={paused}
        pauseReason={pauseReason}
        onOpen={openSmena}
        onClose={closeSmena}
        onPause={pauseSmena}
        onResume={resumeSmena}
      />
      <RoundsTable rounds={MOCK_ROUNDS} />
    </div>
  );
}
