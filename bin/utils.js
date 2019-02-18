const mapCommands = (cliOptions, options) => {
  const flags = cliOptions.flags;
  const matched = Object.keys(flags)
	.map(flag => flags[flag] && flag)
	.filter(flag => options[flag]);
  flags.hasOwnProperty('u') || flags.hasOwnProperty('updateDocs')
  ? options.updateDocs(flags.u || flags.updateDocs)
  : options[matched]
    ? options[matched]()
    : cliOptions.showHelp();
}

module.exports = {
  mapCommands,
}
