import { Container } from './Container';
import { ServiceProvider } from './ServiceProvider';
import { ConfigServiceProvider } from './providers/ConfigServiceProvider';
import path from 'path';
import fs from 'fs';

export class App {
    private basePath: string;
    container: Container;
    providers: (typeof ServiceProvider)[] = [ConfigServiceProvider]; // Array of provider classes

    /**
     * Constructor for the App class.
     * @param basePath - The base path where the application is located.
     */
    constructor(basePath: string = process.cwd()) {
        this.basePath = basePath;
        this.container = new Container();
    }

    /**
     * Bootstrap the application by loading and registering service providers.
     * @param providersFilePath - The relative path to the providers.ts file.
     */
    async boot(): Promise<void> {
        console.log('Bootstrapping application...');

        // Resolve the absolute path to the providers.ts file
        const absoluteProvidersPath = path.resolve(this.basePath, 'app/bootstrap/providers.js');

        // Check if the file exists
        if (!fs.existsSync(absoluteProvidersPath)) {
            throw new Error(`Providers file not found at: ${absoluteProvidersPath}. Ensure the file exists and is correctly configured.`);
        }

        try {
            // Dynamically import the providers.ts file
            const { default: providers } = await import(absoluteProvidersPath);

            // Validate the imported data
            if (!Array.isArray(providers)) {
                throw new Error(`Invalid providers file: Expected an array of provider classes.`);
            }

            // Store the provider classes
            this.providers = [...this.providers, ...providers];

            // Load and register all service providers
            await this.loadServiceProviders();

            console.log('Application bootstrapped successfully.');
        } catch (error) {
            console.error('Error during bootstrap:', error);
            throw error; // Re-throw the error for further handling
        }
    }

    /**
     * Load and register all service providers.
     */
    private async loadServiceProviders(): Promise<void> {
        // Instantiate and register all providers
        const instantiatedProviders: ServiceProvider[] = [];
        for (const Provider of this.providers) {
            if (typeof Provider !== 'function' || !(Provider.prototype instanceof ServiceProvider)) {
                throw new Error(`Invalid provider: Expected a subclass of ServiceProvider.`);
            }

            const provider = new Provider(this.container);
            provider.register();
            instantiatedProviders.push(provider);
        }

        // Boot all providers
        for (const provider of instantiatedProviders) {
            if (provider.boot && typeof provider.boot === 'function') {
                provider.boot();
            }
        }
    }
}