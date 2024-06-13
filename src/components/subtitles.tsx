import { useState } from "react";
import { SubtitleSegments } from "../common/subtitleSegmentStruct";
import FileUpload from "./FileUpload";
import ControlPanel from "./ControlPanel";
import SubtitleList from "./SubtitileList";

export default function Subtitles() {
  const [curTimeJson, setTimeJson] = useState("");
  const [curJsonName, setCurJsonName] = useState("");

  const [subtitleSegments, setSubtitleSegments] = useState<SubtitleSegments>();

  const [count, setCount] = useState<number>(0);
  const [curWordIndexS, setCurWordIndexS] = useState<number>(0);
  const [curWordIndexW, setCurWordIndexW] = useState<number>(0);



  const resetCurWordIndex = () => {
    setCurWordIndexS(0)
    setCurWordIndexW(0)
    setCount((count) => count + 1);
  }

  return (
    <div>
      <FileUpload
        setCurJsonName={setCurJsonName}
        curTimeJson={curTimeJson}
        setTimeJson={setTimeJson}
        setSubtitleSegments={setSubtitleSegments}></FileUpload>
      {count}
      <ControlPanel
        subtitleSegments={subtitleSegments}
        curWordIndexS={curWordIndexS}
        curWordIndexW={curWordIndexW}
        resetCurWordIndex={resetCurWordIndex}
        curJsonName={curJsonName}></ControlPanel>
      <SubtitleList
        subtitleSegments={subtitleSegments}
        setCurWordIndexS={setCurWordIndexS}
        setCurWordIndexW={setCurWordIndexW}></SubtitleList>
    </div>
  );
}