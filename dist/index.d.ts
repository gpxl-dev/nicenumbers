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
    /**
     * String to return if input equals zero
     */
    zeroResult?: string;
};
export declare const format: (input: any, { omitLeadingZero, tokenDecimals, significantFigures, omitTrailingZeroes, useSymbols, addCommas, minimum, minDecimalPlaces, maxDecimalPlaces, zeroResult, }?: NiceNumberOptions) => string;
