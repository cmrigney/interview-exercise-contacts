# Truly Exercise

Exercise for Truly interview.

Project structure:

 * `src` - Contains app code. TypeScript and SASS.
 * `public` - Contains static files for app such as `index.html`
 * `__tests__` - Contains tests for app components.
 * `__mocks__` - Contains mocks used by tests.
 * `.vscode` - Meta project files, used by VS Code.

## Build and Run

Install the latest [LTS version of Node.js](https://nodejs.org/en/download/).  Then update npm to be sure you have npx.

```
npm install -g npm
```

Then install the dependencies of this project.

```
npm install
```

Now to build the project.

```
npm run build
```

The build outputs into the `dist` directory.

Now to run the server.

```
npm start
```

Once that starts you can browse to http://localhost:3000

## Tests

The tests use jest. Running the tests is simple.

```
npm test
```

Enjoy!
