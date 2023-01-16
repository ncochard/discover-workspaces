import { readFile, access } from "fs/promises";
import { constants } from "fs";
import { join } from "path";
import { Logger, PackageDetails, PackageIdentifier } from "./types";

type Dependencies = {
    [name: string]: string;
};

type Scripts = {
    [name: string]: string;
};

function parseDependencies(deps: Dependencies | undefined): PackageIdentifier[] {
    if (!deps) {
        return [];
    }
    return Object.keys(deps).map((name: string) => ({ name, version: deps[name] }));
}

function parseScripts(deps: Scripts | undefined): string[] {
    if (!deps) {
        return [];
    }
    return Object.keys(deps);
}

export interface ReadPackageJsonDependencies {
    logger: Logger;
}

export const readPackageJson =
    ({ logger }: ReadPackageJsonDependencies) =>
    async (directory: string): Promise<PackageDetails<PackageIdentifier> | undefined> => {
        const file = join(directory, "package.json");
        try {
            await access(file, constants.R_OK);
        } catch (e) {
            logger.error(`Cannot access "${file}".`);
            logger.error(e);
            return undefined;
        }
        const packageStr = await readFile(file);
        const packageJson = JSON.parse(packageStr.toString());
        const scripts = parseScripts(packageJson.scripts);
        const dependencies = parseDependencies(packageJson.dependencies);
        const devDependencies = parseDependencies(packageJson.devDependencies);
        const peerDependencies = parseDependencies(packageJson.peerDependencies || {});
        return {
            identifier: {
                name: packageJson.name,
                version: packageJson.version,
            },
            scripts,
            packageJson,
            dependencies,
            devDependencies,
            peerDependencies,
            directory,
        };
    };

export const readPackagesJson = (deps: ReadPackageJsonDependencies) => {
    const rpj = readPackageJson(deps);
    return async (paths: string[]): Promise<PackageDetails<PackageIdentifier>[]> =>
        (await Promise.all(paths.map(rpj))).filter(p => p !== undefined) as PackageDetails[];
};
