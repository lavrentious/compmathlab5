import { all, create } from "mathjs";

export const configuredMath = create(all, {
  number: "BigNumber",
  precision: 32,
});
