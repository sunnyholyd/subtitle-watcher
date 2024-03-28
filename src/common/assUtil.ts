import { parse, stringify, compile, decompile, ParsedASS, ScriptInfo, ParsedASSStyles, ParsedASSEvent, ParsedASSEvents, Dialogue } from 'ass-compiler';
import { srtToAss } from '@almanime/srt-to-ass';
import { SegmentWord, SubtitleSegments } from './subtitleSegmentStruct';

export function srt2ass(srtText: string): string {
  const ass = srtToAss(srtText);
  const parsedAss = parse(ass);
  parsedAss.info.WrapStyle = '1';
  parsedAss.info.WrapStyle = '1';
  const defultStyle = parsedAss.styles.style.pop();

  // handle styles
  if (defultStyle) {
    const chineseStyle = { ...defultStyle }
    chineseStyle.Name = 'Chinese'
    chineseStyle.Fontsize = '21.0'
    chineseStyle.Outline = '1.2'
    chineseStyle.Shadow = '0.1'
    chineseStyle.PrimaryColour = '&H0099FFFF'
    const englishStyle = { ...defultStyle }
    englishStyle.Name = 'English'
    englishStyle.Fontsize = '11.0'
    englishStyle.Outline = '0.9'
    englishStyle.Shadow = '0.1'

    parsedAss.styles.style.push(chineseStyle);
    parsedAss.styles.style.push(englishStyle);
  }

  const dialogues = [];
  for (const d of parsedAss.events.dialogue) {
    if (d.Text.raw == "") continue;
    const chineseDialogue = { ...d }
    const englishDialogue = { ...d }
    const subLine = d.Text.raw.split("\\N")
    chineseDialogue.Text = { parsed: [{ text: subLine[0], drawing: [], tags: [] }], raw: "", combined: "" }
    englishDialogue.Text = { parsed: [{ text: subLine[1], drawing: [], tags: [] }], raw: "", combined: "" }

    chineseDialogue.Style = 'Chinese'
    englishDialogue.Style = 'English'

    dialogues.push(englishDialogue)
    dialogues.push(chineseDialogue)
  }
  parsedAss.events.dialogue = dialogues

  console.log(parsedAss);

  return stringify(parsedAss);
}

export function toParsedAss(subtitleSegments: SubtitleSegments): ParsedASS {
  const defaultParsedAss = getDefaultParsedAss();
  subtitleSegments.segments.map(s => {
    // add chinese event
    const chineseDialogue = getDefaultDialogue();
    chineseDialogue.Start = s.start;
    chineseDialogue.End = s.end;
    chineseDialogue.Text.parsed[0].text = splitChineseline(s.translated);
    chineseDialogue.Style = "Chinese";
    defaultParsedAss.events.dialogue.push(chineseDialogue);

    // add english events
    for (const ws of splitEnglishWords(s.words)) {
      const englishDialogue = getDefaultDialogue();
      const startTime = ws[0].start;
      englishDialogue.Start = startTime ? startTime : s.start;
      const endTime = ws[ws.length - 1].end;
      englishDialogue.End = (endTime) ? endTime : s.end;
      englishDialogue.Text.parsed[0].text = ws.map(w => w.word).join(" ");
      defaultParsedAss.events.dialogue.push(englishDialogue);
    }
  })

  console.log(defaultParsedAss)
  return defaultParsedAss;
}

export function toAss(subtitleSegments: SubtitleSegments): String {
  return stringify(toParsedAss(subtitleSegments));
}

function splitEnglishWords(words: SegmentWord[], splitLen: number = 14): SegmentWord[][] {
  const arr: SegmentWord[][] = [];
  let start: number = 0;
  while (start < words.length) {
    arr.push(words.slice(start, start + splitLen))
    start += splitLen;
  }
  return arr;
}

function splitChineseline(line: string, splitLen: number = 24): string {
  if (line && line.length > splitLen + 3) {
    const firstCommaPosition = line.indexOf('，', splitLen / 3);
    if (firstCommaPosition > -1 && firstCommaPosition < splitLen + 4) {
      return line.slice(0, firstCommaPosition + 1) + '\\N' + splitChineseline(line.slice(firstCommaPosition + 1), splitLen);
    } else {
      return line.slice(0, splitLen) + '\\N' + splitChineseline(line.slice(splitLen), splitLen);
    }
  } else {
    return line;
  }
}

function getDefaultParsedAss(): ParsedASS {
  const info: ScriptInfo = {
    Title: "",
    WrapStyle: '1',
    PlayResX: '', 
    PlayResY: '',
    ScriptType: 'v4.00+',
    ScaledBorderAndShadow: 'yes',
    Collisions: 'Normal'
  }

  const styles: ParsedASSStyles = {
    format: [
      "Name",
      "Fontname",
      "Fontsize",
      "PrimaryColour",
      "SecondaryColour",
      "OutlineColour",
      "BackColour",
      "Bold",
      "Italic",
      "Underline",
      "StrikeOut",
      "ScaleX",
      "ScaleY",
      "Spacing",
      "Angle",
      "BorderStyle",
      "Outline",
      "Shadow",
      "Alignment",
      "MarginL",
      "MarginR",
      "MarginV",
      "Encoding"
    ],
    style: [
      {
        Name: "Chinese",
        Fontname: "Arial",
        Fontsize: "23.0",
        PrimaryColour: "&H0099FFFF",
        SecondaryColour: "&H000000FF",
        OutlineColour: "&H00000000",
        BackColour: "&H00000000",
        Bold: "0",
        Italic: "0",
        Underline: "0",
        StrikeOut: "0",
        ScaleX: "100",
        ScaleY: "100",
        Spacing: "0",
        Angle: "0",
        BorderStyle: "1",
        Outline: "2",
        Shadow: "0",
        Alignment: "2",
        MarginL: "10",
        MarginR: "10",
        MarginV: "20",
        Encoding: "1"
      },
      {
        Name: "English",
        Fontname: "Arial",
        Fontsize: "12.0",
        PrimaryColour: "&H00FFFFFF",
        SecondaryColour: "&H000000FF",
        OutlineColour: "&H00000000",
        BackColour: "&H00000000",
        Bold: "0",
        Italic: "0",
        Underline: "0",
        StrikeOut: "0",
        ScaleX: "100",
        ScaleY: "100",
        Spacing: "0",
        Angle: "0",
        BorderStyle: "1",
        Outline: "1",
        Shadow: "0",
        Alignment: "2",
        MarginL: "10",
        MarginR: "10",
        MarginV: "5",
        Encoding: "1"
      }
    ]
  };

  const events: ParsedASSEvents = {
    format: [
      "Layer",
      "Start",
      "End",
      "Style",
      "Name",
      "MarginL",
      "MarginR",
      "MarginV",
      "Effect",
      "Text"
    ],
    comment: [],
    dialogue: []
  }

  return { info: info, styles: styles, events: events };
}

function getDefaultDialogue(): ParsedASSEvent {
  return {
    Layer: 0,
    Start: 0,
    End: 0,
    Style: "English",
    Name: "",
    MarginL: 0,
    MarginR: 0,
    MarginV: 0,
    Effect: undefined,
    Text: {
      parsed: [
        {
          text: "",
          drawing: [],
          tags: []
        }],
      raw: "",
      combined: ""
    }
  }
}
