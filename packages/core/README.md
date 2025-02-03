
# @snapx/core

[![Version](https://img.shields.io/npm/v/@snapx/core.svg)](https://www.npmjs.com/package/@snapx/core)
[![License](https://img.shields.io/npm/l/@snapx/core)](https://github.com/calvin-kimani/snapx/blob/main/LICENSE)

A lightweight dependency injection container and service provider architecture inspired by Laravel, designed for modern JavaScript and TypeScript applications.

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Automatic Dependency Resolution](#automatic-dependency-resolution)
- [Configuration](#configuration)
- [Usage](#usage)
- [Service Bindings](#service-bindings)
- [Dynamic Provider Loading](#dynamic-provider-loading)
- [Container and App Classes](#container-and-app-classes)
- [API Reference](#api-reference)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Dependency Injection**: Manage and resolve dependencies with ease.
- **Automatic Dependency Resolution** : Automatically resolve constructor dependencies using the @Injectable decorator.
- **Service Providers**: Register and boot services in a modular way.
- **TypeScript Support**: Fully typed for a better developer experience.
- **Flexible Configuration**: Load providers dynamically from a configuration file.
- **Singleton, Transient, and Contextual Bindings**: Register services with different lifetimes and contexts.

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

---


## Automatic Dependency Resolution

The container now supports automatic dependency resolution using the `@Injectable` decorator. When a class is decorated with `@Injectable`, its constructor dependencies are automatically extracted and resolved by the container.

#### How It Works

1. Decorate your classes with `@Injectable`:

```ts
import { Injectable } from '@snapx/core';

@Injectable()
class ServiceA {
    sayHello() {
        return "Hello from ServiceA!";
    }
}

@Injectable()
class ServiceB {
    constructor(private serviceA: ServiceA) {}
    greet() {
        return this.serviceA.sayHello();
    }
}
```

2. Register the services in the container:

```ts
container.singleton('ServiceA', () => new ServiceA());
container.singleton('ServiceB', () => container.resolve(ServiceB));
```

3. Resolve the service:

```ts
const serviceB = container.resolve<ServiceB>('ServiceB');
console.log(serviceB.greet()); // Output: Hello from ServiceA!
```

This eliminates the need for manual dependency configuration, making the container easier to use and reducing boilerplate.


## Configuration

Configuration files are loaded from the `config` directory and made them available via the container.

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
await app.boot();

const config = app.container.resolve('config');
console.log(config.app.name); // Output: Snapx App
console.log(config.database.host); // Output: localhost
```

---

## Usage

Basic Example:

```ts
import { App, Container, ServiceProvider, Injectable } from '@snapx/core';

// Define injectable services
@Injectable()
class MyService {
  sayHello() {
    return "Hello from MyService!";
  }
}

@Injectable()
class AnotherService {
  constructor(private myService: MyService) {}
  greet() {
    return this.myService.sayHello();
  }
}

// Create a custom service provider
class MyServiceProvider extends ServiceProvider {
  register() {
    this.container.singleton('myService', () => new MyService());
    this.container.singleton('anotherService', () => this.container.resolve(AnotherService));
  }
}

// Bootstrap the application
const app = new App();
await app.boot();
const anotherService = app.container.resolve<AnotherService>('anotherService');
console.log(anotherService.greet()); // Output: Hello from MyService!
```

---

## Service Bindings

In `@snapx/core`, services can be bound to the container with different lifetimes using the following binding methods:

#### Singleton

```ts
container.singleton('mySingleton', () => new MySingleton());
```
- The service is instantiated once and shared across the entire application lifecycle.

#### Transient

```ts
container.transient('myService', () => new MyService());
```
- The service is instantiated every time it is resolved.

#### Contextual

```ts
container.context('myService', 'customContext', () => new CustomService());
```
- The service can have different implementations based on a context.

#### Resolving Services

To resolve a service from the container:

```ts
const myService = container.resolve('myService');
```

For contextual bindings, you must provide a context key:

```ts
const myServiceInContext = container.resolve('myService', 'customContext');
```

---

## Dynamic Provider Loading

Place your service providers in **app/bootstrap/providers.js**:

```ts
import { MyServiceProvider } from './providers/MyServiceProvider.js';

export default [
  MyServiceProvider,
];
```

---

## Container and App Classes

### Container

The `Container` class is responsible for managing service bindings and resolving dependencies. It supports different types of bindings:

- **Singletons**: Bind services that should be shared across the entire application.
- **Transients**: Bind services that should be instantiated every time they are resolved.
- **Contextual**: Bind services based on a context key (useful for different implementations in different parts of the application).

#### `Container` Methods

- `singleton(key, resolver)`: Registers a service as a singleton.
- `transient(key, resolver)`: Registers a service as a transient.
- `context(key, contextKey, resolver)`: Registers a service as contextual.
- `resolve(key, contextKey)`: Resolves and retrieves a service from the container.
- `has(key)`: Checks if a service is bound to the container.

#### Example:

```ts
const container = new Container();

// Register singleton service
container.singleton('mySingleton', () => new MySingleton());

// Register transient service
container.transient('myService', () => new MyService());

// Register contextual service
container.context('myService', 'customContext', () => new CustomService());

// Resolving services
const mySingleton = container.resolve('mySingleton');
const myService = container.resolve('myService');
const myServiceInContext = container.resolve('myService', 'customContext');
```

### App

The `App` class is the main entry point for bootstrapping the application. It loads service providers dynamically from a configuration file and registers them in the container.

#### `App` Methods

- `boot()`: Bootstraps the application by loading and registering service providers from the configuration file.
- `loadServiceProviders()`: Registers all the service providers in the application.

#### Example:

```ts
import { App } from '@snapx/core';

const app = new App();
await app.boot();

// Accessing a service from the container
const myService = app.container.resolve('myService');
myService.doSomething();
```

---

## API Reference

### Container

- `bind(key, resolver)`: Register a binding (for singletons and transients).
- `resolve(key, contextKey)`: Resolve a dependency.
- `has(key)`: Check if a service is bound to the container.

### ServiceProvider

- `register()`: Register bindings in the container.
- `boot()`: Perform additional setup after registration.

### App

- `boot()`: Bootstrap the application by loading and registering service providers.

---

## LICENSE

This project is licensed under the MIT License. See the [LICENSE](https://github.com/calvin-kimani/snapx/blob/main/LICENSE) file for details.

---

## Acknowledgments

Inspired by Laravel's service container and provider architecture.

Built with ❤️ by Calvin Kimani.
- GitHub: @calvin-kimani
- Email: calvinkimani475@gmail.com
