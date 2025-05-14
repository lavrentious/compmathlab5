export type Point = {
  x: string; // float as string
  y: string; // float as string
};

export enum InterpolationMethod {
  LAGRANGE = "LAGRANGE",
  NEWTON_DIVIDED_DIFFERENCES = "NEWTON_DIVIDED_DIFFERENCES",
  NEWTON_FINITE_DIFFERENCES = "NEWTON_FINITE_DIFFERENCES",
}
