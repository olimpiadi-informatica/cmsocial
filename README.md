# Italian Olympiads in Informatics Training Website

This repository contains the source code for the new training website of the Italian Olympiads in Informatics.

The website is based on [NextJS](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/)
and [DaisyUI](https://daisyui.com/).

## Installation

Clone the repository and run `yarn install` to install the dependencies.

## Development

Run `yarn dev` to start the development server.

Before committing, make sure to run `yarn lint` to check for linting errors.

If you've added or changed text, you also need to update the translations:

1. Run `yarn translate` to extract the new messages.
2. Update `src/locales/en/messages.po` with the new translation.

## Deployment

Once the PR is merged, check https://hub.docker.com/r/olimpiadiinformatica/training/tags for the
new tag and copy it (it's a hash, DO NOT use "latest"). Then ssh in the server and update the hash
in `~/infrastructure/unito/docker/training/docker-compose.yaml` with the new hash.
