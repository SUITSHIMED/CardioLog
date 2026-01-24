/* eslint-env jest */
import { getBPStatus } from "../src/utils/healthLogic";

test("getBPStatus returns a result", () => {
  const result = getBPStatus(120, 80);
  expect(result).toBeDefined();
});
