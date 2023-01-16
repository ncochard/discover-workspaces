import { PackageDetails, PackageIdentifier } from "./types";

export function sortPackageIdentifier<TDependencyIdentifier extends PackageIdentifier>(
    val1: TDependencyIdentifier,
    val2: TDependencyIdentifier
): number {
    if (val1.name === val2.name) {
        return 0;
    }
    if (val1.name < val2.name) {
        return -1;
    }
    return 1;
}

export function sortPackage<TDependencyIdentifier extends PackageIdentifier>(
    val1: PackageDetails<TDependencyIdentifier>,
    val2: PackageDetails<TDependencyIdentifier>
): number {
    return sortPackageIdentifier<TDependencyIdentifier>(val1.identifier, val2.identifier);
}
