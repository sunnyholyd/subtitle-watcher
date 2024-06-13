import { SubtitleSegments, TranslatedSement } from "../common/subtitleSegmentStruct";
import { SetStateAction } from 'react';

interface SubtitleListProps {
  subtitleSegments: SubtitleSegments|undefined;
  setCurWordIndexS: (index: SetStateAction<number>) => void
  setCurWordIndexW: (index: SetStateAction<number>) => void
}

export default function SubtitleList({subtitleSegments, setCurWordIndexS, setCurWordIndexW}: SubtitleListProps) {

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = (seconds % 60).toFixed(3);

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const remainingSecondsStr = remainingSeconds.toString().padStart(6, '0').replace(".", ",");

    return `${hoursStr}:${minutesStr}:${remainingSecondsStr}`;
  };

  const markLongSegment = (data: any) => {
    if (data.length > 30) {
      return "bg-red-600"
    } else if (data.length > 20) {
      return "bg-yellow-200"
    }
  }

  const handleTranslateTextChange = (e: any, index: number) => {
    const value = e.target.value;

    if (subtitleSegments) {
      subtitleSegments.segments[index].translated = value;
      console.log(subtitleSegments.segments)
    }
  }

  const handleWordClick = (indexS: number, indexW: number) => {
    setCurWordIndexS(indexS);
    setCurWordIndexW(indexW);
  }

  if (!subtitleSegments) return;

    const segments = subtitleSegments.segments;
    const translatedSegments = subtitleSegments.translatedSegments;
    console.log(subtitleSegments)

    return segments.map((segment, indexS) => {
      const curTranslatedSeg = translatedSegments.length > indexS ? translatedSegments[indexS] : { first: "", second: "" };
      return (
        <div key={indexS} className="my-2 border-solid border-2">
          <div>{(indexS + 1) + ":   " + formatTime(segment.start) + "-" + formatTime(segment.end)}</div>
          <div className={`flex flex-row flex-wrap ${markLongSegment(segment.words)}`}>
            {
              segment.words.map((word, indexW) => {
                return (
                  <div key={indexW} title={formatTime(word.start) + " - " + formatTime(word.end)} className="px-1" onClick={() => handleWordClick(indexS, indexW)}>
                    {word.word}
                  </div>
                )
              })
            }
          </div>
          <textarea defaultValue={segment.translated} className="w-full" onChange={(e) => handleTranslateTextChange(e, indexS)}></textarea>
          <div>{curTranslatedSeg.first}</div>
          <div>{curTranslatedSeg.second}</div>
        </div>
      )
    })
}