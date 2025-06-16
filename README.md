# FujoCoded Website

This repo contains the code for [www.fujocoded.com](https://www.fujocoded.com).

## Running this website locally

You can run this website with `npm run dev`.

## Newsletter Generation Script

To create a new newsletter entry run:

```
npm run --workspace scripts start create
```

Once all the blocks are filled run this to generate the various entries:

```
npm run --workspace scripts start build
```

If you want to continue generating as you edit, you can run the script in watch mode

```
npm run --workspace scripts start watch
```

### WIP

- [ ] Allow "create" to directly create the directory for the new newsletter
- [ ] MDX Plugin: `[Summer Jobs:](#)` => `<a id="summer-jobs" href="#summer-jobs"> Summer Jobs:</a>`
