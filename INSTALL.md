## Compilation Instructions

Make sure you have `node` and `yarn` installed on the local machine

Then:

```
yarn
./node_modules/.bin/vsce package
```

Now there should be a `llvm-ir-<version>.vsix` file present that can be installed via the menu option 'Install from VSIX' in the Extensions tab

## Running Tests

To run tests

```
yarn
yarn run test
```
