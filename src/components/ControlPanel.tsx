import { SubtitleSegments, TranslatedSement } from "../common/subtitleSegmentStruct";
import { toAss } from "../common/assUtil";
import { srtArray, toSrt } from "srtparsejs";

interface ControlPanelProps {
  subtitleSegments: SubtitleSegments|undefined;
  curWordIndexS: number;
  curWordIndexW: number;
  resetCurWordIndex: () => void;
  curJsonName: string;
}

export default function ControlPanel({ subtitleSegments, curWordIndexS, curWordIndexW, resetCurWordIndex, curJsonName}: ControlPanelProps) {
  const handleMergeSegment = () => {
    subtitleSegments?.merge(curWordIndexS, curWordIndexW);
    resetCurWordIndex();
  }

  const handleSplitSegment = () => {
    subtitleSegments?.split(curWordIndexS, curWordIndexW);
    resetCurWordIndex();
  }

  const handleRemoveWord = () => {
    subtitleSegments?.removeNode(curWordIndexS, curWordIndexW);
    resetCurWordIndex();
  }

  const handleSave = () => {
    writeJson();
    writeSrt();
    writeAss();
  }

  const writeJson = () => {
    const jsonBody = {
      "name": curJsonName,
      "data": subtitleSegments
    }

    fetch("/api/writeData", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonBody)
    })
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => {
        console.error("error", error)
      });
  }

  const srtFromSs = () => {
    if (subtitleSegments) {
      const srtArr: srtArray[] = subtitleSegments.segments.map((seg, index) => {
        return {
          text: seg.translated + "\n" + seg.text,
          startTime: formatTime(seg.start),
          endTime: formatTime(seg.end),
          id: (index + 1).toString()
        }
      })
      return toSrt(srtArr);
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = (seconds % 60).toFixed(3);

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const remainingSecondsStr = remainingSeconds.toString().padStart(6, '0').replace(".", ",");

    return `${hoursStr}:${minutesStr}:${remainingSecondsStr}`;
  };

  const writeSrt = () => {
    const srtName = curJsonName.split(".")[0] + ".srt";

    const srtBody = {
      "name": srtName,
      "data": srtFromSs()
    }
    // console.log(srtBody)

    fetch("/api/writeData", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(srtBody)
    })
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => {
        console.error("error", error)
      });
  }

  const writeAss = () => {
    if (subtitleSegments) {
      const ass = toAss(subtitleSegments);
      console.log(ass);

      const assName = curJsonName.split(".")[0] + ".ass";

      const srtBody = {
        "name": assName,
        "data": ass
      }

      fetch("/api/writeData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(srtBody)
      })
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => {
          console.error("error", error)
        });
    }
  }

  const handleTranslate = async () => {
    if (!subtitleSegments) return;

    const segments = subtitleSegments.segments;
    const translatedSegments = subtitleSegments.translatedSegments;
    const length = segments.length;

    const step = 20;
    for (var i = 0; i < length; i = i + step) {
      const ss = segments.slice(i, (i + step < length) ? i + step : length);
      const englishSlice = ss.map(segment => segment.text);

      let resArr: TranslatedSement[] | undefined;

      while (true) {
        await fetch("/api/translate", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(englishSlice)
        })
          .then(response => response.json())
          .then(result => {
            resArr = JSON.parse(result["choices"][0]["message"]["content"]);
          })
          .catch(error => {
            console.error("error", error)
          });

        if (resArr) {
          console.log(resArr);
          if (resArr.length != englishSlice.length) {
            continue;
          }
          translatedSegments.splice(i, 0, ...resArr);
          subtitleSegments.setTranslatedValues(resArr, i);
          resetCurWordIndex();
          break;
        }
      }
      // break;
    }
  }

  const handleClearTranslated = async () => {
    if (subtitleSegments) {
      subtitleSegments.translatedSegments = []
      resetCurWordIndex()
    }
  }

  const handleTest = async () => {
    await fetch("/api/test", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        const resArr = JSON.parse(result["decoder"]["chunks"][0]);
        console.log(resArr);
      })
      .catch(error => {
        console.error("error", error)
      });

  }

  return (
    <>
      <div className="flex flex-col fixed right-1 bg-white ">
        <div>{"当前的节点是:" + subtitleSegments?.segments[curWordIndexS].words[curWordIndexW].word}</div>
        <button onClick={handleMergeSegment}>合并</button>
        <button onClick={handleSplitSegment}>拆分</button>
        <button onClick={handleRemoveWord}>删除</button>
      </div>
      <div className="flex flex-col fixed top-1/4 right-5 bg-blue-200">
        <button onClick={handleTranslate} className="bg-red-300">翻译</button>
        <button onClick={handleTest}>Test</button>
        <button onClick={handleSave}>保存</button>
        <button onClick={handleClearTranslated}>清理</button>
      </div>
    </>
  )

}