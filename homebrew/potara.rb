class Potara < Formula
    desc "A simple CLI for proxying multiple ports"
    homepage "https://github.com/ThinhPhoenix/potara-cli/"
    url "https://github.com/ThinhPhoenix/potara-cli/releases/download/v1.0.0/potara-cli-1.0.0.tgz"
    sha256 "98eceb628e5f04860fa20037be1d7600ab508b3cac605ee0be67eb27a12e610b"
  
    def install
      bin.install "potara"
    end
  end  