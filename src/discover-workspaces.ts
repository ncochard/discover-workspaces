import { expendGlobs, mergeWorkspacePaths } from "./expend-globs";
import { readPackageJson, readPackagesJson } from "./read-package-json";
import { sortPackageIdentifier, sortPackage } from "./sort";
import {
    DependencyIdentifier,
    DiscoverWorkspacesInput,
    PackageDetails,
    PackageIdentifier,
    PackageTypes,
} from "./types";

export async function discoverWorkspaces(input: DiscoverWorkspacesInput): Promise<PackageDetails[]> {
    const rootPkg = await readPackageJson(input.cwd);
    if (!rootPkg) {
        return [];
    }
    const globs = rootPkg.packageJson.workspaces || [];
    const folders = mergeWorkspacePaths(await expendGlobs(input.cwd, globs));
    const packages: PackageDetails<PackageIdentifier>[] = await readPackagesJson(folders);
    packages.push(rootPkg);
    const workspacePackageNames = packages.map(pkg => pkg.identifier.name);
    const isWorkspacePackage = (name: string): boolean => workspacePackageNames.includes(name);
    const getType = (dep: PackageIdentifier): PackageTypes => {
        if (dep.name === rootPkg.identifier.name) {
            return PackageTypes.WorkspaceRootPackage;
        }
        return isWorkspacePackage(dep.name) ? PackageTypes.WorkspacePackage : PackageTypes.ExternalPackage;
    };
    const makeIdentifier = (dep: PackageIdentifier): DependencyIdentifier => ({
        ...dep,
        type: getType(dep),
    });
    return packages
        .map(
            (pkg: PackageDetails<PackageIdentifier>): PackageDetails<DependencyIdentifier> => ({
                ...pkg,
                identifier: makeIdentifier(pkg.identifier),
                dependencies: pkg.dependencies.map(makeIdentifier).sort(sortPackageIdentifier),
                devDependencies: pkg.devDependencies.map(makeIdentifier).sort(sortPackageIdentifier),
                peerDependencies: pkg.peerDependencies.map(makeIdentifier).sort(sortPackageIdentifier),
            })
        )
        .sort(sortPackage);
}
