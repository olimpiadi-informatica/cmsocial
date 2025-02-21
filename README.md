# CMSocial

A web application that builds a social coding platform used by
https://training.olinfo.it/

Currently, it heavily depends on [CMS](https://github.com/cms-dev/cms).

## Frontend

The frontend is based on [NextJS](https://nextjs.org/),
[TailwindCSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/).

### Installation

Clone the repository and run `yarn install` to install the dependencies.

### Development

Run `yarn dev` to start the development server.

Before committing, make sure to run `yarn lint` to check for linting errors.

If you've added or changed text, you also need to update the translations:

1. Run `yarn translate` to extract the new messages.
2. Update `src/locales/en/messages.po` with the new translation.

## Backend (and old frontend)

Run `make` to build the web application (`make ONLINE=1` if you don't need local
copies of the used libraries). Then run `python ./setup.py install`.

Create a configuration file `config/cmsocial.ini` (you can find an example in
`config/cmsocial.ini.sample`) and install it by running  `cp config/cmsocial.ini
/usr/local/etc/cmsocial.ini` as root.

Add service `PracticeWebServer` to `/usr/local/etc/cms.conf` in the
`core_services` section.

### Database creation instructions

Here are the needed steps (after installing both cms and cmsocial). You'll need
an empty DB. If you initialized it when installing cms, clear it with
`cmsDropDB` (obviously, you will loose all the data by doing so).

    python -c "import cmsocial.db; from cms.db import metadata; metadata.create_all()"
    psql cmsdb -U cmsuser < sql_scripts/create_triggers.sql

### Update for multicontest

Run the following:

    python -c "import cmsocial.db; from cms.db import metadata; metadata.create_all()"
    psql cmsdb -U cmsuser < sql_updaters/multicontest_update.sql

An analog procedure works for other updates. Note: update scripts consist of a
transaction ending with ROLLBACK - to actually run the script, you should change
that to COMMIT.

Also note that if you installed cmsocial fom scratch, you don't need to run the
updates.

# Deployment

Read instructions at:
https://github.com/olimpiadi-informatica/infrastructure?tab=readme-ov-file
