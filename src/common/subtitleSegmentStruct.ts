
export interface Segment {
  start: number;
  end: number;
  text: string;
  translated: string;
  words: SegmentWord[]
}

export interface SegmentWord {
  word: string;
  start: number;
  end: number;
  score: number;
}

export interface TranslatedSement {
  first: string,
  second: string,
}

export class SubtitleSegments {
  segments: Segment[];
  translatedSegments: TranslatedSement[];

  constructor(json: string) {
    const ss = JSON.parse(json) as SubtitleSegments;
    this.segments = ss.segments;
    this.translatedSegments = ss.translatedSegments ? ss.translatedSegments : new Array();
  }

  merge(segmentIndex: number, wordIndex: number) {
    if (segmentIndex == 0) return;

    const segments = this.segments;
    const words = segments[segmentIndex].words;
    const subWords = words.slice(0, wordIndex + 1);

    // cur segment remove words
    words.splice(0, wordIndex + 1);
    this.rebuildSegment(segmentIndex);

    // remove cur segment when it's empty 
    if (words.length == 0) {
      segments.splice(segmentIndex, 1);
    }

    // pre segment add new words
    const preSegment = segments[segmentIndex - 1];
    preSegment.words.push(...subWords);
    this.rebuildSegment(segmentIndex - 1);

  }

  private rebuildSegment(segmentIndex: number) {
    const segment = this.segments[segmentIndex];
    const words = segment.words;


    segment.text = words.map(w => w.word).join(" ");
    if (words.length > 0) {
      segment.start = words[0].start;
      segment.end = words[words.length - 1].end + this.getDelay(segmentIndex);
    }
  }

  // when delay
  private getDelay(segmentIndex: number) {
    const len = this.segments.length;

    const curLen = this.segments[segmentIndex].words.length;
    const curEndWord = this.segments[segmentIndex].words[curLen - 1];

    let delay = 0.8;
    if (segmentIndex + 1 < len) {
      const nextStartWord = this.segments[segmentIndex + 1].words[0];
      const gap = nextStartWord.start - curEndWord.end;
      if (gap > 0) {
        delay = gap < delay ? gap : delay;
      }
    }
    return delay;
  }

  private addSegmentFromWords(segmentIndex: number, words: SegmentWord[]) {
    if (words.length == 0) return;
    const newSegment = {
      words: words,
      start: words[0].start,
      end: words[words.length - 1].end,
      text: words.map(w => w.word).join(" "),
      translated: ""
    };
    this.segments.splice(segmentIndex, 0, newSegment);

    newSegment.end += this.getDelay(segmentIndex);
  }

  split(segmentIndex: number, wordIndex: number) {
    const segments = this.segments;
    const words = segments[segmentIndex].words;
    if (wordIndex == words.length - 1) {
      return;
    }

    const subWords = words.slice(0, wordIndex + 1);

    // remove word from cur segment
    words.splice(0, wordIndex + 1);
    this.rebuildSegment(segmentIndex);

    // add new segment
    this.addSegmentFromWords(segmentIndex, subWords);
  }

  removeNode(segmentIndex: number, wordIndex: number) {
    const segments = this.segments;
    const words = segments[segmentIndex].words;

    // remove word node
    words.splice(wordIndex, 1);
    this.rebuildSegment(segmentIndex);

    // remove cur segment when it's empty 
    if (words.length == 0) {
      segments.splice(segmentIndex, 1);
    }
    return this;
  }

  setTranslatedValues(translatedSegments: TranslatedSement[], start: number) {
    for (let i = 0; i < translatedSegments.length; i++) {
      this.segments[start + i].translated = translatedSegments[i].second;
    }
  }
}

