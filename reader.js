const fs = require("fs/promises");
const { parseLogLine } = require("./parser");

async function readLogFile(logFilePath, config) {
  const { startToReadFromLine, removeInfoData, logLevelToRemove, logsToKeepMustInclude } = config;

  const content = await fs.readFile(logFilePath, "utf8");
  const lines = content.split("\n").slice(startToReadFromLine - 1);

  if (removeInfoData) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(logLevelToRemove)) {
        lines.splice(i, 1);
        i--;
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    if (!logsToKeepMustInclude.some((log) => lines[i].includes(log))) {
      lines.splice(i, 1);
      i--;
    }
  }

  return lines.filter((l) => l.trim()).map(parseLogLine);
}

module.exports = { readLogFile };
