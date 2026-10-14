#!/bin/bash
# EC2 user data for the Community Support host (Amazon Linux 2023, arm64).
# Runs once at first boot: adds swap, installs Docker + the compose plugin,
# and prepares /opt/community-support. The deploy workflow then writes
# docker-compose.yml + Caddyfile there and starts the containers over SSM.
set -euxo pipefail

# 1 GB swap — the host has only 1 GB RAM, so image pulls and Node start-up
# need somewhere to spill instead of being OOM-killed.
if [ ! -f /swapfile ]; then
  dd if=/dev/zero of=/swapfile bs=1M count=1024
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl -w vm.swappiness=10
  echo 'vm.swappiness=10' > /etc/sysctl.d/99-swappiness.conf
fi

dnf install -y docker
systemctl enable --now docker
usermod -aG docker ec2-user

# Docker compose v2 plugin (not packaged for AL2023)
mkdir -p /usr/local/lib/docker/cli-plugins
curl -fsSL "https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-aarch64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

mkdir -p /opt/community-support
