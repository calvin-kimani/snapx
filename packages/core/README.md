# @snapx/core

[![Version](https://img.shields.io/npm/v/@snapx/core.svg)](https://www.npmjs.com/package/@snapx/core)
[![License](https://img.shields.io/npm/l/@snapx/core)](https://github.com/calvin-kimani/snapx/blob/main/LICENSE)

A lightweight dependency injection container and service provider architecture inspired by Laravel, designed for modern JavaScript and TypeScript applications.

---

## Features

- **Dependency Injection**: Manage and resolve dependencies with ease.
- **Service Providers**: Register and boot services in a modular way.
- **TypeScript Support**: Fully typed for a better developer experience.
- **Flexible Configuration**: Load providers dynamically from a configuration file.

---

## Installation

Install the package using [Bun](https://bun.sh/) or your preferred package manager:

```bash
bun add @snapx/core
```

Or with npm:

```bash
npm install @snapx/core
```

## Configuration

The `ConfigServiceProvider` loads configuration files from the `config` directory and makes them available via the container.

1. Create a `config` directory in your project root.
2. Add configuration files (e.g., `app.js`, `database.js`):

```javascript
// config/app.js
export default {
  name: 'Snapx App',
  env: process.env.NODE_ENV || 'development',
};

// config/database.js
export default {
  connection: process.env.DB_CONNECTION || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
};
```
### Accessing Configuration

```javascript
import { App } from '@snapx/core';

const app = new App();
app.boot().then(() => {
  const config = app.container.resolve('config');
  console.log(config.app.name); // Output: Snapx App
  console.log(config.database.host); // Output: localhost
});
```

## Usage

Basic Example

```ts
import { App, Container, ServiceProvider } from '@snapx/core';

// Create a custom service provider
class MyServiceProvider extends ServiceProvider {
  register() {
    this.container.bind('myService', () => new MyService());
  }
}

// Bootstrap the application
const app = new App();
app.boot().then(() => {
  const myService = app.container.resolve('myService');
  myService.doSomething();
});
```

## Dynamic Provider Loading

Place your service providers in **app/bootstrap/providers.js**:

```ts
import { MyServiceProvider } from './providers/MyServiceProvider.js';

export default [
  MyServiceProvider,
];
```

## API Reference

Container

    bind(key, resolver): Register a binding.
    resolve(key): Resolve a dependency.

ServiceProvider

    register(): Register bindings in the container.
    boot(): Perform additional setup after registration.

App

    boot(): Bootstrap the application by loading and registering service providers.

## LICENSE

This project is licensed under the MIT License. See the [LICENSE](https://github.com/calvin-kimani/snapx/blob/main/LICENSE) file for details.

## Acknowledgments

Inspired by Laravel's service container and provider architecture.

Built with ❤️ by Calvin Kimani.
- GitHub: @calvin-kimani
- Email: calvinkimani475@gmail.com

