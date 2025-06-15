import { parse } from "./ast.js";
import { Declaration } from "./helper.js";
import { tokenize } from "./lexer.js";

function parseExpression(tokens) {
  let expression = "";

  for (const token of tokens) {
    const value = token.value;
    switch (token.type) {
      case "NUMBER":
      case "FLOAT":
        expression += value;
        break;
      case "STRING":
        expression += `"${value}"`;
        break;
      case "IDENTIFIER":
        expression += value;
        break;
      case "OPERATOR":
        expression +=
          {
            na: "!",
            va: "||",
            ca: "&&",
            chintan: "null",
            satya: "true",
            asatya: "false",
          }[value] || value;
        break;
      case "KEYWORD":
        expression +=
          {
            ghoshit_kar: " let ",
            nishchit_kar: " const ",
          }[value] || ` ${value} `;
        break;
      case "SYMBOL":
        expression += value;
        break;
    }
  }

  return expression;
}

function indent(code) {
  return code
    .split("\n")
    .map((line) => (line.trim() === "" ? line : "  " + line))
    .join("\n");
}

function astToJs(ast, captureFnName = "__captureOutput") {
  let code = "";

  for (const statement of ast.body) {
    const value = parseExpression(statement.value ?? []);

    switch (statement.type) {
      case Declaration.VarDeclaration:
        code += `let ${statement.name} = ${value};\n`;
        break;

      case Declaration.ConstDeclaration:
        code += `const ${statement.name} = ${value};\n`;
        break;

      case Declaration.AssignmentDeclaration:
        code += `${statement.name} = ${value};\n`;
        break;

      case Declaration.OutputDeclaration:
        code += `${captureFnName}(() => [${value}]);\n`;
        break;

      case Declaration.WhileDeclaration: {
        const condition = parseExpression(statement.condition);
        const bodyCode = astToJs({ body: statement.body }, captureFnName);
        const loopId = `__loopCounter${Math.random().toString(36).slice(2, 7)}`;
        code += `{\n  let ${loopId} = 0;\n  while (${condition}) {\n    if (++${loopId} > 10000) throw new Error("Infinite loop or max number of iterations reached");\n${indent(
          bodyCode
        )}\n  }\n}\n`;
        break;
      }

      case Declaration.ForDeclaration: {
        const init = parseExpression(statement.init);
        const condition = parseExpression(statement.condition);
        const increment = parseExpression(statement.increment);
        const bodyCode = astToJs({ body: statement.body }, captureFnName);
        const loopId = `__loopCounter${Math.random().toString(36).slice(2, 7)}`;
        code += `{\n  let ${loopId} = 0;\n  for (${init}; ${condition}; ${increment}) {\n    if (++${loopId} > 10000) throw new Error("Infinite loop or max number of iterations reached");\n${indent(
          bodyCode
        )}\n  }\n}\n`;
        break;
      }

      case Declaration.BreakDeclaration:
        code += "break;\n";
        break;

      case Declaration.ContinueDeclaration:
        code += "continue;\n";
        break;

      case Declaration.IfDeclaration: {
        const { branches, elseBody } = statement;
        branches.forEach((branch, index) => {
          const keyword = index === 0 ? "if" : "else if";
          const condition = parseExpression(branch.condition);
          const branchBody = astToJs({ body: branch.body }, captureFnName);
          code += `${keyword} (${condition}) {\n${indent(branchBody)}\n}\n`;
        });
        if (elseBody) {
          const elseCode = astToJs({ body: elseBody }, captureFnName);
          code += `else {\n${indent(elseCode)}\n}\n`;
        }
        break;
      }
    }
  }

  return code;
}

// Compile to JavaScript code
function compileToJs(code) {
  const __capturedLogs = [];

  const tokens = tokenize(code);
  if (!tokens.success) {
    __capturedLogs.push("Tokenization Error: " + tokens.error.message);
    return { success: false, logs: __capturedLogs };
  }

  const parseResult = parse(tokens.tokens);
  if (!parseResult.success) {
    __capturedLogs.push("Parse Error: " + parseResult.error.message);
    return { success: false, logs: __capturedLogs };
  }

  const jsCode = astToJs(parseResult.ast);
  return { success: true, jsCode, logs: __capturedLogs };
}

// Execute JS and capture output
function executeCompiledJs(jsCode) {
  const __capturedLogs = [];

  function __captureOutput(fn) {
    try {
      const result = fn();
      if (Array.isArray(result)) {
        __capturedLogs.push(result.map(String).join(" "));
      } else if (result !== undefined) {
        __capturedLogs.push(String(result));
      }
    } catch (error) {
      __capturedLogs.push(`Error: ${error.message}`);
    }
  }

  try {
    const exec = new Function("__captureOutput", jsCode);
    exec(__captureOutput);
  } catch (e) {
    __capturedLogs.push("Execution Error: " + e.message);
  }

  return __capturedLogs.join("\n");
}

// Full Runner
function runViswaguru(code) {
  const result = compileToJs(code);
  if (!result.success) return result.logs.join("\n");

  return executeCompiledJs(result.jsCode);
}

export { compileToJs, executeCompiledJs, runViswaguru };
