import { Point } from "../types";

export function xsYsToPoints(xs: string[], ys: string[]): Point[] {
  return xs.map((x, i) => ({ x, y: ys[i] }));
}
