# FujoCoded Website

This repo contains the code for [www.fujocoded.com](https://www.fujocoded.com).

## Running this website locally

You can run this website with `npm run dev`.

## Newsletter Generation Script

### Create a new newsletter

```
npm run newsletter:create
```

OR

```
npm run --workspace scripts start create
```

### Generate content for a newsletter

Once all the blocks are filled, generate the final versions with:

```
npm run newsletter:build
```

OR

```
npm run --workspace scripts start build
```

### Generate content for a newsletter (watch mode)

If you want to continue generating as you edit, you can run the script in watch mode:

```
npm run newsletter:watch
```

OR

```
npm run --workspace scripts start watch
```

### WIP

- [ ] MDX Plugin: `[Summer Jobs:](#)` => `<a id="summer-jobs" href="#summer-jobs"> Summer Jobs:</a>`
