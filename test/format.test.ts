import { describe, expect, test } from "@jest/globals";
import { format, NiceNumberOptions } from "../src";

describe("Format function", () => {
  const testTable: [string, NiceNumberOptions | undefined, string][] = [
    [
      "1234560000000000000",
      { tokenDecimals: 18, significantFigures: 3 },
      "1.23",
    ],
    ["1234560000000000000", { tokenDecimals: 18, significantFigures: 1 }, "1"],
    ["1234560000000000000", undefined, "1.235"],
    ["100000000", { tokenDecimals: 6, significantFigures: 1 }, "100"],
    ["10000000", { tokenDecimals: 6, significantFigures: 1 }, "10"],
    ["12360000", { tokenDecimals: 0, significantFigures: 3 }, "12.4M"],
    ["190000000", { tokenDecimals: 6, significantFigures: 1 }, "200"],
    ["199000000", { tokenDecimals: 6, significantFigures: 2 }, "200"],
    ["109100000", { tokenDecimals: 6, significantFigures: 3 }, "109"],
    ["999000000", { tokenDecimals: 6, significantFigures: 2 }, "1k"],
    ["127000", { tokenDecimals: 6, significantFigures: 2 }, "0.13"],
    [
      "12345000000",
      { tokenDecimals: 6, significantFigures: 3, useSymbols: true },
      "12.3k",
    ],
    [
      "12345000000",
      { tokenDecimals: 3, significantFigures: 3, useSymbols: true },
      "12.3M",
    ],
    [
      "123456789",
      { tokenDecimals: 12, significantFigures: 3, useSymbols: true },
      "0.000123",
    ],
    [
      "123456789",
      { tokenDecimals: 12, significantFigures: 3, omitLeadingZero: true },
      ".000123",
    ],
    [
      "123456789",
      {
        tokenDecimals: 12,
        significantFigures: 3,
        minimum: 0.01,
      },
      "<0.01",
    ],
    [
      "123456789",
      {
        tokenDecimals: 12,
        significantFigures: 3,
        minimum: 0.01,
        omitLeadingZero: true,
      },
      "<.01",
    ],
    [
      "0",
      {
        tokenDecimals: 12,
        significantFigures: 3,
        minimum: 0.01,
        omitLeadingZero: true,
      },
      ".000",
    ],
    [
      "0",
      {
        tokenDecimals: 12,
        significantFigures: 3,
        minimum: 0.01,
        omitLeadingZero: false,
      },
      "0.000",
    ],
    [
      "123456789",
      {
        tokenDecimals: 3,
        significantFigures: 6,
        useSymbols: false,
        addCommas: true,
      },
      "123,457",
    ],
    [
      "123456789",
      {
        tokenDecimals: 3,
        significantFigures: 8,
        useSymbols: false,
        addCommas: true,
      },
      "123,456.79",
    ],
    [
      "17",
      {
        tokenDecimals: 1,
        significantFigures: 5,
      },
      "1.7000",
    ],
    [
      "17",
      {
        tokenDecimals: 1,
        significantFigures: 5,
        omitTrailingZeroes: true,
      },
      "1.7",
    ],
    [
      "12345678000",
      {
        tokenDecimals: 6,
        significantFigures: 3,
        useSymbols: false,
        addCommas: true,
      },
      "12,346",
    ],
  ];

  test.each(testTable)(
    "%s with options %j should be %s",
    (input, options, expected) => {
      expect(format(input, options)).toBe(expected);
    }
  );
});
