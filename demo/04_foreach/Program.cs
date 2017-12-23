using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace LINQTest
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("int[]");
            arrayForeach();
            Console.WriteLine("String");
            stringForeach();
            Console.WriteLine("int");
            intForeach();
        }

        static void arrayForeach()
        {
            int[] integers = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9 };

            Console.WriteLine($"Is Array: {integers is Array}"); //Is Array: true

            foreach (int integer in integers)
            {
                Console.Write($"{integer} ");
            } // 1 2 3 4 5 6 7 8 9 

            Console.WriteLine();
        }

        static void stringForeach()
        {
            String integers = "123456789";

            Console.WriteLine($"Is Array: {integers is Array}"); //Is Array: false

            foreach (char integer in integers)
            {
                Console.Write($"{integer} ");
            } // 1 2 3 4 5 6 7 8 9 

            Console.WriteLine();
        }

        static void intForeach()
        {
            Integers integers = new Integers(123456789);

            foreach (int integer in integers)
            {
                Console.Write($"{integer} ");
            } // 1 2 3 4 5 6 7 8 9 

            Console.WriteLine();
        }
    }

    public class IntegerEnum : IEnumerator
    {
        private int _integers;
        private int _index;
        private int _maxDigit;
        public object Current { get; private set; }

        public IntegerEnum(int integers)
        {
            _integers = integers;
            _index = 0;
            _maxDigit = (int)Math.Log10(integers);
        }

        public bool MoveNext()
        {
            if (_maxDigit < _index) return false;

            Current = getCurrent();
            _index++;

            return true;
        }

        private int getCurrent()
        {
            int currentDigit = _maxDigit - _index;
            int result = (_integers / (int)Math.Pow(10, currentDigit)) % 10;  //Get first digit

            return result;
        }

        public void Reset()
        {
            _index = 0;
        }
    }

    public class Integers : IEnumerable
    {
        private int _integers;

        public Integers(int integers)
        {
            _integers = integers;
        }

        public IEnumerator GetEnumerator()
        {
            return new IntegerEnum(_integers);
        }
    }
}
