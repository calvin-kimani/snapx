import type { Container } from "./Container";

export abstract class ServiceProvider {
    protected container: Container;

    /**
     * Constructor for the service provider.
     * @param container - The dependency injection container.
     */
    constructor(container: Container) {
        this.container = container;
    }

    /**
     * Register services with the container.
     * This method must be implemented by subclasses.
     */
    abstract register(): void;

    /**
     * Bootstrap services after registration.
     */
    boot(): void {
        // Default implementation does nothing
    }
}