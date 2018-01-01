using System;
using System.Collections.Generic;
using System.Linq;

namespace _14_HowToUseWhere
{
    class Program
    {
        static void Main(string[] args)
        {
            char[] source = new char[] { 'A', 'B', 'C', 'A', 'B', 'A', 'C' };

            getA(source);

            //getAorC(source);

            // var result = source.Where((letter, index) => index != 5);

            // foreach (char letter in result)
            // {
            //     Console.Write($"{letter} ");
            // }
            // Console.WriteLine();
        }

        private static void getAorC(char[] source)
        {
            var result =
                //source.Where(letter => letter == 'A' || letter == 'C');
                from letter in source
                where letter == 'A' || letter == 'C'
                select letter;

            foreach (char letter in result)
            {
                Console.Write($"{letter} ");
            }
            Console.WriteLine();
        }

        private static void getA(char[] source)
        {
            IEnumerable<char> result =
                //source.Where(equalA);
                from letter in source
                where equalA(letter)
                select letter;

            foreach (char letter in result)
            {
                Console.Write($"{letter} ");
            }
            Console.WriteLine();
        }

        private static  bool equalA(char letter)
        {
            return letter == 'A';
        }
    }
}
