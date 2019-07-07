import { CliOptions, FlagsType, ValidOperations } from "../index";

const mapCommands = (
  cliOptions: CliOptions,
  options: ValidOperations
): void => {
  const flags: FlagsType = cliOptions.flags;
  const matched: string[] = Object.keys(flags)
    .map((flag: string) => flags[flag] && flag)
    .filter((flag: string) => options[flag]);
  const isValidInstruction: boolean = !!matched.length;
  const temp = isValidInstruction
    ? options[matched[0]]()
    : cliOptions.showHelp();
  flags.hasOwnProperty("u") || flags.hasOwnProperty("updateDocs")
    ? options.updateDocs(flags.u || flags.updateDocs)
    : temp;
};

export default {
  mapCommands
};
