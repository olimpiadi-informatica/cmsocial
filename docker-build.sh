#!/usr/bin/env bash

set -e

ghcr_user="olimpiadi-informatica"

usage() {
    echo "Build and tag the docker images"
    echo "$0 -t tag"
    echo "   tag        tag to use for the images"
}

while getopts "ht:" opt; do
    case "$opt" in
        t) tag="$OPTARG";;
        *) usage
           exit 0
           ;;
    esac
done

build() {
    component=$1
    context=$2
    dockerfile=$3

    image="ghcr.io/$ghcr_user/$component"

    echo "Building image $image"
    pushd $context
    docker build -t "$image" -f "$dockerfile" .
    popd
    echo "Tagging $image -> $image:$tag"
    docker tag "$image" "$image:$tag"
}

if [ -z "$tag" ]; then
    echo "Must specify a tag"
    echo
    usage
    exit 1
fi

build "cmsocial" "backend" "docker/cmsocial/Dockerfile"
build "cmsocial-web" "backend" "docker/cmsocial-web/Dockerfile"
build "cmsocial-frontend" "." "tools/Dockerfile"
