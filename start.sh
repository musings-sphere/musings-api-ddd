#!/usr/bin/env bash

BLUE=$(tput setaf 4)
RESET=$(tput sgr0)

function setup-swarm() {
    # first we go to our docker folder
    cd docker || exit

    echo "==============================="
    echo "${BLUE}==> Setting up the swarm >> ...${RESET}"
    echo "==============================="
    echo " "

    # create and init the swarm cluster
    (bash < ./setup-swarm.sh)

    # go back to the root folder
    cd ..
}

function setup-mongo {
  echo '···························'
  echo '·· <<<< git clone the mongodb cluster  ··'
  echo '···························'

  rm -rf mongo-replica-with-docker

  # next we download our mongo-replica-set configuration
  git clone https://github.com/Crizstian/mongo-replica-with-docker.git

  echo '···························'
  echo '·· setting up the mongodb cluster  >>>> ··'
  echo '···························'
  # we go into the folder
  cd mongo-replica-docker

  # we create and init our mongodb replica set cluster
  (bash < create-replica-set.sh)

  # we go back to the root project
  cd ..
}

function setup-images {

    # go inside the docker folder again
    cd docker || exit

    echo "==============================="
    echo "${BLUE}==> Creating microservices images...${RESET}"
    echo "==============================="

    # we start all our microservices
    (bash < create-images.sh)

   cd ..
}

function setup-services {

    # go inside the docker folder again
    cd docker || exit

    echo "==============================="
    echo "${BLUE}==> Starting up the microservices...${RESET}"
    echo "==============================="

    # we start all our microservices
    (bash < start-services.sh)

   cd ..
}

function status {
  eval `docker-machine env manager1`
  # we verify the docker swarm
  docker node ls

  # we verify our docker services
  docker service ls
}

function main {
#  setup-swarm
  setup-images
  setup-services
  status
}

main
