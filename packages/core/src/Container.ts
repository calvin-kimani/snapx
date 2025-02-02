export class Container {
    /**
     * Map to store service bindings.
     * Keys are service identifiers, and values are either resolvers (factory functions or instances)
     * or nested Maps for contextual bindings.
     * @type {Map<string, Function | object | Map<string, Function | object>>}
     */
    private bindings: Map<string, Function | object | any>;

    /**
     * Map to store resolved service instances.
     * Keys are service identifiers (or composite keys for contextual bindings),
     * and values are the resolved instances.
     * @type {Map<string, any>}
     */
    private instances: Map<string, any>;

    constructor() {
        this.bindings = new Map();
        this.instances = new Map();
    }

    /**
     * Bind a singleton service to the container.
     * Singleton services are instantiated once and reused throughout the application lifecycle.
     * @param {string} key - The key to identify the service.
     * @param {Function | object} resolver - A factory function or an instance to resolve the service.
     */
    singleton(key: string, resolver: Function | object): void {
        this.bindings.set(key, { resolver });
    }

    /**
     * Bind a transient service to the container.
     * Transient services are instantiated each time they are resolved.
     * @param {string} key - The key to identify the service.
     * @param {Function | object} resolver - A factory function or an instance to resolve the service.
     */
    transient(key: string, resolver: Function | object): void {
        this.bindings.set(key, { resolver, transient: true });
    }

    /**
     * Bind a contextual service to the container.
     * Contextual services allow different implementations of the same service to be resolved
     * based on a context key.
     * @param {string} key - The key to identify the service.
     * @param {string} contextKey - The key to identify the context.
     * @param {Function | object} resolver - A factory function or an instance to resolve the service.
     * @throws {Error} If the key is already bound as a non-contextual service.
     */
    context(key: string, contextKey: string, resolver: Function | object): void {
        if (!this.bindings.has(key)) {
            this.bindings.set(key, new Map());
        }
        const contextMap = this.bindings.get(key);
        if (!(contextMap instanceof Map)) {
            throw new Error(`Cannot add contextual binding for key "${key}" because it is already bound as a non-contextual service.`);
        }
        contextMap.set(contextKey, resolver);
    }

    /**
     * Resolve a service from the container.
     * @template T - The type of the resolved service.
     * @param {string} key - The key to identify the service.
     * @param {string} [contextKey] - The key to identify the context for contextual bindings.
     * @returns {T} The resolved service instance.
     * @throws {Error} If no binding is found for the key or context.
     */
    resolve<T = any>(key: string, contextKey?: string): T {
        const binding = this.bindings.get(key);
        if (!binding) {
            throw new Error(`No binding found for key: ${key}`);
        }

        // Handle contextual bindings
        if (binding instanceof Map) {
            if (!contextKey) {
                throw new Error(`Context key must be provided for contextual binding for key: ${key}`);
            }
            const resolver = binding.get(contextKey);
            if (!resolver) {
                throw new Error(`No binding found for context: ${contextKey} under key: ${key}`);
            }

            // Use a composite key for caching contextual instances
            const compositeKey = `${key}:${contextKey}`;
            if (this.instances.has(compositeKey)) {
                return this.instances.get(compositeKey);
            }

            // Create the instance using the resolver
            const instance = typeof resolver === "function" ? resolver(this) : resolver;
            this.instances.set(compositeKey, instance);
            return instance;
        }

        // Handle non-contextual bindings
        if (this.instances.has(key)) {
            return this.instances.get(key);
        }

        // Handle transient bindings
        if (binding.transient) {
            return typeof binding.resolver === "function" ? binding.resolver(this) : binding.resolver;
        }

        // Handle singleton bindings
        const instance = typeof binding.resolver === "function" ? binding.resolver(this) : binding.resolver;
        this.instances.set(key, instance);
        return instance;
    }

    /**
     * Check if a service is bound to the container.
     * @param {string} key - The key to identify the service.
     * @returns {boolean} Whether the service is bound.
     */
    has(key: string): boolean {
        return this.bindings.has(key);
    }
}