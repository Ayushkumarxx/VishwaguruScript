// index.js
import { runViswaguru } from "./interpreter.js";

const code = `
// Sample Viswaguru toy language script

arambha systummm

ghoshit_kar a =  10;
a = 20;
nishchit_kar b = 20;

yadi (a > b) {
  prakashit_kar("a is greater than b");
} anyatha_yadi (a == b) {
  prakashit_kar("a is equal to b");
} anyatha {
  prakashit_kar("a is less than b");
}

prati_ghatak (ghoshit_kar i = 0; i < 5; i++) {
  prakashit_kar("Loop count:", i);
  yadi (i == 2) {
    viram;
  }
}

yatha (a < b) {
  prakashit_kar("Inside while loop");
  a = a + 1;
  yadi (a == 15) {
    agla_ghaatak;
  }
  yadi (a >= b) {
    viram;
  }
}

prakashit_kar("Final value of a:", a);

bihari_sramik
`;

const output = runViswaguru(code);
console.log("Captured Output:\n" + output);
