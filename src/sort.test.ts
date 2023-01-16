import { sortPackageIdentifier, sortPackage } from "./sort";
import { PackageDetails, PackageIdentifier } from "./types";

const id1: PackageIdentifier = {
    name: "aaa",
    version: "1",
};

const id2: PackageIdentifier = {
    name: "bbb",
    version: "1",
};

const id3: PackageIdentifier = {
    name: "bbb",
    version: "1",
};

const pkg1: PackageDetails<PackageIdentifier> = {
    identifier: id1,
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
    directory: "",
    packageJson: {},
    scripts: [],
};

const pkg2: PackageDetails<PackageIdentifier> = {
    identifier: id2,
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
    directory: "",
    packageJson: {},
    scripts: [],
};

const pkg3: PackageDetails<PackageIdentifier> = {
    identifier: id3,
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
    directory: "",
    packageJson: {},
    scripts: [],
};

describe("sortPackageIdentifier", () => {
    it("works for basic list", async () => {
        const input = [id3, id2, id1];
        const actual = input.sort(sortPackageIdentifier);
        expect(actual).toEqual([id1, id2, id3]);
    });
});

describe("sortPackage", () => {
    it("works for basic list", async () => {
        const input = [pkg3, pkg2, pkg1];
        const actual = input.sort(sortPackage);
        expect(actual).toEqual([pkg1, pkg2, pkg3]);
    });
});
