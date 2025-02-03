import { describe, expect, it } from "bun:test";
import { Injectable } from "../src/Injectable";;

describe("Injectable Decorator", () => {
    it("should store constructor dependencies in __dependencies", () => {
        @Injectable()
        class ServiceA {}

        @Injectable()
        class ServiceB {
            constructor(private serviceA: ServiceA) {}
        }

        expect((ServiceA as any).__dependencies).toEqual([]);
        expect((ServiceB as any).__dependencies).toEqual([ServiceA]);
    });

    it("should not enumerate __dependencies", () => {
        @Injectable()
        class TestService {}

        const keys = Object.keys(TestService);
        expect(keys.includes("__dependencies")).toBe(false);
    });

    it("should not allow modification of __dependencies", () => {
        @Injectable()
        class UnmodifiableService {}

        const modify = () => {
            (UnmodifiableService as any).__dependencies = ["Modified"];
        };

        expect(modify).toThrow();
    });
});
