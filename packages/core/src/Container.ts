/**
 * A simple dependency injection container for managing service bindings and resolutions.
 */
export class Container {
    /**
     * Bindings tell the container how to create an insance
     */
    private bindings: Map<string | { new (...args: any[]): unknown }, any>;

    /**
     * Holds cached services of the container
     */
    private instances: Map<string | { new (...args: any[]): unknown }, unknown>;

    constructor() {
        this.bindings = new Map();
        this.instances = new Map();
    }

    /**
     * Registers a singleton binding in the container.
     * @param key - The key to bind the service to.
     * @param resolver - The resolver function or object instance.
     */
    singleton(key: string, resolver: Function | object): void {
        this.bindings.set(key, { resolver, singleton: true });
    }

    /**
     * Registers a transient binding in the container.
     * @param key - The key to bind the service to.
     * @param resolver - The resolver function or object instance.
     */
    transient(key: string, resolver: Function | object): void {
        this.bindings.set(key, { resolver, singleton: false });
    }


    /**
     * Registers a contextual binding in the container.
     * @param key - The key to bind the service to.
     * @param contextKey - The context-specific key.
     * @param resolver - The resolver function or object instance.
     * @param singleton - Whether the service should be a singleton within the context.
     */
    context(key: string, contextKey: string, resolver: Function | object, singleton = true): void {
        if (!this.bindings.has(key)) {
            this.bindings.set(key, new Map());
        }
        const contextMap = this.bindings.get(key);
        if (!(contextMap instanceof Map)) {
            throw new Error(`Cannot add contextual binding for key "${key}" because it is already bound as a non-contextual service.`);
        }
        contextMap.set(contextKey, { resolver, singleton });
    }

    /**
     * Resolves a service from the container.
     * @param key - The key or class constructor to resolve.
     * @param contextKey - Optional context-specific key.
     * @returns The resolved service instance.
     * @throws Error if the binding is not found.
     */
    resolve<T = unknown>(key: string | { new (...args: any[]): T }, contextKey?: string): T {
        if (typeof key === "function") {
            if (this.instances.has(key)) {
                return this.instances.get(key) as T;
            }
            const instance = this.instantiate(key);
            this.instances.set(key, instance);
            return instance;
        }

        const binding = this.bindings.get(key);
        if (!binding) {
            throw Error(`Binding not found for key: "${key}"`);
        }

        if (contextKey && binding instanceof Map) {
            return this.resolveContext(key, contextKey, binding);
        };

        if (this.instances.has(key)) {
            return this.instances.get(key) as T;
        };

        const instance = typeof binding.resolver === 'function' ? binding.resolver() : binding.resolver;
        if (binding.singleton) {
            this.instances.set(key, instance);
        }
        return instance;
    }

    /**
     * Instantiates a class and injects its dependencies.
     * @param target - The class constructor to instantiate.
     * @returns The instantiated class with dependencies resolved.
     * @throws Error if a dependency is unresolvable.
     */
    private instantiate<T>(target: { new (...args: any[]): T }): T {
        const dependencies = (target as any).__dependencies || [];

        const resolvedDeps = dependencies.map((dep: any, index: number) => {
            if (this.isPrimitive(dep)) {
                throw Error(`Unresolvable dependency resolving [Parameter #${index} [ type ${dep.name} ]] in class ${target.name}`);
            }

            // Check for an existing instance that matches the prototype
            for (const instance of this.instances.values()) {
                if (instance instanceof dep) {
                    return instance;
                }
            }

            return this.resolve(dep);
        });

        return new target(...resolvedDeps);
    }

     /**
     * Resolves a contextual binding from the container.
     * @param key - The key of the service.
     * @param contextKey - The context-specific key.
     * @param binding - The binding map containing context-specific services.
     * @returns The resolved contextual instance.
     * @throws Error if the contextual binding is not found.
     */
    private resolveContext<T>(key: string, contextKey: string, binding: Map<string, any>): T {
        const compositeKey = `${key}:${contextKey}`;

        if (this.instances.has(compositeKey)) {
            return this.instances.get(compositeKey) as T;
        }

        const context = binding.get(contextKey);
        if (!context) {
            throw Error(`Binding not found for key: "${key}" with context "${contextKey}"`);
        }

        const instance = typeof context.resolver === 'function' ? context.resolver() : context.resolver;
        if (context.singleton) {
            this.instances.set(compositeKey, instance);
        }
        return instance;
    }

   /**
     * Checks if a value is a primitive type.
     * @param object - The value to check.
     * @returns True if the value is a primitive type, false otherwise.
     */
    private isPrimitive(object: unknown): boolean {
        return [String, Number, Boolean, Symbol, BigInt, undefined].includes(object as any);
    }

    /**
     * Checks if a key exists in the container.
     * @param key - The key to check.
     * @returns True if the key exists, false otherwise.
     */
    has(key: string): boolean {
        return this.bindings.has(key);
    }
}
