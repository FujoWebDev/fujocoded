import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { Volume, createFsFromVolume} from "memfs";
import path from "node:path"
import fs from "node:fs/promises";

const DIRECTORY_NAME = '/';
const REPO_URL = 'https://github.com/FujoWebDev/contributors.git';
const TARGET_DIRECTORIES = ["contributors"];
const DESTINATION_PATH = "../src/content"

const volume = new Volume();
const memoryFilesystem = createFsFromVolume(volume);

await git.clone({
    fs: memoryFilesystem,
    http,
    dir: DIRECTORY_NAME, 
    url: REPO_URL,
    noCheckout: true,
    depth: 1
});

const saveGitBlob = async (params: { path: string; content:  Uint8Array}) => {
   const destinationPath = path.resolve(import.meta.dirname, DESTINATION_PATH, params.path);
   await fs.mkdir(path.dirname(destinationPath), {recursive: true});
   await fs.writeFile(destinationPath, params.content);
}

await git.walk({
    fs: memoryFilesystem,
    dir: DIRECTORY_NAME, 
    trees: [git.TREE({ref: "main"})],
    map: async (filepath, [ head ]) => {
        if (!head) {
            throw new Error("No head found")
        }
        const shouldDownload = TARGET_DIRECTORIES.some((dir) => filepath.startsWith(path.join(dir, "")));

        if (!shouldDownload || (await head.type()) !== "blob") {
            return;
        }

        const content = await head.content();
        if (!content) {
            return;
        }

        await saveGitBlob({
            path: filepath,
            content 
        })
    }
});