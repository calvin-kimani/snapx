
# Snapx

[![npm version](https://img.shields.io/npm/v/@snapx/core)](https://www.npmjs.com/package/@snapx/core)
[![License](https://img.shields.io/npm/l/@snapx/core)](https://github.com/calvin-kimani/snapx/blob/main/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/calvin-kimani/snapx/build.yml)](https://github.com/calvin-kimani/snapx/actions)

Snapx is a modular framework built with **Bun**, designed to help developers build scalable and maintainable applications. It provides reusable packages for dependency injection, email services, and more.

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

- **Dependency Injection**: Manage and resolve dependencies with ease.
- **Service Providers**: Register and boot services in a modular way.
- **TypeScript Support**: Fully typed for a better developer experience.
- **Flexible Configuration**: Load providers dynamically from a configuration file.
- **Singleton, Transient, and Contextual Bindings**: Register services with different lifetimes and contexts.

---

## Packages

Snapx consists of multiple scoped packages, each serving a specific purpose:

| Package Name       | Description                                      | npm Link                                   | README Link                                            |
|--------------------|--------------------------------------------------|--------------------------------------------|--------------------------------------------------------|
| [@snapx/core](https://www.npmjs.com/package/@snapx/core) | Core functionality, including the service container and provider architecture. | [`@snapx/core`](https://www.npmjs.com/package/@snapx/core) | [@snapx/core README](https://github.com/calvin-kimani/snapx/blob/main/packages/core/README.md) |

---

## Installation

Install the required packages using your preferred package manager:

```bash
# Install the core package
bun add @snapx/core

# Install additional packages (optional)
bun add @snapx/mail
```

---

## Usage

For detailed usage instructions, check the README files of each package:

- [@snapx/core README](https://github.com/calvin-kimani/snapx/blob/main/packages/core/README.md)

---

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

---

## License

Snapx is licensed under the MIT License. See the [License](LICENSE) file for details.

---

## Acknowledgments

* Built with ❤️ using [Bun](https://bun.sh/).
* Inspired by modern frameworks like Laravel and NestJS.

---

## Contact

For questions or feedback, feel free to reach out:
* GitHub: @calvin-kimani
* Email: calvinkimani475@gmail.com
