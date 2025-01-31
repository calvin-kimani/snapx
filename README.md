# Snapx

[![npm version](https://img.shields.io/npm/v/@snapx/core)](https://www.npmjs.com/package/@snapx/core)
[![License](https://img.shields.io/npm/l/@snapx/core)](https://github.com/calvin-kimani/snapx/blob/main/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/calvin-kimani/snapx/build.yml)](https://github.com/calvin-kimani/snapx/actions)

Snapx is a modular framework built with **Bun**, designed to help developers build scalable and maintainable applications. It provides reusable packages for dependency injection, email services and more.

---

## Table of Contents

- [Features](#features)
- [Packages](#packages)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Modular Architecture**: Use scoped packages (e.g., `@snapx/core`, `@snapx/mail`) to organize functionality.
- **Dependency Injection**: Built-in container and service provider system for managing dependencies.
- **Scalability**: Easily extendable with custom service providers.
- **Performance**: Optimized for speed using Bun as the runtime.
- **TypeScript Support**: Fully typed for enhanced developer experience.

---

## Packages

Snapx consists of multiple scoped packages, each serving a specific purpose:

| Package Name       | Description                                      | npm Link                                   |
|--------------------|--------------------------------------------------|--------------------------------------------|
| [@snapx/core](https://www.npmjs.com/package/@snapx/core) | Core functionality, including the service container and provider architecture. | [`@snapx/core`](https://www.npmjs.com/package/@snapx/core) |
| [@snapx/mail](https://www.npmjs.com/package/@snapx/mail) | Email service provider for sending emails.      | [`@snapx/mail`](https://www.npmjs.com/package/@snapx/mail) |

---

## Installation

Install the required packages using your preferred package manager:

```bash
# Install the core package
bun add @snapx/core

# Install additional packages (optional)
bun add @snapx/mail
```

## Usage
1. Bootstrap the Application
Create an entry point for your application (e.g., index.ts) and bootstrap the framework:

```ts
import { App } from '@snapx/core';

async function main() {
    const app = new App();

    try {
        // Specify the relative path to the providers file
        await app.boot();
    } catch (error) {
        console.error('Failed to bootstrap application:', error);
    }
}

main();
```

## 2. Define Service Providers
Create service providers in the **/root/app/providers/** directory. For example:

```ts
// /root/app/providers/EmailServiceProvider.ts
import { ServiceProvider } from '@snapx/core';
import { container } from '@snapx/core';
import { EmailService } from '../services/EmailService';

export class EmailServiceProvider extends ServiceProvider {
    constructor(container: typeof container) {
        super(container);
    }

    register(): void {
        this.container.bind('email', () => new EmailService());
    }

    boot(): void {
        console.log('Email service provider booted');
    }
}
```

## 3. Configure Providers
Define the list of providers in **/root/app/bootstrap/providers.ts**:

```ts
// app/bootstrap/providers.ts
export default [
    require('../providers/EmailServiceProvider').default,
    require('../providers/QueueServiceProvider').default,
];
```
## Contributing
We welcome contributions from the community! Here’s how you can get involved:

1. **Fork the Repository** : Fork the **Snapx repository** on GitHub.
2. Clone the Repository :
```bash
git clone https://github.com/yourusername/snapx.git
cd snapx
```

3. Install Dependencies :
```bash
bun install
```

4. Make Changes : Create a new branch for your changes:
```bash
git checkout -b feature/your-feature-name
```

5. Test Your Changes : Ensure all tests pass:
```bash
bun test
```

6. Submit a Pull Request : Push your branch and open a pull request on GitHub.

## License
Snapx is licensed under the MIT License. See the [License](LICENSE) file for details.

## Acknowledgments
* Built with ❤️ using [Bun](https://bun.sh/) .
* Inspired by modern frameworks like Laravel and NestJS.

## Contact
For questions or feedback, feel free to reach out:
* GitHub: @calvin-kimani
* Email: calvinkimani475@gmail.com
