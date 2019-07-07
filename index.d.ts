export interface FlagsType {
  updateDocs: string;
  u: string | undefined;
  generateHook: boolean;
  version: boolean;
  [name: string]: any;
}

export interface CliOptions {
  showHelp: () => void;
  flags: FlagsType;
}

export interface ValidOperations {
  updateDocs: (x: string) => void;
  generateHook: () => void;
  [name: string]: any;
}
