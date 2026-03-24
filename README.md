# log-parser

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

CLI tool that parses a `.log` file detects consecutive duplicate calls (technical debt), and generates a chronological Markdown document to help the team understand the interaction flow.

---

## Requirements

- Node.js >= 18
- npm

---

## Installation

Clone or copy the project folder, then install dependencies:

```bash
npm install
```

### Optional: install globally

If you want to call `log-parser` from any folder on your machine without `node index.js`:

```bash
npm install -g .
```

After that you can use `log-parser` directly:

```bash
log-parser myfile.log
```

---

## Usage

```bash
node index.js <logfile> [options]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `<logfile>` | **Required.** Path to the `.log` file to parse. |

### Options

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--start-line <n>` | `-s` | `200` | Line number (1-based) from which to start parsing. Lines before this are ignored. |
| `--log-level <level>` | `-l` | `[info]` | Log level tag to strip out (e.g. `[info]`, `[debug]`). |
| `--classes <list>` | `-c` | `<class_name>` | Comma-separated list of class names to include. Only log lines containing at least one of these will be kept. |
| `--output <dir>` | `-o` | `./output` | Directory where the output Markdown file will be written. The filename is derived automatically from the input: `flows_<inputname>.md`. The folder is created automatically if it doesn't exist. |
| `--help` | `-h` | | Display help. |

---

## Examples

**Minimal — parse using all defaults:**
```bash
node index.js input/ILay_2026-03-24.log
```

**Start from a specific line:**
```bash
node index.js input/ILay_2026-03-24.log -s 450
```

**Include multiple classes:**
```bash
node index.js input/ILay_2026-03-24.log -c "CDBInterface,CDBLayer"
```

**Custom output directory:**
```bash
node index.js input/ILay_2026-03-24.log -o ./docs
```

**Everything custom:**
```bash
node index.js input/ILay_2026-03-24.log -s 100 -l "[debug]" -c "CDBInterface" -o ./output/flows.md
```

---

## Output

The tool writes a Markdown file (default: `output/flows.md`) with a single chronological table of all matching method calls:

| # | Timestamp | Called from file | Method | Consecutive calls | Additional Info |
|---|-----------|-----------------|--------|:-----------------:|-----------------|
| 1 | `09:44:32.587` | `DBInterface.cpp` | `CDBInterface::PrevSessionId()` | ⚠️ x5 | |
| 2 | `09:44:45.773` | `DBInterfaceNSDB30.cpp` | `CDBInterface::GetLayoutStatusName()` | | with statusInt 13 |

### Columns

- **#** — sequential row number (after collapsing duplicates)
- **Timestamp** — time extracted from the log line
- **Called from file** — the source file that triggered the call
- **Method** — `ClassName::methodName()` as logged
- **Consecutive calls** — if the same method was called N times in a row from the same file, this shows `⚠️ xN` to highlight technical debt; empty otherwise
- **Additional Info** — any extra context logged after the `LINE <n>` part (e.g. parameter values)

---

## Project structure

```
├── index.js       # CLI entry point — parses arguments and orchestrates the pipeline
├── config.js      # Default values for all options
├── reader.js      # Reads and filters the .log file, returns raw parsed array
├── parser.js      # parseLogLine() + collapseConsecutiveDuplicates()
├── generator.js   # Generates the Markdown document from the element array
├── input/         # Put your .log files here (or pass any path as argument)
└── output/        # Generated .md files land here by default
```

---

## License

MIT © [Jacopo Luri](https://github.com/JacopoLuri2nd)
