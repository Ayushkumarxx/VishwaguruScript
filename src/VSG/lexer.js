import { Tokens } from "./helper.js";

// Utility Functions
const isAlpha = (char) => /[a-zA-Z_]/.test(char);
const isDigit = (char) => /[0-9]/.test(char);
const isWhitespace = (char) => /\s/.test(char);

function tokenize(input) {
  const tokens = [];
  let current = 0;

  const createError = (type, message, position, context) => ({
    success: false,
    error: { type, message, position, context },
  });

  while (current < input.length) {
    let char = input[current];

    // Skip whitespace
    if (isWhitespace(char)) {
      current++;
      continue;
    }

    // Skip single-line comments
    if (char === "/" && input[current + 1] === "/") {
      current += 2;
      while (current < input.length && input[current] !== "\n") current++;
      continue;
    }

    // Skip multi-line comments
    if (char === "/" && input[current + 1] === "*") {
      current += 2;
      while (current < input.length - 1) {
        if (input[current] === "*" && input[current + 1] === "/") {
          current += 2;
          break;
        }
        current++;
      }
      // If we reached the end without closing the comment
      if (current >= input.length - 1) {
        return createError(
          "UNTERMINATED_COMMENT",
          "Unterminated multi-line comment",
          current - 1,
          "Comment started with '/*' but never closed with '*/'"
        );
      }

      continue; // Skip comment and move on
    }

    // String Literals (supporting escape sequences)
    if (char === '"' || char === "'") {
      let quoteType = char;
      let value = "";
      current++; // Skip opening quote

      while (current < input.length && input[current] !== quoteType) {
        if (input[current] === "\\" && current + 1 < input.length) {
          current++;
          const escapeChar = input[current];
          const escapeMap = {
            n: "\n",
            t: "\t",
            r: "\r",
            "\\": "\\",
            '"': '"',
            "'": "'",
          };
          value += escapeMap[escapeChar] ?? escapeChar;
        } else {
          value += input[current];
        }
        current++;
      }

      if (current >= input.length) {
        return createError(
          "UNTERMINATED_STRING",
          "Unterminated string literal",
          current - value.length - 1,
          `String started with '${quoteType}' but never closed`
        );
      }

      current++; // Skip closing quote
      tokens.push({ type: "STRING", value });
      continue;
    }

    // Number literals (int and float support)
    if (isDigit(char) || (char === "." && isDigit(input[current + 1]))) {
      let value = "";
      let hasDecimal = false;
      let start = current;

      if (char === ".") {
        value += char;
        hasDecimal = true;
        current++;
      }

      while (current < input.length) {
        const ch = input[current];

        if (isDigit(ch)) {
          value += ch;
        } else if (ch === ".") {
          if (hasDecimal) {
            return createError(
              "INVALID_NUMBER_FORMAT",
              "Number contains multiple decimal points",
              start,
              `Invalid number '${value}${ch}' - multiple decimal points not allowed`
            );
          }

          if (isDigit(input[current + 1])) {
            value += ch;
            hasDecimal = true;
          } else {
            return createError(
              "INVALID_DECIMAL_FORMAT",
              "Decimal point must be followed by digits",
              current,
              `Number '${value}.' is incomplete`
            );
          }
        } else {
          break;
        }

        current++;
      }

      if (value === "." || value === "") {
        return createError(
          "INVALID_NUMBER_FORMAT",
          "Standalone decimal point or empty number is not valid",
          start,
          "Invalid number format"
        );
      }

      const parsedValue = hasDecimal ? parseFloat(value) : parseInt(value);
      tokens.push({
        type: hasDecimal ? "FLOAT" : "NUMBER",
        value: parsedValue,
      });
      continue;
    }

    // Operators (symbolic and word-based)
    const matchedOperator = Tokens.operators.find((op) => {
      if (input.startsWith(op, current)) {
        if (["ca", "va", "na", "chintan", "satya", "asatya"].includes(op)) {
          const nextChar = input[current + op.length];
          return !nextChar || !/[a-zA-Z0-9_]/.test(nextChar);
        }
        return true;
      }
      return false;
    });

    if (matchedOperator) {
      tokens.push({ type: "OPERATOR", value: matchedOperator });
      current += matchedOperator.length;
      continue;
    }

    // Symbols
    if (Tokens.symbols.includes(char)) {
      tokens.push({ type: "SYMBOL", value: char });
      current++;
      continue;
    }

    // Identifiers or Keywords
    if (isAlpha(char)) {
      let value = "";
      while (current < input.length && /[a-zA-Z0-9_]/.test(input[current])) {
        value += input[current];
        current++;
      }

      const type = Tokens.keywords.includes(value) ? "KEYWORD" : "IDENTIFIER";
      tokens.push({ type, value });
      continue;
    }

    // Unknown characters
    return createError(
      "UNKNOWN_CHARACTER",
      "Encountered unknown character",
      current,
      `Character '${char}' (ASCII: ${char.charCodeAt(0)}) is not recognized`
    );
  }

  return { success: true, tokens };
}

export { tokenize };
