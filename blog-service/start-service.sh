#!/usr/bin/env bash

docker service create --replicas 1 --name blog-service -l=apiRoute='/blog' -p 8081:8080 musings/booking-service
