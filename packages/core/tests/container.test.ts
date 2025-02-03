import { test, expect, describe } from "bun:test";
import { Container, Injectable } from "../src";


// Create a new container instance for testing
const container = new Container();

// Test Classes
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

@Injectable()
class ServiceC {
    constructor(private serviceB: ServiceB) {}

    getMessage() {
        return this.serviceB.greet();
    }
}

@Injectable()
class ContextualService {
    constructor(private contextKey: string) {}

    getContext() {
        return `Context: ${this.contextKey}`;
    }
}

describe("Container", ()=>{
    test("should resolve singleton binding", () => {
        // Register ServiceA as a singleton
        container.singleton("ServiceA", () => new ServiceA());

        const instance1 = container.resolve<ServiceA>("ServiceA");
        const instance2 = container.resolve<ServiceA>("ServiceA");

        // Singleton should return the same instance
        expect(instance1).toBe(instance2);
        expect(instance1.sayHello()).toBe("Hello from ServiceA!");
    });

    test("should resolve transient binding", () => {
        // Register ServiceA as a transient
        container.transient("TransientServiceA", () => new ServiceA());

        const instance1 = container.resolve<ServiceA>("TransientServiceA");
        const instance2 = container.resolve<ServiceA>("TransientServiceA");

        // Transient should return a new instance each time
        expect(instance1).not.toBe(instance2);
        expect(instance1.sayHello()).toBe("Hello from ServiceA!");
    });

    test("should resolve contextual binding", () => {
        // Register ContextualService with contextual bindings
        container.context("ContextualService", "context1", () => new ContextualService("context1"));
        container.context("ContextualService", "context2", () => new ContextualService("context2"));

        const instance1 = container.resolve<ContextualService>("ContextualService", "context1");
        const instance2 = container.resolve<ContextualService>("ContextualService", "context2");

        // Contextual bindings should resolve different instances based on context
        expect(instance1.getContext()).toBe("Context: context1");
        expect(instance2.getContext()).toBe("Context: context2");
        expect(instance1).not.toBe(instance2);
    });

    test("should automatically resolve dependencies", () => {
        // Register services in the container
        container.singleton("ServiceA", () => new ServiceA());
        container.singleton("ServiceB", () => container.resolve(ServiceB));
        container.singleton("ServiceC", () => container.resolve(ServiceC));

        const serviceC = container.resolve<ServiceC>("ServiceC");

        // ServiceC should resolve ServiceB, which resolves ServiceA
        expect(serviceC.getMessage()).toBe("Hello from ServiceA!");
    });

    test("should throw error for missing binding", () => {
        // Attempt to resolve a non-existent binding
        expect(() => container.resolve("NonExistentService")).toThrow("Binding not found for key: \"NonExistentService\"");
    });

    test("should check if a binding exists", () => {
        // Register a service
        container.singleton("ServiceA", () => new ServiceA());

        // Check existence of bindings
        expect(container.has("ServiceA")).toBe(true);
        expect(container.has("NonExistentService")).toBe(false);
    });
})