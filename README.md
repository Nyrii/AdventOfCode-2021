# AdventOfCode-2021

Pre-requisites:
- Have [Node](https://nodejs.org/en/download/) installed.
- While the inputs of each days are provided in the `resources` folder, they are actually unused.
Instead, we directly pull the input contents from AOC. Therefore, a `TOKEN` needs to be provided in 
the `.env` file. The token can be retrieved directly from the [Advent Of Code](https://adventofcode.com/)
website when requesting the input e.g `https://adventofcode.com/2021/day/{dayNumber}/input`.

Once done:
- Run `yarn install`.
- From the root directory, run the file related to an AOC day e.g. `tsc && node target/days/day04.js`. Alternatively, `ts-node src/days/day04.ts` would also work (however, the dependency has not been added to the `package.json`).
