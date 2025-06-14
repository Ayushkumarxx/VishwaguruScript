const Tokens = {
  //  Reserved keywords in our toy language
  keywords: [
    "arambha", // start / begin
    "systummm", // start
    "bihari_sramik", // temporary worker / maybe variable?
    "ghoshit_kar", // declare
    "nishchit_kar", // define
    "yadi", // if
    "anyatha_yadi", // else if
    "anyatha", // else
    "prati_ghatak", // for
    "yatha", // while loop
    "viram", // break
    "agla_ghaatak", // continue
    // "kriya_kalp", // function
    // "uttar", // return
    //"grahan_karo", // input / receive
    "prakashit_kar", // print / output
  ],

  //  Operators used in expressions and conditions
  operators: [
    "==",
    "!=",
    "<=",
    ">=",
    "&&",
    "ca", // and
    "va", // or
    "na", // not
    "satya", // true
    "asatya", // false
    "chintan", // null
    "||",
    "=",
    "<",
    ">",
    "+",
    "-",
    "*",
    "/",
    "%",
    "!",
   
  ],

  // 🔹 Symbols used for grouping and statement control
  symbols: ["(", ")", "{", "}", ",", ";"],

  //  Comment symbols (single-line and multi-line)
  comments: [
    "//", // single-line comment
    "/*", // start of multi-line comment
    "*/", // end of multi-line comment
  ],
};

const Declaration = {
  VarDeclaration: "VarDeclaration",
  ConstDeclaration: "ConstDeclaration",
  FunctionDeclaration: "FunctionDeclaration",
  InputDeclaration: "InputDeclaration",
  OutputDeclaration: "OutputDeclaration",
  IfDeclaration: "IfDeclaration",
  WhileDeclaration: "WhileDeclaration",
  ForDeclaration: "ForDeclaration",
  BreakDeclaration: "BreakDeclaration",
  ContinueDeclaration: "ContinueDeclaration",
  ReturnDeclaration: "ReturnDeclaration",
  AssignmentDeclaration: "AssignmentDeclaration",
};

export { Tokens, Declaration };
