# Potara

<p align="center">
  <img src="https://i.pinimg.com/originals/1f/b4/a8/1fb4a8dc6e2c820fc035a12978ccd031.gif" alt="Potara Logo" width="650"/>
</p>

## Introduction

Potara is a lightweight, easy-to-use proxy manager that allows you to combine multiple local ports under a single endpoint. It's perfect for developers working with microservices, multiple APIs, or any scenario where you need to route different services through a unified interface.

Named after the magical Potara earrings from Dragon Ball that allow fusion, this tool "fuses" your various local services together, making them accessible through a single port.

## Features

- Combine multiple local services under a single port
- Configure custom path prefixes for each service
- Easy-to-use CLI interface
- Persistent configuration across sessions
- Cross-platform support (macOS, Linux, Windows)

## Installation

### macOS <img src="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png" width="20"/>

```sh
brew tap thinhphoenix/potara https://github.com/thinhphoenix/potara.git
brew install potara
```

> [!Note]
> Homebrew is required. Install it from [brew.sh](https://brew.sh).

### Linux <img src="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/6984223cd33751654099ea66970bcec8_kfekaJmEYO.png" width="20"/>

```sh
curl -fsSL https://raw.githubusercontent.com/thinhphoenix/potara/main/curl/potara.sh | bash
```

### Windows <img src="https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/cb2d93b07b27cebd7319ccffe2b62e39_low_res_Windows_11.png" width="20"/>

[![Download Potara](https://custom-icon-badges.demolab.com/badge/-Download-blue?style=for-the-badge&logo=download&logoColor=white)](https://github.com/ThinhPhoenix/potara/releases/download/v1.0.0/PotaraInstaller.exe)

## Usage

### Basic Commands

```
potara serve [port]          Start the proxy server on specified port (default: 3737)
potara add --port <port> <path>  Add a new route to the proxy
potara remove <path>         Remove a route from the proxy
potara list                  List all configured routes
potara stop                  Stop the proxy server
potara reset                 Reset all configured routes
potara help                  Display help information
```

### Quick Start

1. Start the proxy server:
   ```
   potara serve
   ```

2. Add routes to your services:
   ```
   potara add --port 3000 /api
   potara add --port 8080 /app
   ```

3. Now you can access:
   - `http://localhost:3737/api` → routes to `http://localhost:3000`
   - `http://localhost:3737/app` → routes to `http://localhost:8080`

4. List all configured routes:
   ```
   potara list
   ```

5. Stop the server:
   ```
   potara stop
   ```

## Examples

### Setting up a microservices development environment

```sh
# Start the proxy on port 8000
potara serve 8000

# Add routes to your microservices
potara add --port 3001 /auth
potara add --port 3002 /users
potara add --port 3003 /products
potara add --port 3004 /orders

# Now all services are accessible through port 8000:
# http://localhost:8000/auth    → localhost:3001
# http://localhost:8000/users   → localhost:3002
# http://localhost:8000/products → localhost:3003
# http://localhost:8000/orders  → localhost:3004
```

### Combining frontend and backend during development

```sh
# Add routes for React frontend and Express backend
potara add --port 3000 /app     # React dev server
potara add --port 8080 /api     # Express API

# Start the proxy
potara serve

# Now you can access:
# http://localhost:3737/app → React app
# http://localhost:3737/api → Express API
```

## Configuration

Potara stores its configuration in `~/.potara.config.json`. This file is created automatically when you add your first route. You can manually edit this file if needed, but it's recommended to use the CLI commands.

To reset the configuration:
```
potara reset
```

## License

MIT

## Author

ThinhPhoenix

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.