#!/usr/bin/env node

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

// For coloring in Windows, use simpler coloring functions
function green(text) { return `\x1b[32m${text}\x1b[0m`; }
function yellow(text) { return `\x1b[33m${text}\x1b[0m`; }
function red(text) { return `\x1b[31m${text}\x1b[0m`; }
function cyan(text) { return `\x1b[36m${text}\x1b[0m`; }
function bold(text) { return `\x1b[1m${text}\x1b[0m`; }

// Configuration file path in user's home directory
const CONFIG_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.potara.config.json');

// Initialize the configuration or load existing one
function getConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading config file:', err.message);
  }
  return { routes: {} };
}

// Save configuration
function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (err) {
    console.error('Error saving config file:', err.message);
  }
}

// Global server instance
let server = null;

// Main CLI program
const program = new Command();

// Configure main program options
program
  .name('potara')
  .description('Simple proxy server to combine multiple ports')
  .version('1.0.0', '-V, --version', 'Output the version number')
  .helpOption(false)         // Disable default help option

// Override help output (real solution)
program.configureOutput({
  outputError: (str, write) => write(red(str)),
  writeOut: (str) => {}, // Suppress default help output
  writeErr: (str) => {}, // Suppress default error output
});

// Create a custom help command
program
  .command('help')
  .description('Display help information')
  .action(() => {
    displayBanner();
    showHelp();
  });

// Function to show help information
function showHelp() {
  console.log(`Usage: potara [options] [command]\n`);
  console.log(`Simple proxy server to combine multiple ports\n`);
  console.log(`Commands:`);
  console.log(`  serve [port]          Start the proxy server on specified port`);
  console.log(`  add [options] <path>  Add a new route to the proxy`);
  console.log(`  remove <path>         Remove a route from the proxy`);
  console.log(`  list                  List all configured routes`);
  console.log(`  stop                  Stop the proxy server`);
  console.log(`  help                  Display help information\n`);
  console.log(`Options:`);
  console.log(`  -V, --version         Output the version number\n`);
}

// Function to display the banner
function displayBanner() {
  console.log(`
${green('Simple Proxy Server to Combine Multiple Ports')}

⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣶⣦⡄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣀⣀⣀⡀⢀⠀⢹⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠙⠻⣿⣿⣷⣄⠨⣿⣿⣿⡌⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣷⣿⣿⣿⣿⣿⣶⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣴⣾⣿⣮⣝⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠉⠙⠻⢿⣿⣿⣿⣿⣿⣿⠟⣹⣿⡿⢿⣿⣿⣬⣶⣶⡶⠦⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣀⣢⣙⣻⢿⣿⣿⣿⠎⢸⣿⠕⢹⣿⣿⡿⣛⣥⣀⣀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠉⠛⠿⡏⣿⡏⠿⢄⣜⣡⠞⠛⡽⣸⡿⣟⡋⠉⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⠾⠿⣿⠁⠀⡄⠀⠀⠰⠾⠿⠛⠓⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠠⢐⢉⢷⣀⠛⠠⠐⠐⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     
⠀⠀⠀⠀⣀⣠⣴⣶⣿⣧⣾⠡⠼⠎⢎⣋⡄⠆⠀⠱⡄⢉⠃⣦⡤⡀⠀⠀⠀⠀
⠀⠀⠐⠙⠻⢿⣿⣿⣿⣿⣿⣿⣄⡀⠀⢩⠀⢀⠠⠂⢀⡌⠀⣿⡇⠟⠀⠀⢄⠀
⠀⣴⣇⠀⡇⠀⠸⣿⣿⣿⣿⣽⣟⣲⡤⠀⣀⣠⣴⡾⠟⠀⠀⠟⠀⠀⠀⠀⡰⡀
⣼⣿⠋⢀⣇⢸⡄⢻⣟⠻⣿⣿⣿⣿⣿⣿⠿⡿⠟⢁⠀⠀⠀⠀⠀⢰⠀⣠⠀⠰
⢸⣿⡣⣜⣿⣼⣿⣄⠻⡄⡀⠉⠛⠿⠿⠛⣉⡤⠖⣡⣶⠁⠀⠀⠀⣾⣶⣿⠐⡀
⣾⡇⠈⠛⠛⠿⣿⣿⣦⠁⠘⢷⣶⣶⡶⠟⢋⣠⣾⡿⠃⠀⠀⠀⠰⠛⠉⠉⠀⠀ 
`);
}

// Serve command
program
  .command('serve [port]')
  .description('Start the proxy server on specified port')
  .action((port) => {
    port = parseInt(port || 3737);
    const config = getConfig();
    
    // Save the port setting
    config.port = port;
    saveConfig(config);
    
    if (server) {
      console.log(yellow('Server is already running. Stop it first.'));
      return;
    }
    
    // Create express app
    const app = express();
    
    // Configure routes
    const routes = config.routes || {};
    let routeCount = 0;
    
    Object.entries(routes).forEach(([path, targetPort]) => {
      const target = `http://localhost:${targetPort}`;
      app.use(path, createProxyMiddleware({
        target,
        pathRewrite: { [`^${path}`]: '' },
        changeOrigin: true
      }));
      routeCount++;
    });
    
    // Start the server
    server = app.listen(port, () => {
      console.log(green(`Proxy server running on http://localhost:${port}`));
      
      if (routeCount === 0) {
        console.log(yellow('No routes configured. Use "add" command to add routes.'));
      } else {
        console.log(cyan('Configured routes:'));
        Object.entries(routes).forEach(([path, targetPort]) => {
          console.log(`  ${bold(`http://localhost:${port}${path}`)} → localhost:${targetPort}`);
        });
      }
    });
  });

// Add command
program
  .command('add')
  .description('Add a new route to the proxy')
  .requiredOption('--port <port>', 'Target port number')
  .argument('<path>', 'Path prefix (must start with /)')
  .action((path, options) => {
    const config = getConfig();
    const targetPort = parseInt(options.port);
    
    // Validate path
    if (!path.startsWith('/')) {
      console.error(red('Path must start with /'));
      return;
    }
    
    // Add the route
    if (!config.routes) config.routes = {};
    config.routes[path] = targetPort;
    saveConfig(config);
    
    console.log(green(`Added route: ${path} → localhost:${targetPort}`));
    
    // If server is running, remind to restart
    if (server) {
      console.log(yellow('Server is running. Stop and start again to apply changes.'));
    }
  });

// Remove command
program
  .command('remove <path>')
  .description('Remove a route from the proxy')
  .action((path) => {
    const config = getConfig();
    
    if (!config.routes || !config.routes[path]) {
      console.log(yellow(`No route found for path: ${path}`));
      return;
    }
    
    delete config.routes[path];
    saveConfig(config);
    
    console.log(green(`Removed route: ${path}`));
    
    // If server is running, remind to restart
    if (server) {
      console.log(yellow('Server is running. Stop and start again to apply changes.'));
    }
  });

// List command
program
  .command('list')
  .description('List all configured routes')
  .action(() => {
    const config = getConfig();
    const port = config.port || 3737;
    const routes = config.routes || {};
    
    console.log(cyan(`Proxy port: ${port}`));
    
    if (Object.keys(routes).length === 0) {
      console.log(yellow('No routes configured.'));
      return;
    }
    
    console.log(cyan('Configured routes:'));
    Object.entries(routes).forEach(([path, targetPort]) => {
      console.log(`  ${bold(`http://localhost:${port}${path}`)} → localhost:${targetPort}`);
    });
  });

// Stop command
program
  .command('stop')
  .description('Stop the proxy server')
  .action(() => {
    if (!server) {
      console.log(yellow('Server is not running.'));
      return;
    }
    
    server.close(() => {
      console.log(green('Proxy server stopped.'));
      server = null;
    });
  });

  // Reset command
program
.command('reset')
.description('Reset the proxy configuration')
.action(() => {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
    console.log(green('Configuration reset. .potara.config.json removed.'));
  } else {
    console.log(yellow('No configuration file found to reset.'));
  }
});

// Check for no arguments BEFORE parsing
if (process.argv.length <= 2) {
  displayBanner();
  showHelp();
  process.exit(0); // Exit after showing the banner
}

// Parse command line arguments
program.parse(process.argv);

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  if (server) {
    server.close(() => {
      console.log(green('\nProxy server stopped.'));
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});