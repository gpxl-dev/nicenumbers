export type NiceNumberOptions = {
  /**
   * If set to true, will omit the leading zero for numbers less than 0,
   * e.g. `0.1` -> `.1`.
   *
   * **Default: `false`**
   */
  omitLeadingZero?: boolean;
  /**
   * When formatting an ERC20 token amount, this is the number of `decimals`
   * that token has.
   *
   * **Default: `18`**
   */
  tokenDecimals?: number;
  /**
   * Number of significant figures to show. Will correctly round where
   * appropriate.
   *
   * **Default: `4`**
   */
  significantFigures?: number;
  /**
   * Omits trailing zeroes if the number of significant figures is more than
   * the sig figs that exist, e.g. 1.23000 -> 1.23
   *
   * > Note: If you set `useSymbols` to false, this will show the full number
   * of significant figures up to the decimal point.
   *
   * > Note: Will be overridden by `minDecimalPlaces` when `minDecimalPlaces`
   * would result in a higer number of significant figures.
   *
   * **Default: `false`**
   */
  omitTrailingZeroes?: boolean;
  /**
   * Uses symbols for large numbers, e.g. 12345 -> 12.345k. Best used
   * with smaller numbers of significant figures.
   *
   * > Note: `addCommas` has no effect if using symbols.
   *
   * **Default: `true`**
   */
  useSymbols?: boolean;
  /**
   * If set to true, commifies output, i.e. 12345.6789 -> 12,345.6789
   *
   * > Note: Has no effect if `useSymbols` is `true`
   *
   * **Default: `false`**
   */
  addCommas?: boolean;
  /**
   * Number representing the minimum decimal amount to show. You should supply
   * a decimal number, e.g. `0.01`. When this is set, if the result is lower
   * than the value provided the result will be: `<${minimum}` **unless** the
   * value passed is zero - in this case zero will be shown explicitly.
   *
   * Passing null means there's no minimum amount shown. Note in this case,
   * you can get some very long strings despite a low number of significant
   * figures when displaying numbers for tokens with a large number of decimals
   *
   * **Default: `null`**
   */
  minimum?: number | null;
  /**
   * The minimum number of decimal places to show. Does not work with
   * `useSymbols`, and will override `significantFigures` when that would
   * result in fewer decimals.
   *
   * > Note: Will prevent `useSymbols` from working.
   */
  minDecimalPlaces?: number;
  /**
   * The maximum number of decimal places to show. Will override
   * `significantFigures` when that would result in more decimals.
   */
  maxDecimalPlaces?: number;
};

export const format = (
  input: any,
  {
    omitLeadingZero = false,
    tokenDecimals = 18,
    significantFigures = 4,
    omitTrailingZeroes = false,
    useSymbols = true,
    addCommas = false,
    minimum = null,
    minDecimalPlaces = 0,
    maxDecimalPlaces = Infinity,
  }: NiceNumberOptions = {}
) => {
  if (input === undefined) return "";
  let _inputString = typeof input === "string" ? input : input.toString();

  // If using something like bignumber.js sometimes .toString() returns
  // exponential notation, so try toFixed for safety.
  try {
    if (typeof input === "object") _inputString = input.toFixed(0);
  } catch (e) {
    // nm.
  }
  const isNegative = _inputString.startsWith("-");
  if (isNegative) _inputString = _inputString.substring(1);
  // Split into an array of digits.
  const inputArray = _inputString.padStart(tokenDecimals, "0").split("");
  // Splice in the decimal point
  if (tokenDecimals !== 0) {
    inputArray.splice(tokenDecimals * -1, 0, ".");
  } else {
    // Subsequent code expects a decimal point.
    inputArray.push(".");
  }

  // This is our significant figure counter.
  let sigFigs = 0;
  let decimalPlaces = 0;
  let haveSeenDecimalPoint = false;

  const outArray: string[] = [];
  const indexOfDecimal = inputArray.indexOf(".");
  const _sigFigs = useSymbols
    ? significantFigures
    : Math.max(indexOfDecimal, significantFigures);

  for (let i = 0; i < inputArray.length; i++) {
    const char = inputArray[i];
    if (
      (sigFigs < _sigFigs && decimalPlaces < maxDecimalPlaces) ||
      decimalPlaces < minDecimalPlaces
    ) {
      // Always ignore decimals, and ignore 0s if we still haven't found our
      // first sig fig.
      if (char !== ".") {
        if (haveSeenDecimalPoint) decimalPlaces++;
        if (sigFigs > 0 || char !== "0") sigFigs++;
      }

      // record if we've seen the dp.
      if (char === ".") haveSeenDecimalPoint = true;

      let shouldRoundUp = false;

      // Round up check.
      if (sigFigs === _sigFigs) {
        for (let r = i + 1; r < inputArray.length; r++) {
          const char = inputArray[r];
          if (char === "." || char === "5") continue;
          if (parseInt(char) > 5) {
            shouldRoundUp = true;
          } else {
            shouldRoundUp = false;
          }
          break;
        }
      }
      if (!shouldRoundUp) {
        outArray.push(char);
      } else {
        // If we need to round up, we need to bump 9s to 0 and increase the next
        // non-9
        if (char !== "9") {
          outArray.push((parseInt(char) + 1).toString());
        } else {
          outArray.push("0");
          for (let j = outArray.length - 2; j >= 0; j--) {
            const char = outArray[j];
            if (char === ".") continue;
            if (char === "9") {
              outArray[j] = "0";
            } else {
              outArray[j] = (parseInt(outArray[j]) + 1).toString();
              break;
            }
            if (j === 0) outArray.unshift("1");
          }
        }
      }
    } else {
      // Add trailing zeroes if required.
      const insigFigsBeforeDecimal = indexOfDecimal - i;
      const trailingZeros = insigFigsBeforeDecimal;
      for (let j = 0; j < trailingZeros; j++) outArray.push("0");
      break;
    }
  }
  // Add leading zero if necessary
  if (outArray[0] === "." && !omitLeadingZero) outArray.unshift("0");

  // Add trailing zeros where necessary
  if (decimalPlaces < minDecimalPlaces) {
    const zerosNeeded = minDecimalPlaces - decimalPlaces;
    if (!haveSeenDecimalPoint && outArray[outArray.length - 1] !== ".")
      outArray.push(".");
    for (let i = 0; i < zerosNeeded; i++) {
      outArray.push("0");
    }
  }

  let result = outArray.join("");

  if (omitLeadingZero && result.startsWith("0.")) result = result.substring(1);

  // If we have a decimal, we may need to add some trailing zeroes if there
  // aren't enough significant figures.
  if (!omitTrailingZeroes && result.indexOf(".") !== -1) {
    const trailingZeroesNeeded = Math.min(
      maxDecimalPlaces - decimalPlaces,
      _sigFigs - (result.length - 1)
    );
    if (trailingZeroesNeeded > 0) {
      for (let j = 0; j < trailingZeroesNeeded; j++) result += "0";
    }
  }

  try {
    if (minimum) {
      const _result = parseFloat(result);
      if (_result === 0) {
        result = result.slice(
          0,
          omitLeadingZero ? significantFigures + 1 : significantFigures + 2
        );
        if (isNegative) result = `-${result}`;
        return result;
      }
      let _minStr = minimum.toString();
      if (omitLeadingZero && minimum < 1) {
        try {
          _minStr = "." + minimum.toString().split(".")[1];
        } catch (e) {
          // meh, you've provided a weird value (probably negative)
        }
      }
      if (minimum > _result) return `<${_minStr}`;
    }
  } catch (e) {}
  if (isNegative) result = `-${result}`;
  if (useSymbols) {
    return toSymbolNotation(result);
  } else if (addCommas) {
    return addCommasToString(result);
  } else {
    return result;
  }
};

const symbols = [
  { n: 9, symbol: "B" },
  { n: 6, symbol: "M" },
  { n: 3, symbol: "k" },
];

const addCommasToString = (input: string) => {
  const indexOfDecimal = input.indexOf(".");
  if (indexOfDecimal !== -1 && indexOfDecimal < 5) return input;
  if (indexOfDecimal == -1 && input.length < 4) return input;
  const [beforeDecimal, afterDecimal] = input.split(".");
  const beforeDecimalArray = beforeDecimal.split("");
  const beforeDecimalOutput: string[] = [];

  for (let i = 0; i <= beforeDecimal.length; i++) {
    beforeDecimalOutput.unshift(beforeDecimalArray[beforeDecimal.length - i]);
    if (i !== 0 && i !== beforeDecimal.length && i % 3 === 0) {
      beforeDecimalOutput.unshift(",");
    }
  }
  return beforeDecimalOutput
    .join("")
    .concat(afterDecimal ? `.${afterDecimal}` : "");
};

const toSymbolNotation = (input: string) => {
  const indexOfDecimal = input.indexOf(".");
  if (indexOfDecimal !== -1 || input.length <= 3) return input;
  for (let i = 0; i < symbols.length; i++) {
    const { n, symbol } = symbols[i];
    if (input.length <= n) continue;
    const inputArray = input.split("");
    inputArray.splice(n * -1, 0, ".");
    let onlyZerosSoFar = true;
    const outArray = [];
    for (let j = inputArray.length - 1; j >= 0; j--) {
      const char = inputArray[j];
      if (onlyZerosSoFar && (char === "0" || char === ".")) {
        continue;
      }
      onlyZerosSoFar = false;
      outArray.unshift(char);
    }
    outArray.push(symbol);
    return outArray.join("");
  }
  return input;
};
