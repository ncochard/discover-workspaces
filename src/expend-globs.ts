import glob from "glob";
import { join } from "path";

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

export function mergeWorkspacePaths(paths: string[]): string[] {
    return paths.reduce((agg: string[], newPath: string) => {
        const result = agg.filter(r => !newPath.startsWith(r));
        result.push(newPath);
        return result;
    }, []);
}
