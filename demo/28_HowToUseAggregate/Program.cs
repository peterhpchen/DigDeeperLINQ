using System;
using System.Linq;
using System.Collections.Generic;

namespace _28_HowToUseAggregate
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] Source = new int[] { 2, 7, 5, 1, 6, 8, 3 };

            foreach (string resultLine in result(Source))
            {
                Console.WriteLine(resultLine);
            }
        }

        private static IEnumerable<string> result(int[] source)
        {
            yield return $"Source: {string.Join(',', source)}";
            yield return $" Average: {Average(source)}";
            yield return $" Count: {Count(source)}";
            yield return $" Max: {Max(source)}";
            yield return $" Min: {Min(source)}";
            yield return $" Sum: {Sum(source)}";
        }

        private static double Average(IEnumerable<int> source)
        {
            int count = 0;

            //return source.Average(x => x);
            return source.Aggregate(
                0,
                (total, next) =>
                {
                    total = total + next; count++;
                    return total;
                },
                total => (double)total / count
            );
        }

        private static int Count(IEnumerable<int> source)
        {
            //return source.Count();
            return source.Aggregate(0, (count, next) => ++count);
        }

        private static int Max(IEnumerable<int> source)
        {
            //return source.Max(x => x);
            return source.Aggregate((max, next) => max < next ? next : max);
        }

        private static int Min(IEnumerable<int> source)
        {
            //return source.Min(x => x);
            return source.Aggregate((min, next) => min > next ? next : min);
        }

        private static int Sum(IEnumerable<int> source)
        {
            //return source.Sum(x => x);
            return source.Aggregate((total, next) => total + next);
        }
    }
}
