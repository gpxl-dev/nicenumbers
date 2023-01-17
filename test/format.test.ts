import { describe, expect, test } from "@jest/globals";
import { format, NiceNumberOptions } from "../src";

describe("Format function", () => {
  const testTable: [
    string | number | undefined,
    NiceNumberOptions | undefined,
    string | undefined
  ][] = [
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
      "0",
    ],
    [
      0.000020680147102110222,
      {
        tokenDecimals: 0,
        significantFigures: 2,
        minimum: 0.01,
        omitLeadingZero: false,
      },
      "<0.01",
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
      "17",
      {
        tokenDecimals: 1,
        significantFigures: 5,
        omitTrailingZeroes: true,
        minDecimalPlaces: 2,
      },
      "1.70",
    ],
    [
      "16234.0123",
      {
        tokenDecimals: 1,
        significantFigures: 2,
        omitTrailingZeroes: true,
        minDecimalPlaces: 2,
        useSymbols: false,
        addCommas: true,
      },
      "16,234.01",
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
    [
      15.997758317180917,
      {
        minimum: 0.01,
        tokenDecimals: 0,
        significantFigures: 3,
        addCommas: true,
        useSymbols: false,
      },
      "16.0",
    ],
    [
      0.31006111129761954,
      {
        tokenDecimals: 0,
        significantFigures: 3,
        omitLeadingZero: true,
      },
      ".310",
    ],
    [
      97292739,
      {
        significantFigures: 3,
        tokenDecimals: 9,
        maxDecimalPlaces: 3,
        omitLeadingZero: true,
      },
      ".097",
    ],
    [
      -97292739,
      {
        significantFigures: 3,
        tokenDecimals: 9,
        maxDecimalPlaces: 3,
        omitLeadingZero: true,
      },
      "-.097",
    ],
    [
      3341032671,
      {
        tokenDecimals: 9,
        minDecimalPlaces: 2,
        maxDecimalPlaces: 2,
      },
      "3.34",
    ],
    [
      undefined,
      {
        tokenDecimals: 9,
        minDecimalPlaces: 2,
        maxDecimalPlaces: 2,
      },
      "",
    ],
    [
      "0",
      {
        addCommas: true,
        omitLeadingZero: true,
        minDecimalPlaces: 3,
      },
      ".000",
    ],
    [
      6591.279076379999,
      {
        tokenDecimals: 0,
        addCommas: true,
        maxDecimalPlaces: 2,
        minDecimalPlaces: 2,
        useSymbols: false,
      },
      "6,591.28",
    ],
    [
      6624.765676259999,
      {
        tokenDecimals: 0,
        addCommas: true,
        maxDecimalPlaces: 2,
        minDecimalPlaces: 2,
        useSymbols: false,
      },
      "6,624.77",
    ],
  ];

  test.each(testTable)(
    "%s with options %j should be %s",
    (input, options, expected) => {
      expect(format(input, options)).toBe(expected);
    }
  );
});
