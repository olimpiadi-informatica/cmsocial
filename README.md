# CMSocial

A web application that builds a social coding platform used by
https://training.olinfo.it/

Currently, it heavily depends on [CMS](https://github.com/cms-dev/cms).

The backend (in the `backend/` folder of this repository) is written in Python +
SQLAlchemy, structured similarly to CMS and using CMS under the hood. The
frontend is in TypeScript and it's based on [NextJS](https://nextjs.org/),
[TailwindCSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/).

## Run a local development instance

Make sure you have [docker](https://docs.docker.com/get-started/get-docker/)
installed. Clone this repository with `--recursive` and then run:

```
$ docker compose -f docker-compose.dev.yml up --build dev
```

The command will create a few containers:

- **cmsocial-dev_db-1** - Postgres database instance.
- **cmsocial-dev_cms-1** - CMS instance (exposed as `/admin` via the proxy).
- **cmsocial-dev_backend-1** - Python backend (exposed as `/api` via the proxy).
- **cmsocial-dev_frontend-1** - NextJS frontend (exposed as `/` via the proxy).
- **cmsocial-dev_old_frontend-1** - _(Deprecated)_ AngularJS frontend (exposed
  as `/old` via the proxy).
- **cmsocial-dev-1** - Nginx proxy instance, running on localhost:8000.

When the backend runs for the first time, it will call `cmsocialInitDevDB` to
initialize the database with some sample data, among which: an admin account
with username `admin` and password `admin`, and a user account with username
`test` and password `password`.

You can access your local instance by visiting http://dev.olinfo.it:8000/. Don't
use `localhost:8000` directly, or your browser will complain about CORS.

### Deleting the database

If you want to start fresh with a clean database, just delete the container
with:

```
docker rm -f cmsocial-dev_db-1
```

And then restart the other containers (mostly the backend one, to re-run
`cmsocialInitDevDB`).

### Avoid running out of disk space

When you make changes and run multiple times the docker compose command to spin
up the containers, it's possible that docker will accumulate many unused
containers / images. You can prune old containers / images by running the
following command periodically:

```
docker system prune
```

## Run the frontend only

If you just want to work on the frontend, connecting to the production backend
which runs on https://training.olinfo.it, you can avoid using docker.

Make sure you can run `yarn` on your system, either by going through the steps
to [install it](https://yarnpkg.com/) or by simply calling `npx yarn` everytime
you need yarn (in this case you only need to have a recent version of `npm`
installed).

Then you can simply run `yarn dev` (or `npx yarn dev`) to start the development
server on http://dev.olinfo.it:3000/. Note that the port (3000) is different
from the one used by the docker instructions above (8000).

## Contributing

Before committing, make sure to run `yarn lint` (or `npx yarn lint`) to check
for linting errors.

If you've added or changed text, you also need to update the translations:

1. Run `yarn translate` (or `npx yarn translate`) to extract the new messages.
2. Update `src/locales/en/messages.po` with the new translation.

# Deployment

Read instructions at:
https://github.com/olimpiadi-informatica/infrastructure?tab=readme-ov-file
