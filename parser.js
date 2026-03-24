const logElement = {
  timestamp: "",
  class: "",
  method: "",
  calledByFile: "",
  calledInLine: "",
  additionalInfo: "",
  count: 1,
};

function parseLogLine(line) {
  const match = line.match(
    /^(\d{2}:\d{2}:\d{2}\.\d+).*\] - ([^:]+)::(\S+)\s+is called by FILE\s+(\S+)\s+LINE\s+(\d+)(.*)/
  );

  if (!match) {
    return {
      ...logElement,
      additionalInfo: line.trim(),
    };
  }

  const [, timestamp, className, methodName, calledByFile, calledInLine, additionalInfo] = match;

  return {
    ...logElement,
    timestamp: timestamp.trim(),
    class: className.trim(),
    method: methodName.trim(),
    calledByFile: calledByFile.trim(),
    calledInLine: calledInLine.trim(),
    additionalInfo: additionalInfo.trim(),
  };
}

// Collapses consecutive calls that are identical in class + method + calledByFile.
// A duplicate is only flagged when those 3 fields all match AND the call is parsed (method is not empty).
function collapseConsecutiveDuplicates(elements) {
  const result = [];

  for (const el of elements) {
    const prev = result[result.length - 1];

    const isDuplicate =
      prev &&
      el.method && // must be a parsed line
      prev.method && // prev must also be parsed
      el.class === prev.class &&
      el.method === prev.method &&
      el.calledByFile === prev.calledByFile; // same caller file — different file = different context

    if (isDuplicate) {
      prev.count += 1;
    } else {
      result.push({ ...el, count: 1 });
    }
  }

  return result;
}

module.exports = { parseLogLine, collapseConsecutiveDuplicates };
