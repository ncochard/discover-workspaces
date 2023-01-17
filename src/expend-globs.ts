import glob from "glob";
import { join, sep } from "path";

export async function expendGlob(cwd: string, wildcard: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        glob(wildcard, { nodir: false, cwd }, function (er, files) {
            if (er) {
                reject(er);
            } else {
                resolve(files.map(p => join(cwd, p)));
            }
        });
    });
}

export async function expendGlobs(cwd: string, globs: string[]): Promise<string[]> {
    const result: string[][] = await Promise.all(globs.map(wildcard => expendGlob(cwd, wildcard)));
    return result.reduce((agg: string[], current: string[]): string[] => [...agg, ...current], [] as string[]);
}

export function isSubFolderOf(path1: string, path2: string): boolean {
    const parts1 = path1.split(sep);
    const parts2 = path2.split(sep);
    if (parts1.length <= parts2.length) {
        return false;
    }
    for (let index = 0; index < parts2.length; index++) {
        if (parts1[index] !== parts2[index]) {
            return false;
        }
    }
    return true;
}

export function mergeWorkspacePaths(paths: string[]): string[] {
    return paths.reduce((agg: string[], newPath: string) => {
        const result = agg.filter(r => !isSubFolderOf(newPath, r));
        result.push(newPath);
        return result;
    }, []);
}
