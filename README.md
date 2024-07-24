2-player version of the Pokémon TCG tabletop app.
Built with Svelte 4 + SvelteKit.

**[Live Demo](https://pvp-tabletop-27e7a.ondigitalocean.app)**

## Getting Started
To run it locally, download the repository, run `npm ci` to install dependencies, rename `.env.example` to `.env.development`, and then run `npm run dev`.

To build the app for deployment, run `npm run build`. You can customize the build directory by adding a `.env` file with a BUILD_DIR property.

## Server
The server-side code for passing actions between the two players is very simple. You can find all the necessary files [here](https://gist.github.com/link--11/b568ca86faca5dd9cf0017927d90451d).
If you don't require any custom actions that are not in the current version, you can use the live demo server during development.