#!/bin/bash
set -e
REPO="ThinhPhoenix/potara-cli"
VERSION="v1.0.0"
URL="https://github.com/$REPO/releases/download/$VERSION/potara-cli.tar-1.0.0.gz"

curl -L $URL -o potara-cli.tar.gz
tar -xzf potara-cli.tar.gz
chmod +x potara
sudo mv potara /usr/local/bin/potara
echo "Potara installed successfully!"