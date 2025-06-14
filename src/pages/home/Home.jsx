import React, { useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { GiTigerHead } from "react-icons/gi";
import CodeEditor from "../../shared/components/Editor";
import CodeGrid from "./Codegrid";
import { runViswaguru } from "../../VSG/interpreter";

const Home = () => {
  const [code1] = useState(`// Vishwaguru Language Example
arambha systummm

   nischit_kar naam = "Ayush";  // const
   ghosit_kar sankhya = 42;  // let
    
   yadi (naam == "Ayush") {
     prakashit_kar("Hello Ayush!"); // conditional print
   }

   prakashit_kar("sankhya: " + sankhya); // print

bihari_sramik `);

  const [code2, setCode2] = useState(`arambha systummm

// Your code starts here




bihari_sramik`);
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setShowOutput(true);
    setLoading(true);
    setOutput("");
    setTimeout(() => {
      const result = runViswaguru(code2);
      setOutput(result);
      setLoading(false);
    }, 1500);
  };

  const handleClear = () => {
    setCode2("");
    setOutput("");
    setShowOutput(false);
  };

  const onChange = (value) => setCode2(value);

  const playgroundRef = useRef(null);

  const scrollToPlayground = () => {
    playgroundRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="max-w-[1300px] mx-auto min-h-screen px-4 py-8 flex flex-col md:flex-row items-center gap-10">
        {/* Left Side */}
        <div className="w-full md:w-2/5">
          <div className="flex flex-wrap items-center gap-2 bg-[#191e1f] border-[2px] border-[#ff5622bb] rounded-full pl-1 pr-4 py-1 w-fit">
            <div className="px-3 py-1 bg-[#FF5722] rounded-full flex items-center text-sm md:text-base font-bold text-white">
              <GiTigerHead className="mr-1" /> भारत
            </div>
            <p className="text-sm md:text-base font-medium text-[#FF5722]">
              Make in India
            </p>
            <FaHeart className="text-[#FF5722] text-base md:text-lg" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-[52px] font-semibold mt-8 leading-snug md:leading-[1.3]">
            Try Vishwaguru
            <br />
            Script Today!
          </h1>

          <p className="text-base md:text-lg font-light mt-4 md:w-[85%] leading-7">
            Vishwaguru Script – A proud programming language that doesn’t run,
            doesn’t compile, and definitely doesn’t solve problems. But don’t
            worry, it still claims to guide all other languages with its ancient
            bugs and spiritual syntax.
          </p>

          <button
            onClick={scrollToPlayground}
            className="w-full md:w-[85%] mt-8 py-2.5 font-semibold rounded-xl backdrop-blur-lg bg-[#FF5722]/10 border border-[#FF5722]/40 text-white hover:bg-[#FF5722]/20 transition"
          >
            Playground
          </button>
          <p className="text-sm text-center mt-4 md:w-[85%] font-normal leading-6">
            Vishwaguru Script <b>v1.0.2</b> No updates. It was born perfect.
            <br />
            (or so it claims). <br />
            Have questions? Meditate. Answers will come in a vision.
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-3/5 h-auto p-2 flex items-center">
          <CodeEditor
            value={code1}
            fileName="docs"
            readOnly={true}
            wordWrap={false}
            showCopyButton={false}
          />
        </div>
      </div>

      {/* Playground */}
      <div className="max-w-[1300px] mx-auto px-4 py-12 " ref={playgroundRef}>
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="text-3xl md:text-4xl font-semibold">Playground</div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRun}
              className="px-6 py-2 bg-[#FF5722] rounded-md text-base font-bold text-white hover:bg-[#e14c1c] transition"
            >
              Run
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 font-semibold rounded-md backdrop-blur-lg bg-[#FF5722]/10 border border-[#FF5722]/40 text-white hover:bg-[#FF5722]/20 transition"
            >
              Clear
            </button>
          </div>
        </div>

        <CodeEditor
          value={code2}
          fileName="editor"
          readOnly={false}
          wordWrap={false}
          showCopyButton={false}
          onChange={onChange}
        />

        {showOutput && (
          <div className="mt-8 transition-all duration-500">
            <h3 className="text-xl md:text-2xl font-semibold text-[#FF5722] mb-2">
              Output of the Code:
            </h3>
            <div className="bg-[#1e1e1e] text-white border border-[#FF5722]/40 rounded-xl p-4 md:p-6 min-h-[120px] max-h-[300px] overflow-auto shadow-lg">
              {loading ? (
                <div className="flex items-center gap-4 animate-pulse text-[#FF5722]">
                  <div className="w-5 h-5 border-2 border-[#FF5722] border-t-transparent rounded-full animate-spin"></div>
                  <p>Running the script... Please wait.</p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap">{output}</pre>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Documentation */}
      <div className="max-w-[1300px] mx-auto px-4 py-16">
        <div className="text-3xl md:text-4xl font-semibold">Documentation</div>
        <p className="text-sm mt-4 font-normal leading-6">
          Asking for help? Shame. True bhakts trust the script blindly.
        </p>
        <CodeGrid />
      </div>

      <footer className="w-full text-center mb-8">
        <p className="text-[16px] mt-4 font-normal leading-6">
          Made with ❤️ by Ayush Kumar
        </p>
      </footer>
    </>
  );
};

export default Home;
