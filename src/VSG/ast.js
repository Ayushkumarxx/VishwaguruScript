import { tokenize } from "./lexer.js";
import { Declaration } from "./helper.js";

function parse(tokens) {
  const ast = {
    type: "Program",
    body: [],
  };

  const peek = () => tokens[0];
  const consume = () => tokens.shift();

  // Helper function to create error objects
  const createError = (type, message, context) => ({
    success: false,
    error: { type, message, context },
  });

  const expected = (expectedType, expectedValue = null, passedToken = null) => {
    const token = passedToken || peek();
    if (!token) {
      return createError(
        "UNEXPECTED_END_OF_INPUT",
        `Expected ${expectedType}${
          expectedValue ? ` '${expectedValue}'` : ""
        } but reached end of input`,
        `Parser was expecting ${expectedType}${
          expectedValue ? ` '${expectedValue}'` : ""
        }`
      );
    }

    const typeMatches = token.type === expectedType;
    const valueMatches =
      expectedValue === null || token.value === expectedValue;

    if (typeMatches && valueMatches) {
      if (!passedToken) consume();
      return { success: true, token };
    }

    return createError(
      "UNEXPECTED_TOKEN",
      `Expected ${expectedType}${
        expectedValue ? ` '${expectedValue}'` : ""
      }, but got ${token.type} '${token.value}'`,
      `Expected ${expectedType}${
        expectedValue ? ` '${expectedValue}'` : ""
      } but found '${token.value}' instead`
    );
  };

  const expectIdentifier = () => {
    const token = peek();
    if (!token || token.type !== "IDENTIFIER") {
      return createError(
        "MISSING_IDENTIFIER",
        "Expected an identifier",
        "Identifier expected for variable declaration"
      );
    }
    consume();
    return { success: true, name: token.value };
  };

  // Helper function to parse expressions within parentheses
  const parseParenthesesContent = () => {
    const exprTokens = [];
    let depth = 1;

    while (tokens.length > 0 && depth > 0) {
      const token = peek();

      if (token.type === "SYMBOL" && token.value === "(") {
        depth++;
      } else if (token.type === "SYMBOL" && token.value === ")") {
        depth--;
        if (depth === 0) {
          consume(); // consume final ')'
          break;
        }
      }

      exprTokens.push(consume());
    }

    if (depth !== 0) {
      return createError(
        "MISSING_RIGHT_PAREN",
        "Unmatched '(' in expression",
        "Ensure all opening parentheses are properly closed"
      );
    }

    return { success: true, tokens: exprTokens };
  };

  const parseExpression = () => {
    const exprTokens = [];

    while (
      tokens.length > 0 &&
      peek().type !== "KEYWORD" &&
      peek().value !== ";"
    ) {
      if (peek().type === "IDENTIFIER" && tokens[1]?.value === "=") {
        break;
      }
      exprTokens.push(consume());
    }

    return { success: true, tokens: exprTokens };
  };

  const parseDeclaration = () => {
    const varOrconst = consume(); // 'ghoshit_kar' or 'nishchit_kar'
    const idResult = expectIdentifier();
    if (!idResult.success) return idResult;

    const name = idResult.name;

    const assignmentCheck = expected("OPERATOR", "=");
    if (!assignmentCheck.success) {
      assignmentCheck.error.context = `Variable declaration '${name}' requires '=' assignment operator`;
      return assignmentCheck;
    }

    const next = peek();
    if (!next || next.type === "KEYWORD" || next.value === ";") {
      return createError(
        "MISSING_VALUE",
        `Expected value after '=' in declaration of '${name}'`,
        "Variable declaration requires a value after the assignment operator"
      );
    }

    const node = {
      type:
        varOrconst.value === "ghoshit_kar"
          ? Declaration.VarDeclaration
          : Declaration.ConstDeclaration,
      name,
    };

    // Parse value
    const exprResult = parseExpression();
    if (!exprResult.success) return exprResult;
    node.value = exprResult.tokens;

    return { success: true, node };
  };

  const parsePrint = () => {
    consume(); // consume 'prakashit_kar'

    const parenCheck = expected("SYMBOL", "(");
    if (!parenCheck.success) return parenCheck;

    const contentResult = parseParenthesesContent();
    if (!contentResult.success) return contentResult;

    if (contentResult.tokens.length === 0) {
      return createError(
        "EMPTY_PRINT",
        "Print statement cannot be empty",
        "Provide at least one expression inside 'prakashit_kar(...)'"
      );
    }

    return {
      success: true,
      node: {
        type: Declaration.OutputDeclaration,
        value: contentResult.tokens,
      },
    };
  };

  // Helper function to parse statements (used in blocks and main program)
  const parseStatement = () => {
    const token = peek();

    if (token.type === "KEYWORD") {
      switch (token.value) {
        case "ghoshit_kar":
        case "nishchit_kar":
          return parseDeclaration();
        case "prakashit_kar":
          return parsePrint();
        case "yatha":
          return parseWhileLoop();
        case "prati_ghatak":
          return parseForLoop();
        case "yadi":
          return parseIfStatement();
        case "viram":
        case "agla_ghaatak":
          return parseBreakOrContinue();
        case "arambha":
        case "systummm":
        case "bihari_sramik":
          return createError(
            "MULTIPLE_DECLARATIONS",
            `Multiple declarations of '${token.value}' are not allowed`,
            "Only one declaration of each type is allowed in a program"
          );
        case "anyatha_yadi":
        case "anyatha":
          return createError(
            "WRONG_SYNTAX",
            `Invalid syntax for '${token.value}'`,
            "Cannot use 'anyatha_yadi' or 'anyatha' without a 'yadi' block"
          );
       
        default:
          consume(); // Skip unknown keywords
          return null;
      }
    } else if (token.type === "IDENTIFIER") {
      return parseAssignment();
    } else {
      consume(); // Skip unknown tokens
      return null;
    }
  };

  const parseAssignment = () => {
    const identifier = consume().value;

    const assignCheck = expected("OPERATOR", "=");
    if (!assignCheck.success) {
      assignCheck.error.context = `Possible invalid assignment to '${identifier}'`;
      return assignCheck;
    }

    const exprResult = parseExpression();
    if (!exprResult.success) return exprResult;

    return {
      success: true,
      node: {
        type: Declaration.AssignmentDeclaration,
        name: identifier,
        value: exprResult.tokens,
      },
    };
  };

  const parseBlock = () => {
    const braceCheck = expected("SYMBOL", "{");
    if (!braceCheck.success) return braceCheck;

    const body = [];

    while (tokens.length > 0 && peek().value !== "}") {
      const result = parseStatement();
      if (result && result.success) {
        body.push(result.node);
      } else if (result && !result.success) {
        return result;
      }
    }

    // Consume closing '}'
    if (peek()?.type === "SYMBOL" && peek().value === "}") {
      consume();
    } else {
      return createError(
        "MISSING_CLOSING_BRACE",
        "Expected '}' at end of block",
        "Check that every '{' has a matching '}'"
      );
    }

    return { success: true, node: body };
  };

  const parseWhileLoop = () => {
    consume(); // consume 'yatha'

    const parenCheck = expected("SYMBOL", "(");
    if (!parenCheck.success) return parenCheck;

    const conditionResult = parseParenthesesContent();
    if (!conditionResult.success) {
      conditionResult.error.type = "ConditionError";
      conditionResult.error.message = "Expression is not valid";
      conditionResult.error.context =
        "Ensure all opening parentheses and expressions are properly written";
      return conditionResult;
    }

    if (conditionResult.tokens.length === 0) {
      return createError(
        "ConditionError",
        "Condition cannot be empty",
        "Provide at least one expression inside 'yatha(...)'"
      );
    }

    const bodyResult = parseBlock();
    if (!bodyResult.success) return bodyResult;

    return {
      success: true,
      node: {
        type: Declaration.WhileDeclaration,
        condition: conditionResult.tokens,
        body: bodyResult.node,
      },
    };
  };

  const parseForLoop = () => {
    consume(); // consume 'prati_ghatak'

    const parenCheck = expected("SYMBOL", "(");
    if (!parenCheck.success) return parenCheck;

    const contentResult = parseParenthesesContent();
    if (!contentResult.success) {
      contentResult.error.type = "ConditionError";
      contentResult.error.message = "Expression is not valid";
      contentResult.error.context =
        "Ensure all opening parentheses and expressions are properly written";
      return contentResult;
    }

    const loopTokens = contentResult.tokens;
    const semicolonIndices = [];

    loopTokens.forEach((token, index) => {
      if (token.type === "SYMBOL" && token.value === ";") {
        semicolonIndices.push(index);
      }
    });

    if (semicolonIndices.length !== 2) {
      return createError(
        "SyntaxError",
        "Invalid 'for' loop syntax",
        "Expected two semicolons separating init, condition, and increment"
      );
    }

    const bodyResult = parseBlock();
    if (!bodyResult.success) return bodyResult;

    return {
      success: true,
      node: {
        type: Declaration.ForDeclaration,
        init: loopTokens.slice(0, semicolonIndices[0]),
        condition: loopTokens.slice(
          semicolonIndices[0] + 1,
          semicolonIndices[1]
        ),
        increment: loopTokens.slice(semicolonIndices[1] + 1),
        body: bodyResult.node,
      },
    };
  };

  const parseBreakOrContinue = () => {
    const keyword = consume().value;
    const node = {
      type:
        keyword === "viram"
          ? Declaration.BreakDeclaration
          : Declaration.ContinueDeclaration,
    };
    return { success: true, node };
  };
  const parseIfStatement = () => {
    consume(); // consume 'yadi'

    const node = {
      type: Declaration.IfDeclaration,
      branches: [],
      elseBody: null,
    };

    // Parse main 'if' condition and body
    const parenCheck = expected("SYMBOL", "(");
    if (!parenCheck.success) return parenCheck;

    const conditionResult = parseParenthesesContent();
    if (!conditionResult.success) {
      conditionResult.error.type = "ConditionError";
      conditionResult.error.message = "Invalid 'if' condition expression";
      conditionResult.error.context =
        "Unmatched parentheses or malformed condition";
      return conditionResult;
    }

    const ifBlock = parseBlock();
    if (!ifBlock.success) return ifBlock;

    node.branches.push({
      condition: conditionResult.tokens,
      body: ifBlock.node,
    });

    // Parse optional else-if blocks
    while (peek()?.type === "KEYWORD" && peek().value === "anyatha_yadi") {
      consume(); // consume 'anyatha_yadi'

      const elseifParenCheck = expected("SYMBOL", "(");
      if (!elseifParenCheck.success) return elseifParenCheck;

      const elseifConditionResult = parseParenthesesContent();
      if (!elseifConditionResult.success) {
        elseifConditionResult.error.type = "ConditionError";
        elseifConditionResult.error.message = "Invalid 'else-if' condition";
        elseifConditionResult.error.context =
          "Unmatched parentheses or malformed expression";
        return elseifConditionResult;
      }

      const elseifBlock = parseBlock();
      if (!elseifBlock.success) return elseifBlock;

      node.branches.push({
        condition: elseifConditionResult.tokens,
        body: elseifBlock.node,
      });
    }

    // Parse optional else block
    if (peek()?.type === "KEYWORD" && peek().value === "anyatha") {
      consume(); // consume 'anyatha'
      const elseBlock = parseBlock();
      if (!elseBlock.success) return elseBlock;
      node.elseBody = elseBlock.node;
    }

    return { success: true, node };
  };

  // Main parsing logic
  const arambhaCheck = expected("KEYWORD", "arambha");
  if (!arambhaCheck.success) {
    arambhaCheck.error.context = "Program must start with 'arambha' keyword";
    return arambhaCheck;
  }

  const systummmCheck = expected("KEYWORD", "systummm");
  if (!systummmCheck.success) {
    systummmCheck.error.context =
      "Program must have 'systummm' keyword after 'arambha'";
    return systummmCheck;
  }

  // Check for ending keyword
  if (tokens.length === 0) {
    return createError(
      "MISSING_END_KEYWORD",
      "Program must end with 'bihari_sramik' keyword",
      "Every program must be properly terminated with 'bihari_sramik'"
    );
  }

  const lastToken = tokens[tokens.length - 1];
  const bihariCheck = expected("KEYWORD", "bihari_sramik", lastToken);
  if (!bihariCheck.success) {
    bihariCheck.error.context = "Program must end with 'bihari_sramik' keyword";
    return bihariCheck;
  }

  // Remove the last token since we've verified it
  tokens.pop();

  // Parse all statements in the program
  while (tokens.length > 0) {
    const result = parseStatement();
    if (result && result.success) {
      ast.body.push(result.node);
    } else if (result && !result.success) {
      return result;
    }
  }

  return { success: true, ast };
}

export { parse };
