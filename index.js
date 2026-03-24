#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");
const { Command } = require("commander");
const { readLogFile } = require("./reader");
const { collapseConsecutiveDuplicates } = require("./parser");
const { generateDocument } = require("./generator");
const defaults = require("./config");

const program = new Command();

program
  .name("log-parser")
  .description("Parse a CDBInterface .log file and generate a Markdown flow document")
  .argument("<logfile>", "path to the .log file to parse")
  .option("-s, --start-line <n>", "line number to start parsing from (1-based)", String(defaults.startToReadFromLine))
  .option("-l, --log-level <level>", "log level tag to remove (e.g. [info])", defaults.logLevelToRemove)
  .option("-c, --classes <list>", "comma-separated list of classes to include", defaults.logsToKeepMustInclude.join(","))
  .option("-o, --output <dir>", "output directory for the .md file", path.join(process.cwd(), "output"))
  .parse(process.argv);

const opts = program.opts();
const [logFilePath] = program.args;
const inputBaseName = path.basename(logFilePath, path.extname(logFilePath));

const config = {
  startToReadFromLine: parseInt(opts.startLine, 10) || 1,
  removeInfoData: true,
  logLevelToRemove: opts.logLevel,
  logsToKeepMustInclude: opts.classes.split(",").map((c) => c.trim()),
};

async function main() {
  const parsedLogElements = await readLogFile(path.resolve(logFilePath), config);
  const collapsedElements = collapseConsecutiveDuplicates(parsedLogElements);

  const document = generateDocument(collapsedElements);

  const outputPath = path.resolve(opts.output, `flows_${inputBaseName}.md`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, document, "utf8");

  console.log(`Document written to ${outputPath} (${collapsedElements.length} entries, ${parsedLogElements.length} raw)`);
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});

