import path, { join } from "path";
import { DependencyIdentifier, PackageDetails, PackageTypes } from "./types";
import { discoverWorkspaces } from "./discover-workspaces";

describe("discoverWorkspaces", () => {
    it("works for our main package.json", async () => {
        const cwd = join(__dirname, "..");
        const packages = await discoverWorkspaces({ cwd });
        expect(packages).toBeDefined();
        if (!packages) {
            throw new Error("Cannot be null");
        }
        expect(packages.length).toBe(1);
        const pkg = packages[0];
        expect(pkg.identifier.name).toBe("discover-workspaces");
        expect(pkg.dependencies.map(d => d.name)).toContain("commander");
        expect(pkg.devDependencies.map(d => d.name)).toContain("eslint");
        expect(pkg.scripts).toContain("build");
    });
    it("works for mono-repo test project", async () => {
        const cwd = join(__dirname, "../test-projects/no-mono-repo");
        const packages = await discoverWorkspaces({ cwd });
        expect(packages).toBeDefined();
        if (!packages) {
            throw new Error("Cannot be null");
        }
        expect(packages.length).toBe(1);
        const pkg = packages[0];
        expect(pkg.identifier.name).toBe("no-mono-repo");
        expect(pkg.dependencies).toEqual([{ name: "lodash", version: "4.17.21", type: PackageTypes.ExternalPackage }]);
        expect(pkg.devDependencies).toEqual([
            { name: "rimraf", version: "^3.0.2", type: PackageTypes.ExternalPackage },
        ]);
        expect(pkg.peerDependencies).toEqual([{ name: "react", version: "14", type: PackageTypes.ExternalPackage }]);
        expect(pkg.scripts).toEqual([]);
    });
    const defaults = {
        dependencies: [],
        devDependencies: [],
        peerDependencies: [],
        scripts: [],
    };
    it("works for sample-mono-repo test project", async () => {
        const cwd = join(__dirname, "../test-projects/sample-mono-repo");
        const packages = await discoverWorkspaces({ cwd });
        expect(packages).toBeDefined();
        if (!packages) {
            throw new Error("Cannot be null");
        }
        expect(packages.map(({ directory, ...rest }) => rest)).toMatchSnapshot();
        expect(packages.length).toBe(8);
        const pkgRoot = packages.find(p => p.identifier.name === "sample-mono-repo");
        expectRootPackage(pkgRoot);
        const pkgUtility = packages.find(p => p.identifier.name === "utility");
        expectPackage(pkgUtility, {
            ...defaults,
            identifier: { name: "utility", version: "1.0.0", type: PackageTypes.WorkspacePackage },
            directory: join(__dirname, "../test-projects/sample-mono-repo", "packages/utilities/utility"),
        });
        const pkgTop = packages.find(p => p.identifier.name === "top-package");
        expectPackage(pkgTop, {
            ...defaults,
            identifier: { name: "top-package", version: "1.0.0", type: PackageTypes.WorkspacePackage },
            directory: join(__dirname, "../test-projects/sample-mono-repo", "packages/top-package"),
            dependencies: [
                { name: "package-1", type: PackageTypes.WorkspacePackage, version: "1.0.0" },
                { name: "package-2", type: PackageTypes.WorkspacePackage, version: "1.0.0" },
            ],
        });
        const pkgLeaf = packages.find(p => p.identifier.name === "package-leaf");
        expectPackage(pkgLeaf, {
            ...defaults,
            identifier: { name: "package-leaf", version: "1.0.0", type: PackageTypes.WorkspacePackage },
            directory: join(__dirname, "../test-projects/sample-mono-repo", "packages/package-leaf"),
            dependencies: [{ name: "lodash", type: PackageTypes.ExternalPackage, version: "^4.17.21" }],
        });
        const pkg1 = packages.find(p => p.identifier.name === "package-1");
        expectPackage(pkg1, {
            ...defaults,
            identifier: { name: "package-1", version: "1.0.0", type: PackageTypes.WorkspacePackage },
            directory: join(__dirname, "../test-projects/sample-mono-repo", "packages/package-1"),
            dependencies: [
                { name: "lib1", type: PackageTypes.WorkspacePackage, version: "1.0.0" },
                { name: "utility", type: PackageTypes.WorkspacePackage, version: "1.0.0" },
            ],
        });
        const pkg2 = packages.find(p => p.identifier.name === "package-2");
        expectPackage(pkg2, {
            ...defaults,
            identifier: { name: "package-2", version: "1.0.0", type: PackageTypes.WorkspacePackage },
            directory: join(__dirname, "../test-projects/sample-mono-repo", "packages/package-2"),
            dependencies: [
                { name: "lib2", type: PackageTypes.WorkspacePackage, version: "1.0.0" },
                { name: "package-leaf", type: PackageTypes.WorkspacePackage, version: "1.0.0" },
            ],
        });
        const lib1 = packages.find(p => p.identifier.name === "lib1");
        expectPackage(lib1, {
            ...defaults,
            identifier: { name: "lib1", version: "1.0.0", type: PackageTypes.WorkspacePackage },
            directory: join(__dirname, "../test-projects/sample-mono-repo", "packages/libs/lib1"),
        });
        const lib2 = packages.find(p => p.identifier.name === "lib2");
        expectPackage(lib2, {
            ...defaults,
            identifier: { name: "lib2", version: "1.0.0", type: PackageTypes.WorkspacePackage },
            directory: join(__dirname, "../test-projects/sample-mono-repo", "packages/libs/lib2"),
        });
    });
});

function expectRootPackage(pkg: PackageDetails<DependencyIdentifier> | undefined) {
    const expectation: Omit<PackageDetails<DependencyIdentifier>, "packageJson"> = {
        identifier: { name: "sample-mono-repo", version: "1.0.0", type: PackageTypes.WorkspaceRootPackage },
        dependencies: [
            {
                name: "lodash",
                version: "4.17.21",
                type: PackageTypes.ExternalPackage,
            },
        ],
        devDependencies: [
            {
                name: "rimraf",
                version: "^3.0.2",
                type: PackageTypes.ExternalPackage,
            },
        ],
        directory: path.join(__dirname, "../test-projects/sample-mono-repo"),
        peerDependencies: [],
        scripts: [],
    };
    expectPackage(pkg, expectation);
}

function expectPackage(
    pkg: PackageDetails<DependencyIdentifier> | undefined,
    expectation: Omit<PackageDetails<DependencyIdentifier>, "packageJson">
) {
    expect(pkg).toBeDefined();
    if (!pkg) {
        throw new Error("Package should be defined");
    }
    expect(extractMainBits(pkg)).toEqual(expectation);
}

function extractMainBits(
    pkg: PackageDetails<DependencyIdentifier>
): Omit<PackageDetails<DependencyIdentifier>, "packageJson"> {
    const { dependencies, devDependencies, directory, identifier, peerDependencies, scripts } = pkg;
    return { dependencies, devDependencies, directory, identifier, peerDependencies, scripts };
}
