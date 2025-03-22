class Potara < Formula
    desc "A simple CLI for proxying multiple ports"
    homepage "https://github.com/ThinhPhoenix/potara-cli/"
    url "https://github.com/ThinhPhoenix/potara-cli/releases/download/v1.0.0/potara-cli.tgz"
    sha256 "461f74afea2f5cd95d0091012359e73ffae830b3c1441a8c8e3800b33b54fa18"
  
    def install
      bin.install "potara"
    end
  end  