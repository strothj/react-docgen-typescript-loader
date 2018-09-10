import typescript from "typescript";
import { ExperimentalLanguageServiceProvider } from "./types";
import path from "path";

type TSInstance = NonNullable<
  ReturnType<ExperimentalLanguageServiceProvider>["instance"]
>;
type TSFile = NonNullable<TSInstance["modifiedFiles"]> extends Map<
  string,
  infer U
>
  ? U
  : void;

/**
 * Either add file to the overall files cache or update it in the cache when the file contents have changed
 * Also add the file to the modified files
 */
export function updateFileInCache(
  filePath: string,
  contents: string,
  instance: TSInstance,
) {
  let fileWatcherEventKind: typescript.FileWatcherEventKind | undefined;
  // Update file contents
  let file = instance.files.get(filePath);
  if (file === undefined) {
    file = instance.otherFiles.get(filePath);
    if (file !== undefined) {
      instance.otherFiles.delete(filePath);
      instance.files.set(filePath, file);
    } else {
      if (instance.watchHost) {
        fileWatcherEventKind = instance.compiler.FileWatcherEventKind.Created;
      }
      file = { version: 0 };
      instance.files.set(filePath, file);
    }
    instance.changedFilesList = true;
  }

  if (instance.watchHost && contents === undefined) {
    fileWatcherEventKind = instance.compiler.FileWatcherEventKind.Deleted;
  }

  if (file.text !== contents) {
    file.version += 1;
    file.text = contents;
    instance.version! += 1;
    if (instance.watchHost && fileWatcherEventKind === undefined) {
      fileWatcherEventKind = instance.compiler.FileWatcherEventKind.Changed;
    }
  }

  if (instance.watchHost && fileWatcherEventKind !== undefined) {
    instance.hasUnaccountedModifiedFiles = true;
    instance.watchHost.invokeFileWatcher(filePath, fileWatcherEventKind);
    instance.watchHost.invokeDirectoryWatcher(path.dirname(filePath), filePath);
  }

  // push this file to modified files hash.
  if (instance.modifiedFiles === null || instance.modifiedFiles === undefined) {
    instance.modifiedFiles = new Map<string, TSFile>();
  }
  instance.modifiedFiles.set(filePath, file);
  return file.version;
}
