/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type QueryOptions = {
    id: string;
    layerDepth: number;
    dependencyDepth: number;
    onlyInternalRelations?: boolean;
    onlyExternalRelations?: boolean;
    showDependencies?: boolean;
    showDependents?: boolean;
    dependencyRange?: {
max?: number;
min?: number;
};
    dependentRange?: {
max?: number;
min?: number;
};
};