// viswaguruEngine.js
import { parse } from "./ast.js";
import { Declaration } from "./helper.js";
import { tokenize } from "./lexer.js";

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
        expression += {
          na: "!",
          va: "||",
          ca: "&&",
          chintan: "null",
          satya: "true",
          asatya: "false",
        }[value] || value;
        break;
      case "KEYWORD":
        expression += {
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

function astToJs(ast) {
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
        code += `__captureOutput(() => [${value}]);\n`;
        break;

      case Declaration.WhileDeclaration: {
        const condition = parseExpression(statement.condition);
        const bodyCode = astToJs({ body: statement.body });
        code += `while (${condition}) {\n${indent(bodyCode)}\n}\n`;
        break;
      }

      case Declaration.ForDeclaration: {
        const init = parseExpression(statement.init);
        const condition = parseExpression(statement.condition);
        const increment = parseExpression(statement.increment);
        const bodyCode = astToJs({ body: statement.body });
        code += `for (${init}; ${condition}; ${increment}) {\n${indent(bodyCode)}\n}\n`;
        break;
      }
      case Declaration.BreakDeclaration:
      case Declaration.ContinueDeclaration:
        code += statement.type === "BreakDeclaration" ? "break;\n" : "continue;\n";
        break;

      case Declaration.IfDeclaration: {
        const { branches, elseBody } = statement;
        branches.forEach((branch, index) => {
          const keyword = index === 0 ? "if" : "else if";
          const condition = parseExpression(branch.condition);
          const branchBody = astToJs({ body: branch.body });
          code += `${keyword} (${condition}) {\n${indent(branchBody)}\n}\n`;
        });
        if (elseBody) {
          const elseCode = astToJs({ body: elseBody });
          code += `else {\n${indent(elseCode)}\n}\n`;
        }
        break;
      }
    }
  }

  return code;
}

// Compile to JS
function compileToJs(code) {
  __capturedLogs.length = 0;

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

// Execute compiled JS
function executeCompiledJs(jsCode) {
  try {
    eval(jsCode);
  } catch (e) {
    __capturedLogs.push("Execution Error: " + e);
  }

  return __capturedLogs.join("\n");
}

// Full run function
function runViswaguru(code) {
  const result = compileToJs(code);
  if (!result.success) return result.logs.join("\n");

  const output = executeCompiledJs(result.jsCode);
  return output;
}

export { compileToJs, executeCompiledJs, runViswaguru };
