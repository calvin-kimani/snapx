import type { Container } from "../Container";
import { ServiceProvider } from "../ServiceProvider";
import fs from 'fs';
import path from 'path';

export class ConfigServiceProvider extends ServiceProvider {
    private configPath: string;

    constructor(container: Container, configPath: string = 'config') {
        super(container);
        this.configPath = configPath;
    }

    register() {
        const config = this.loadConfig();
        this.container.singleton("config", config);
    }

    /**
     * Load configuration files from the config directory.
    */
    private loadConfig(): Record<string, any> {
        const config: Record<string, any> = {};

        // Resolve the absolute path to the config directory
        const absoluteConfigPath = path.resolve(process.cwd(), this.configPath);

        // Check if the config directory exists
        if (!fs.existsSync(absoluteConfigPath)) {
          throw new Error(`Config directory not found: ${absoluteConfigPath}`);
        }

        // Read all files in the config directory
        const files = fs.readdirSync(absoluteConfigPath);

        // Load each configuration file
        for (const file of files) {
          if (file.endsWith('.js') || file.endsWith('.ts')) {
            const configKey = file.replace(/\.(js|ts)$/, '');
            const configFilePath = path.resolve(absoluteConfigPath, file);
            config[configKey] = require(configFilePath).default;
          }
        }

        return config;
    }
}
