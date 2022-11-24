## `nicenumbers`

A small utility library to make displaying crpytocurrency token amounts in UIs a bit less painful.

No dependencies.

### Motivation

Most web3 frontends display ERC20 token amounts. The fact that it's commonplace for ERC20s to have 18 decimals, and also that it's not uncommon for a user to hold billions of one token and tiny fractions of another means UIs have to deal with the possibility of showing numbers across a huge range.

This can be a design challenge, with the space required to token amounts varying drastically.

This library attempts to address this challenge and make our lives a little easier.

Note that this library doesn't claim to be super efficient or well written, but should only be used for presentation anyway so doesn't really need to be!

### Examples

```typescript
import { format } from "@greypixel_/nicenumbers";

// If using ethers, this returns a bigNumber
const tokenAmount = someErc20Contract.balanceOf(user);

// Sensible defaults, accepts ethers bigNumbers
format(tokenAmount); // 123.46k

// Specify token decimals and significant figures
format("12345678", {
  tokenDecimals: 6,
  significantFigures: 3,
}); // 12.3

// Don't use symbols (B, M, k), do use commas:
format("12345678000", {
  tokenDecimals: 6,
  significantFigures: 3,
  useSymbols: false,
  addCommas: true,
}); // 12,346
```

### Installation

```
yarn add `@greypixel_/nicenumbers`
```

## `format`

`format` is a function that accepts a string representation of a `BigNumber` or anything else that will either `toFixed(0)` or `toString()` to a string representation of a bignumber, and returns a nicely formatted string that can be used in the UI.

It optionally accepts an `options` object as outlined below.

### Configuration options

_All configuration options are optional, but using `tokenDecimals` at least is strongly recommended._

#### `omitLeadingZero` - `boolean` (default: `false`)

If set to true, will omit the leading zero for numbers less than 0, i.e. instead of `0.1` you'll get `.1`

#### `tokenDecimals` - `number` (default: `18`)

When formatting an ERC20 token amount, this is the number of decimals that token has.

#### `significantFigures` - `number` (default: `4`)

Number of significant figures to show. Will correctly round where appropriate. Note that all significant figures before the decimal point will be shown if `useSymbols` is set to `false` as the resultant number will be the same number of digits anyway in this case.

#### `omitTrailingZeroes` - `boolean` (default: `false`)

Omits trailing zeroes if the number of significant figures is more than the sig figs that exist, e.g. `"1.23000"` becomes `"1.23"`

> **Note**: If you set useSymbols to false, this will show the full

#### `useSymbols` - `boolean` (default: `true`)

Uses symbols for large numbers, e.g. 12345 -> 12.345k. Best used with smaller numbers of significant figures.

Symbols are: `B` for billion (10^9), `M` for million (10^6), and `k` for thousand (10^3).

> Note: `addCommas` has no effect if using symbols.

#### `addCommas` - `boolean` (default: `false`)

If set to `true`, commifies output, i.e. `"12345.6789"` becomes `"12,345.6789"`

> Note: Has no effect if useSymbols is true

#### `minimum` - `number | null` (default: `null`)

Pass a `number` representing the minimum decimal amount to show. You should supply a decimal number, e.g. `0.01`. When this is set, if the result is lower than the value provided the result will be: `"<0.01"`.

Passing `null` means there's no minimum amount, and the full value will be shown. Note in this case, you can get some very long strings despite a low number of significant figures when displaying very small fractions of tokens with a large number of decimals.

#### Contributing

fork, branch, `yarn`, write code, write tests, make PR.

All PRs welcome!
