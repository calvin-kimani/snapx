import { describe, expect, it } from "bun:test";
import { Container } from "../src/Container";

describe("Container", () => {
    it("should bind and resolve a singleton service", () => {
        const container = new Container();
        class Service {}
        container.singleton("service", () => new Service());

        const instance1 = container.resolve("service");
        const instance2 = container.resolve("service");

        expect(instance1).toBe(instance2);
    });

    it("should bind and resolve a transient service", () => {
        const container = new Container();
        class Service {}
        container.transient("service", () => new Service());

        const instance1 = container.resolve("service");
        const instance2 = container.resolve("service");

        expect(instance1).not.toBe(instance2);
    });

    it("should bind and resolve a contextual service", () => {
        const container = new Container();
        class ServiceA {}
        class ServiceB {}
        container.context("service", "contextA", () => new ServiceA());
        container.context("service", "contextB", () => new ServiceB());

        const instanceA = container.resolve("service", "contextA");
        const instanceB = container.resolve("service", "contextB");

        expect(instanceA).toBeInstanceOf(ServiceA);
        expect(instanceB).toBeInstanceOf(ServiceB);
    });

    it("should throw an error when resolving an unbound service", () => {
        const container = new Container();
        expect(() => container.resolve("unknown"))
            .toThrow("No binding found for key: unknown");
    });

    it("should throw an error when resolving a contextual service without context", () => {
        const container = new Container();
        container.context("service", "context", () => ({}));
        expect(() => container.resolve("service"))
            .toThrow("Context key must be provided for contextual binding for key: service");
    });

    it("should return true if a service is bound", () => {
        const container = new Container();
        container.singleton("service", () => ({}));
        expect(container.has("service")).toBe(true);
    });

    it("should return false if a service is not bound", () => {
        const container = new Container();
        expect(container.has("unknown"))
            .toBe(false);
    });

    it("should throw an error if binding a contextual service to an already non-contextual key", () => {
        const container = new Container();
        container.singleton("service", () => ({}));
        expect(() => container.context("service", "context", () => ({})))
            .toThrow("Cannot add contextual binding for key \"service\" because it is already bound as a non-contextual service.");
    });
});
