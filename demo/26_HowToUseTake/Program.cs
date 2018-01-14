using System;
using System.Collections.Generic;
using System.Linq;

namespace _26_HowToUseTake
{
    class Program
    {
        static void Main(string[] args)
        {
            string[] color = new string[] { "Orange", "Blue", "Yellow", "Green", "Pink" };

            IEnumerable<string> takeResults = color.Take(3);
            IEnumerable<string> takeLastResults = color.TakeLast(3);
            IEnumerable<string> takeWhileResults = color.TakeWhile(x => x != "Yellow");

            Dictionary<string, IEnumerable<string>> results = new Dictionary<string, IEnumerable<string>>(){
                { "Take", takeResults },
                { "TakeLast", takeLastResults },
                { "TakeWhile", takeWhileResults }
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
