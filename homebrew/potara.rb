class Potara < Formula
    desc "A simple CLI for proxying multiple ports"
    homepage "https://github.com/ThinhPhoenix/potara-cli/"
    url "https://github.com/ThinhPhoenix/potara-cli/releases/download/v1.0.0/potara.tgz"
    sha256 "a897f06cc129c914d92c612488660e9ffde6c02140e3711d74c35984b1b87c36"
  
    def install
      bin.install "potara"
    end
  end  

# pkg potara.js --targets node18-win-x64 --output potara.exe
# shasum -a 256 potara.tgz
# or
# certutil -hashfile potara.tgz SHA256