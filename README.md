[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

# env-validate

A **type-safe, lightweight environment variable validator** for Node.js & TypeScript.  
Use it as a **CLI tool** or integrate it directly into your application to ensure all your `.env` variables are present and valid.

## 🚀 Features

- ✅ Type-safe schema validation (`string`, `number`, `boolean`, `enum`)
- ⚠️ Warns about optional environment variables
- ❌ Detects missing or incorrectly typed required variables
- 🧪 Works with `.env` files using `dotenv/config`
- 📦 Supports both **programmatic** and **CLI** usage
- 💡 Fully tested and bundler-ready (via `tsup`)
- 🧼 Clear logs with color-coded output

## ⬇️ Installation

Install env-validate with npm

```bash
md my-app
cd my-app
npm install env-validator
```

## 💿 Usage/Examples

```javascript
import { validateEnv } from 'env-validator';

const schema = {
  PORT: { type: 'number', required: true },
  NODE_ENV: { type: 'enum', required: true, values: ['development', 'production'] },
  DEBUG_MODE: { type: 'boolean', required: false },
};

const env = validateEnv(schema);
// Access env variables safely
console.log(env.PORT);
```

## 🖥️ CLI Usage

```bash
npx env-validator --schema ./env-schema.js
```

Your env-schema.js file should look like this:

```javascript
// env-schema.js
export const schema = {
  PORT: { type: 'number', required: true },
  NODE_ENV: { type: 'enum', required: true, values: ['development', 'production'] },
};
```

✅ CLI will log warnings, errors, and success messages to the terminal.

## 🧰 Functions/Methods

Usage and parameter list of all available functions

### `validateEnv()`

Builds a standardized error response object for APIs.

```javascript
import { validateEnv } from 'env-validator';

const schema = {
  PORT: { type: 'number', required: true },
  NODE_ENV: { type: 'enum', required: true, values: ['development', 'production'] },
  DEBUG_MODE: { type: 'boolean', required: false },
};

const env = validateEnv(schema);
// Access env variables safely
console.log(env.PORT);
```

| Parameter    | Type                                          | Required | Description                                                                 |
| ------------ | --------------------------------------------- | -------- | --------------------------------------------------------------------------- |
| **type**     | `'string'`, `'number'`, `'boolean'`, `'enum'` | `true`   | The expected data type of the environment variable.                         |
| **required** | `boolean`                                     | `true`   | Indicates whether the variable is mandatory. If `true`, it must be defined. |
| **values**   | `string[]`                                    | `false`  | A list of allowed values (used only when `type` is `'enum'`).               |

## 💡 Schema Types

Each variable must be declared with:

```javascript
type: 'string' | 'number' | 'boolean' | 'enum'
required: true | false
values?: string[] // for enums only
```

## 🤝 Contribution

Contributions are welcome and appreciated!
If you have suggestions for improvements, feel free to open an issue or submit a pull request.
Let’s make bee-jokes better together! 🐝✨

## 🚀 Run Locally

Clone the project

```bash
git clone https://github.com/sandeep-shome/env-validate.git
```

Go to the project directory

```bash
cd env-validate
```

🔧 Install dependencies

```bash
npm install
```

_You can now explore and modify the package as per your needs._

📦 Build the Project

```bash
npm run build
```

## 🧪 Running Tests

Follow the steps below to run and verify the functionality of the CLI and validation logic.

### 1️⃣ Create a Temporary Schema Folder

Create a `temp/` folder at the root of the project:

```bash
md temp
```

### 2️⃣ Add a Temporary Schema File

Inside the temp folder, create a test-schema.js file:

```javascript
// temp/test-schema.js
export const schema = {
  TEST_ENV: { type: 'string', required: true },
  // Add more environment variables as needed
};
```

**⚠️ Note:** Ensure the schema matches any expectations in your CLI-related tests.

### 3️⃣ Run CLI in Dev Mode (Optional)

Test your CLI manually before running automated tests:

```bash
npm run build
node ./dist/bin/cli.js --schema ./temp/test-schema.js
```

### 4️⃣ Run the Test Suite

Execute the full test suite using:

```bash
npm run test
```

## 🔧 Built With

- [**TypeScript**](https://www.typescriptlang.org/) – Strongly typed language for scalable JavaScript development
- [**Commander**](https://www.npmjs.com/package/commander) – Elegant and flexible CLI framework
- [**Vitest**](https://vitest.dev/) – Fast unit testing framework with great DX
- [**tsup**](https://tsup.egoist.dev/) – Super-fast TypeScript bundler powered by esbuild

## 📎Appendix

env-validate is an open-source project developed and maintained by a solo developer with a passion for clean code, creativity, and community-driven tools.

You're welcome to explore, use, and contribute to the project! Whether it's fixing a bug, suggesting a feature, or improving the documentation — your contributions are highly appreciated.

Feel free to check out the GitHub repository and join in making this project better for everyone. Let's build something fun together! 💡

## 👨‍💻 Authors

[@Sandeep Shome](https://github.com/sandeep-shome)

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)

## 🙋‍♂️ Support

For support, email sandeepshome.dev@gmail.com
