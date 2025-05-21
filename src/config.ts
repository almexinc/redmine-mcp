import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse as parseArgs } from 'node:util';

export interface RedmineMcpConfig {
  url: string;
  apiKey: string;
}

const DEFAULT_CONFIG: RedmineMcpConfig = {
  url: 'https://redmine.almex-contents.jp/',
  apiKey: '',
};

/**
 * Parse command line arguments
 */
function parseCommandLineArgs(): Partial<RedmineMcpConfig> {
  try {
    const options = {
      'url': { type: 'string' },
      'api-key': { type: 'string' },
      'config': { type: 'string' },
      'help': { type: 'boolean' },
    };

    const { values } = parseArgs({
      options,
      strict: false,
      allowPositionals: true,
    });

    if (values.help) {
      console.log('Redmine MCP Server');
      console.log('');
      console.log('Options:');
      console.log('  --url <url>        Redmine instance URL');
      console.log('  --api-key <key>    Redmine API key');
      console.log('  --config <path>    Path to configuration file');
      console.log('  --help             Display this help message');
      process.exit(0);
    }

    const config: Partial<RedmineMcpConfig> = {};
    
    if (values.url) {
      config.url = values.url as string;
    }
    
    if (values['api-key']) {
      config.apiKey = values['api-key'] as string;
    }

    // If config file is specified, try to load it
    if (values.config) {
      try {
        const configFilePath = values.config as string;
        const fileConfig = loadConfigFile(configFilePath);
        return { ...fileConfig, ...config };
      } catch (err) {
        console.error(`Error loading config file: ${err}`);
      }
    }

    return config;
  } catch (err) {
    console.error(`Error parsing command line arguments: ${err}`);
    return {};
  }
}

/**
 * Load configuration from environment variables
 */
function loadEnvConfig(): Partial<RedmineMcpConfig> {
  const config: Partial<RedmineMcpConfig> = {};

  if (process.env.REDMINE_URL) {
    config.url = process.env.REDMINE_URL;
  }

  if (process.env.REDMINE_API_KEY) {
    config.apiKey = process.env.REDMINE_API_KEY;
  }

  return config;
}

/**
 * Load configuration from a JSON file
 */
function loadConfigFile(configPath?: string): Partial<RedmineMcpConfig> {
  try {
    // Try to find config in specified path, home directory, or current directory
    const possiblePaths = [
      configPath,
      path.join(process.env.HOME || '', '.redminemcprc.json'),
      path.join(process.cwd(), '.redminemcprc.json'),
    ].filter(Boolean) as string[];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const configContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(configContent) as Partial<RedmineMcpConfig>;
      }
    }

    return {};
  } catch (err) {
    console.error(`Error loading config file: ${err}`);
    return {};
  }
}

/**
 * Load and merge configuration from all sources
 */
export function loadConfig(): RedmineMcpConfig {
  const fileConfig = loadConfigFile();
  const envConfig = loadEnvConfig();
  const argsConfig = parseCommandLineArgs();

  // Merge configs, with command line args taking precedence over environment variables and file
  const config: RedmineMcpConfig = {
    ...DEFAULT_CONFIG,
    ...fileConfig,
    ...envConfig,
    ...argsConfig,
  };

  // Validate config
  if (!config.apiKey) {
    console.error('Error: Redmine API key is required');
    console.error('Specify using --api-key flag, REDMINE_API_KEY environment variable, or in config file');
    process.exit(1);
  }

  return config;
}
