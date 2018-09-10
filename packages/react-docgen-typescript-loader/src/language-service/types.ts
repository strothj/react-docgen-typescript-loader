import { Program } from "typescript";

export type ExperimentalLanguageServiceProvider = typeof import("react-docgen-typescript-language-service").getLanguageServiceInstance;

export type ProgramProvider = () => Program;
