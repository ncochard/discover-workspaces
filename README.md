# discover-workspaces

Scan a mono-repo to discover all the projects in that mono-repo.

# Utility

Import the utility...

    import { discoverWorkspaces, PackageDetails, DependencyIdentifier, PackageTypes } from "discover-workspaces";

or

    import { workspaceDiscovery, PackageDetails, DependencyIdentifier, PackageTypes } from "discover-workspaces";

    const logger = { error: console.error };
    const discoverWorkspaces = workspaceDiscovery({ logger: console });

Usage...
    
    const cwd = "./path-to-mono-repo";
    const result: PackageDetails[] = discoverWorkspaces({ cwd });

Definition of `PackageDetails`:

    {
        identifier: DependencyIdentifier,
        dependencies: DependencyIdentifier[];
        devDependencies: DependencyIdentifier[];
        peerDependencies: DependencyIdentifier[];
        scripts: string[]; //Names of each script
        directory: string; //Full path of the project
        packageJson: any; // Full JSON of the package.json
    }


Definition of `DependencyIdentifier`:

    {
        name: string,
        version: string,
        type: PackageTypes.WorkspaceRootPackage | PackageTypes.WorkspacePackage | PackageTypes.ExternalPackage,
    },