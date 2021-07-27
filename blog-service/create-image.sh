#!/usr/bin/env bash

docker rm -f blog-service
docker rmi blog-service
docker image prune
docker volume prune
docker build -t blog-service .
