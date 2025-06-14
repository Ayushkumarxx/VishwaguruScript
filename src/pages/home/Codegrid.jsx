import React from "react";
import CodeEditor from "../../shared/components/Editor";

// 1. Basic Structure
const code1 = `arambha systummm

// Your code starts here

bihari_sramik`;

// 2. Variables
const code2 = `arambha systummm

ghoshit_kar umra = 20;               // let
nishchit_kar naam = "Ayush";    // const

bihari_sramik`;

// 3. Comments
const code3 = `arambha systummm

// Yeh ek single-line comment hai

/*
  Yeh ek multi-line comment hai
  Yahan hum kuch samjha rahe hain
*/

bihari_sramik`;

// 4. Print Statement
const code4 = `arambha systummm

prakashit_kar("Namaste Duniya!");
ghoshit_kar naam = "Ayush";
prakashit_kar(naam);

bihari_sramik`;

// 5. Data Types
const code5 = `arambha systummm

ghoshit_kar sankhya = 10;          // number
ghoshit_kar floatSankhya = 10.5;   // float
ghoshit_kar naam = "Bihari Dev";   // string
ghoshit_kar satyaHai = satya;      // true
ghoshit_kar asatyaHai = asatya;    // false
ghoshit_kar kuchNahi = chintan;    // null equivalent

prakashit_kar(sankhya);
prakashit_kar(floatSankhya);
prakashit_kar(naam);
prakashit_kar(satyaHai);
prakashit_kar(asatyaHai);
prakashit_kar(kuchNahi);

bihari_sramik`;

// 6. If-Else Condition
const code6 = `arambha systummm

ghoshit_kar aayu = 18;

yadi (aayu >= 18) {
  prakashit_kar("Aap vote de sakte hain");
} anyatha {
  prakashit_kar("Maaf kijiye, aap abhi chhote hain");
}

bihari_sramik`;

// 7. For Loop
const code7 = `arambha systummm

prati_ghatak (ghoshit_kar i = 0; i < 5; i = i + 1) {
  prakashit_kar("Sankhya: " + i);
}

bihari_sramik`;

// 8. While Loop + Break + Continue
const code8 = `arambha systummm

ghoshit_kar i = 0;

yatha (i < 10) {
  i = i + 1;

  yadi (i == 3) {
    agla_ghaatak;
  }

  yadi (i == 8) {
    viram;
  }

  prakashit_kar(i);
}

bihari_sramik`;

// 9. Operators
const code9 = `arambha systummm

ghoshit_kar a = 10;
ghoshit_kar b = 20;

ghoshit_kar sum = a + b;
ghoshit_kar isEqual = (a == b); // (a != b)
ghoshit_kar isGreater = (a > b); // (a < b)
ghoshit_kar and = (a ca b); // and operator
ghoshit_kar or = (a va b); // or operator
ghoshit_kar not = na a;
ghoshit_kar isTrue = (satya ca asatya);

prakashit_kar(sum);
prakashit_kar(isEqual);
prakashit_kar(isTrue);

bihari_sramik`;

const CodeGrid = () => {
  const items = [
    {
      title: "Basic Structure",
      description: "Start and end of every program.",
      code: code1,
    },
    {
      title: "Variables",
      description: "Declare using ghoshit_kar (let) or nishchit_kar (const).",
      code: code2,
    },
    {
      title: "Comments",
      description: "Use // or /* */ to explain code.",
      code: code3,
    },
    {
      title: "Print Statement",
      description: "Use prakashit_kar() to print values.",
      code: code4,
    },
    {
      title: "Data Types",
      description: "String, number, boolean, null types.",
      code: code5,
    },
    {
      title: "If-Else",
      description: "Use yadi, anyatha_yadi, and anyatha for conditions.",
      code: code6,
    },
    {
      title: "For Loop",
      description: "Use prati_ghatak for iterating.",
      code: code7,
    },
    {
      title: "While Loop + Control",
      description: "yatha for loops, viram to break, agla_ghaatak to continue.",
      code: code8,
    },
    {
      title: "Operators",
      description: "Mathematical and logical operations.",
      code: code9,
    },
  ];

  return (
    <div className="max-w-[1300px] mx-auto py-8 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {items.map((item, index) => (
          <div
            key={index}
            className="   flex flex-col justify-between border-t border-white py-8 "
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-400 text-[16px] mb-4">
                {item.description}
              </p>
            </div>

            <CodeEditor
              value={item.code}
              fileName="docs"
              readOnly={true}
              wordWrap={false}
              showCopyButton={true}
              height="300px"
            />
          </div>
        ))}

        <div className=" flex flex-col justify-between border-t border-white py-8 ">
          <div>
            <h2 className="text-xl font-semibold mb-2">More Coming soon..</h2>
            <p className="text-gray-400 text-[16px] mb-4">
              Working on more funtions for you Guys! it's a Toy language built on
              Javascript.{" "}
            </p>
            <p className="text-gray-400 text-[16px] mb-4">
              Not for serious use. Very basic logic used in this language.{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGrid;
