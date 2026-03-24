function generateDocument(elements) {
  const out = [];

  out.push("# CDBInterface — Call Flow\n");
  out.push(`_Generated from log on ${new Date().toISOString()}_\n`);
  out.push("---\n");

  out.push("## Chronological sequence of method calls\n");
  out.push("| # | Timestamp | Called from file | Method | Consecutive calls | Additional Info |");
  out.push("|---|-----------|-----------------|--------|:-----------------:|-----------------|");

  let rowNum = 0;
  elements.forEach((el) => {
    if (!el.method) return;
    rowNum++;
    const info = el.additionalInfo ? el.additionalInfo.replace(/\r/g, "").trim() : "";
    const repeatCell = el.count > 1 ? `⚠️ x${el.count}` : "";
    out.push(
      `| ${rowNum} | \`${el.timestamp}\` | \`${el.calledByFile}\` | \`${el.class}::${el.method}\` | ${repeatCell} | ${info} |`
    );
  });

  return out.join("\n");
}

module.exports = { generateDocument };
