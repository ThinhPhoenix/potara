#!/bin/bash
set -e
REPO="ThinhPhoenix/potara"
VERSION="v1.0.0"
URL="https://github.com/$REPO/releases/download/$VERSION/potara.tgz"

curl -L $URL -o potara.tar.gz
tar -xzf potara.tar.gz
chmod +x potara
sudo mv potara /usr/local/bin/potara
echo "Potara installed successfully!"