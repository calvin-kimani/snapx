import "reflect-metadata";

/**
 * Marks a class as injectable, extracting its constructor dependencies and storing them
 * internally so that a DI container can resolve them without relying on `reflect-metadata`.
 *
 * This decorator should be used on services or classes that require dependency injection.
 *
 * @example
 * ```typescript
 * @Injectable()
 * class ServiceA {
 *     sayHello() {
 *         console.log("Hello from ServiceA!");
 *     }
 * }
 *
 * @Injectable()
 * class ServiceB {
 *     constructor(private serviceA: ServiceA) {}
 * }
 * ```
 */
export function Injectable() {
    return function (target: { new (...args: any[]): any }) {
        /**
         * Retrieves constructor parameter types using reflect-metadata
         * and stores them in a non-enumerable static property `__dependencies`.
         */
        const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];

        Object.defineProperty(target, "__dependencies", {
            value: dependencies,
            writable: false,
            enumerable: false,
            configurable: false
        });
    };
}
