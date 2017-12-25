using System;
using System.Collections.Generic;
using System.Linq;

namespace _06_Lambda
{
    class Program
    {
        static string nameMethod(string output)
        {
            return output;
        }

        static void Main()
        {
            // Instantiate delegate with named method:
            consoleWriteLine(nameMethod, "name method");

            // Instantiate delegate with anonymous method:
            consoleWriteLine(delegate (string output) { return output; }, "anonymous method");

            // Instantiate delegate with lambda expression
            consoleWriteLine(output => output, "lambda method");
        }

        //public delegate TResult Func<in T, out TResult>(T arg);
        private static void consoleWriteLine(Func<string, string> stringGetter, string input)
        {
            Console.WriteLine(stringGetter(input));
        }
    }
}
