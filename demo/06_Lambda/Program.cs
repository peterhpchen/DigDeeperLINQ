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
            output(nameMethod, "name method");

            // Instantiate delegate with anonymous method:
            output(delegate (string output) { return output; }, "anonymous method");

            // Instantiate delegate with lambda expression
            output(output => output, "lambda method");
        }

        //public delegate TResult Func<in T, out TResult>(T arg);
        private static void output(Func<string, string> stringGetter, string input)
        {
            Console.WriteLine(stringGetter(input));
        }
    }
}
