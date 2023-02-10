import { fmt } from "@/utilities/fmt";
import { isOdd } from "@/utilities/isOdd";
import { chunk } from "lodash";
import { v4 as uuid } from "uuid";

export interface IRecord {
  id: string;
  at: number
}

export const Record = {
  at(at: number): IRecord {
    return {
      id: uuid(),
      at
    }
  },
  elapsed(timeline: IRecord[]): string {
    const pairs = isOdd(timeline.length) ? [...timeline, Record.at(Date.now())] : [...timeline];

    const total = chunk(pairs, 2)
      .reduce((acc, [start, end]) => {
        return acc + (end.at - start.at)
      }, 0)

    return fmt(total)
  }
}
