
import React from 'react';
import { SubtitleSegments } from "../common/subtitleSegmentStruct";
import { Dispatch, SetStateAction } from 'react';

interface FileUploadProps {
  curTimeJson: string;
  setCurJsonName: Dispatch<SetStateAction<string>>;
  setTimeJson: Dispatch<SetStateAction<string>>;
  setSubtitleSegments: Dispatch<SetStateAction<SubtitleSegments | undefined>>;
}

export default function FileUpload({
  setCurJsonName, curTimeJson, setTimeJson, setSubtitleSegments}: FileUploadProps) {

  const handleTimeJsonChange = (e: any) => {
    const file = e.target.files[0];
    setCurJsonName(file.name);

    const reader = new FileReader();
    reader.onload = (event: any) => {
      setTimeJson(event.target.result);
    };
    reader.readAsText(file);
  }

  const showSubtitleSegments = () => {
    const ss = new SubtitleSegments(curTimeJson);
    setSubtitleSegments(ss);
  }

  return (
    <>
      <input id="upload" type="file" onChange={handleTimeJsonChange}></input>
      <button className="border-2 border-black" onClick={showSubtitleSegments}>展示Test</button>
    </>
  )

}