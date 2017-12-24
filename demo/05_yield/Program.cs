using System;
using System.Collections;
using System.Collections.Generic;

namespace yieldTest
{
    class Program
    {
        static void Main(string[] args)
        {
            //outputDivide_for(9, 2);
            //outputDivide_foreach_List(9, 2);
            //enumerable_Iterator(9, 2);
            //outputDivide_foreach_yield(9, 2);
            foreach (int item in enumerable_yield2())
            {
                Console.Write($"{item} ");
            }
            Console.WriteLine();
        }

        private static IEnumerable enumerable_yield2()
        {
            yield return 1;
            yield return 2;
            yield return 3;
            yield return 4;
            yield return 5;
            yield return 6;
            yield return 7;
            yield return 8;
            yield return 9;
            yield break;
            yield return 10;
        }

        private static void outputDivide_for(int maxNum, int divide)
        {
            for (int currentNum = 1; currentNum <= maxNum; currentNum++)
            {
                if (currentNum % divide != 0) continue;
                Console.Write($"{currentNum} ");
            }
            Console.WriteLine();
        }

        private static void outputDivide_foreach_yield(int maxNum, int divide)
        {
            foreach (int item in enumerable_yield(maxNum, divide))
            {
                Console.Write($"{item} ");
            }
            Console.WriteLine();
        }

        private static IEnumerable enumerable_yield(int maxNum, int divide)
        {
            for (int currentNum = 1; currentNum <= maxNum; currentNum++)
            {
                if (currentNum % divide != 0) continue;
                yield return currentNum;
            }
        }

        private static void outputDivide_foreach_List(int maxNum, int divide)
        {
            foreach (int item in enumerable_List(maxNum, divide))
            {
                Console.Write($"{item} ");
            }
            Console.WriteLine();
        }

        private static IEnumerable enumerable_List(int maxNum, int divide)
        {
            List<int> result = new List<int>();

            for (int currentNum = 1; currentNum <= maxNum; currentNum++)
            {
                if (currentNum % divide != 0) continue;
                result.Add(currentNum);
            }

            return result;
        }



        private static IEnumerable enumerable_Iterator(int maxNum, int divide)
        {
            evenIntegersAggregate enumerable = new evenIntegersAggregate(maxNum, divide);
            return enumerable;
        }

        private class evenIntegersAggregate : IEnumerable
        {
            private int _maxNum;
            private int _divide;

            public evenIntegersAggregate(int maxNum, int divide)
            {
                _maxNum = maxNum;
                _divide = divide;
            }
            public IEnumerator GetEnumerator()
            {
                return new evenIntegersInterator(_maxNum, _divide);
            }
        }

        private class evenIntegersInterator : IEnumerator
        {
            private int _maxNum;
            private int _divide;
            private int currentNum = 1;

            public evenIntegersInterator(int maxNum, int divide)
            {
                _maxNum = maxNum;
                _divide = divide;
            }

            public object Current { get; private set; }

            public bool MoveNext()
            {
                do
                {
                    if (currentNum % _divide == 0)
                    {
                        Current = currentNum;
                        return true;
                    }

                    currentNum++;
                } while (currentNum <= _maxNum);

                return false;
            }

            public void Reset()
            {
                currentNum = 1;
            }
        }
    }
}
