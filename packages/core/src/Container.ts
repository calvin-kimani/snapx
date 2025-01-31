export class Container {
    private bindings: Map<string, Function | object | any>; // Store service bindings
    private instances: Map<string, any>; // Store resolved service instances

    constructor() {
        this.bindings = new Map(); // Initialize bindings map
        this.instances = new Map(); // Initialize instances map
    }

    /**
     * Bind a service to the container.
     * @param key - The key to identify the service.
     * @param resolver - A factory function or an instance.
     */
    bind(key: string, resolver: Function | object | any): void {
        this.bindings.set(key, resolver);
    }

    /**
     * Resolve a service from the container.
     * @param key - The key to identify the service.
     * @returns The resolved service instance.
     */
    resolve<T = any>(key: string): T {
        // Return cached instance if it exists
        if (this.instances.has(key)) {
            return this.instances.get(key);
        }

        // Retrieve the resolver for the given key
        const binding = this.bindings.get(key);
        if (!binding) {
            throw new Error(`No binding found for key: ${key}`);
        }

        // Resolve the service instance
        const instance = typeof binding === 'function' ? binding.resolver(this) : binding.resolver;

        // Cache the instance for future use
        this.instances.set(key, instance);

        return instance;
    }

    /**
     * Check if a service is bound to the container.
     * @param key - The key to identify the service.
     * @returns Whether the service is bound.
     */
    has(key: string): boolean {
        return this.bindings.has(key);
    }
}