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

### WIP

- [ ] Allow "create" to directly create the directory for the new newsletter
- [ ] Let build suggest the last couple directories created
