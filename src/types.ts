export interface Logger {
    error: (message: unknown) => void;
}

export interface WorkspaceDiscoveryDependencies {
    logger: Logger;
}

export interface DiscoverWorkspacesInput {
    cwd: string;
}

export enum PackageTypes {
    WorkspaceRootPackage,
    WorkspacePackage,
    ExternalPackage,
}

export interface PackageIdentifier {
    name: string;
    version: string;
}

export interface DependencyIdentifier extends PackageIdentifier {
    type: PackageTypes;
}

export interface PackageDetails<TDependencyIdentifier extends PackageIdentifier = DependencyIdentifier> {
    identifier: TDependencyIdentifier;
    dependencies: TDependencyIdentifier[];
    devDependencies: TDependencyIdentifier[];
    peerDependencies: TDependencyIdentifier[];
    scripts: string[];
    directory: string;
    packageJson: any;
}
