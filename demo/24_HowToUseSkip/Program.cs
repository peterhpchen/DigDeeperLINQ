using System;
using System.Collections.Generic;
using System.Linq;

namespace _24_HowToUseSkip
{
    class Program
    {
        static void Main(string[] args)
        {
            string[] color = new string[] { "Orange", "Blue", "Yellow", "Green", "Pink" };

            IEnumerable<string> skipResults = color.Skip(3);
            IEnumerable<string> skipLastResults = color.SkipLast(3);
            IEnumerable<string> skipWhileResults = color.SkipWhile(x => x != "Yellow");

            Dictionary<string, IEnumerable<string>> results = new Dictionary<string, IEnumerable<string>>(){
                { "Skip", skipResults },
                { "SkipLast", skipLastResults },
                { "SkipWhile", skipWhileResults }
            };

            string output = "";
            foreach (KeyValuePair<string, IEnumerable<string>> keyValue in results)
            {
                output += $"{keyValue.Key}: ";
                foreach (string c in keyValue.Value)
                {
                    output += $"{c},";
                }
                output = output.Trim(',') + '\n';
            }
            Console.WriteLine(output);
        }
    }
}
