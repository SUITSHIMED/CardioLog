/* eslint-env jest */
import { generateCardioReportHTML } from "../src/utils/pdf/cardioReportTemplate";

test("PDF template generates HTML", () => {
  const html = generateCardioReportHTML({
    readings: [],
    unit: "mmHg",
  });

  expect(typeof html).toBe("string");
  expect(html).toHaveLength(html.length > 0 ? html.length : 1);
});
