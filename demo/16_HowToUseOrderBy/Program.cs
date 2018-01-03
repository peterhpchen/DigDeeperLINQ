using System;
using System.Collections.Generic;
using System.Linq;

namespace _16_HowToUseOrderBy
{
    class Program
    {
        static void Main(string[] args)
        {
            //linq_ordering();
            //query();
            //evenBeforeOdd();
            
            string[] words = new string[] { "Apple", "Banana", "Cherry", "Donut", "Eat", "Football" };
            IOrderedEnumerable<string> results = words.OrderBy(x => x.Substring(1, 1)).OrderByDescending(x => x.Substring(2, 1));
            IOrderedEnumerable<string> results2 = words.OrderBy(x => x.Substring(1, 1)).ThenByDescending(x => x.Substring(2, 1));

            foreach (string result in results)
            {
                Console.WriteLine(result);
            }
            Console.WriteLine();

            foreach (string result in results2)
            {
                Console.WriteLine(result);
            }
            Console.WriteLine();
        }

        private static void evenBeforeOdd()
        {
            int[] numbers = new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
            IOrderedEnumerable<int> results = numbers.OrderBy(x => x, new CustomComparer());

            foreach (int result in results)
            {
                Console.Write($"{result} ");
            }
            Console.WriteLine();
        }

        private static void query()
        {
            string[] words = new string[] { "Apple", "Banana", "Cherry", "Donut", "Eat", "Football" };
            IOrderedEnumerable<string> results = from word in words
                                                 orderby word.Substring(1, 1), word.Substring(2, 1) descending
                                                 select word;

            foreach (string result in results)
            {
                Console.WriteLine(result);
            }
            Console.WriteLine();
        }

        private static void linq_ordering()
        {
            char[] Source = new char[] { 'G', 'C', 'F', 'E', 'B', 'A', 'D' };
            IOrderedEnumerable<char> Results = Source.OrderBy(c => c);

            foreach (char result in Results)
            {
                Console.Write($"{result} ");
            }
            Console.WriteLine();
        }

        class CustomComparer : IComparer<int>
        {
            public int Compare(int x, int y)
            {
                return x % 2 - y % 2;
            }
        }
    }
}
