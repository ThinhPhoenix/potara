class Potara < Formula
    desc "A simple CLI for proxying multiple ports"
    homepage "https://github.com/ThinhPhoenix/potara-cli/"
    url "https://github.com/ThinhPhoenix/potara-cli/releases/download/v1.0.0/potara-cli.tgz"
    sha256 "7c2b07e9d395c9ea7f4d6ab78074cf0f7376cd8f5b6613595f6560fc23df0f91"
  
    def install
      bin.install "potara"
    end
  end  