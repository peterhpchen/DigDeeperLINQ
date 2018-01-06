using System;
using System.Collections.Generic;
using System.Linq;

namespace _18_HowToUseGroupBy
{
    class Program
    {
        class Person
        {
            public string Name { get; set; }
            public string City { get; set; }
            public int Age { get; set; }
        }

        static void Main(string[] args)
        {
            List<Person> personList = new List<Person>{
                new Person{Name="Peter", City="KHH", Age=40},
                new Person{Name="Eden", City="TPE", Age=35},
                new Person{Name="Scott", City="KHH", Age=27},
                new Person{Name="Tim", City="TPE", Age=18}
            };

            comparison1(personList);
            comparison2(personList);
            comparison3(personList);
            comparison4(personList);
            comparer(personList);
        }

        private static void comparer(List<Person> personList)
        {
            IEnumerable<IGrouping<int, string>> result = personList.GroupBy<Person, int, string>(x => x.Age, x => x.Name, new CustomComparer());

            foreach (IGrouping<int, string> group in result)
            {
                string groupName = group.Key % 2 == 0 ? "Even" : "Odd";
                Console.WriteLine($"{groupName}: {group.Key}");

                foreach (string name in group)
                {
                    Console.WriteLine($"    {name}");
                }
                Console.WriteLine();
            }
        }

        class CustomComparer : IEqualityComparer<int>
        {
            public bool Equals(int x, int y)
            {
                return x % 2 == y % 2;
            }

            public int GetHashCode(int obj)
            {
                return obj % 2;
            }
        }

        private static void comparison4(List<Person> personList)
        {
            Console.WriteLine("Fourth");

            var result = personList.GroupBy(x => x.City, x => x.Age, (city, ages) => new
            {
                City = city,
                Count = ages.Count(),
                Min = ages.Min(age => age),
                Max = ages.Max(age => age)
            });

            foreach (var cityInfo in result)
            {
                Console.WriteLine($"    City: {cityInfo.City}");
                Console.WriteLine($"        Count: {cityInfo.Count}");
                Console.WriteLine($"        Min: {cityInfo.Min}");
                Console.WriteLine($"        Max: {cityInfo.Max}");
                Console.WriteLine();
            }
        }


        private static void comparison3(List<Person> personList)
        {
            Console.WriteLine("Third");

            var result = personList.GroupBy(x => x.City, (city, people) => new
            {
                City = city,
                Count = people.Count(),
                Min = people.Min(person => person.Age),
                Max = people.Max(person => person.Age)
            });

            foreach (var cityInfo in result)
            {
                Console.WriteLine($"    City: {cityInfo.City}");
                Console.WriteLine($"        Count: {cityInfo.Count}");
                Console.WriteLine($"        Min: {cityInfo.Min}");
                Console.WriteLine($"        Max: {cityInfo.Max}");
                Console.WriteLine();
            }
        }

        private static void comparison2(List<Person> personList)
        {
            Console.WriteLine("Second");

            IEnumerable<IGrouping<string, int>> result = personList.GroupBy(x => x.City, x => x.Age);

            foreach (IGrouping<string, int> group in result)
            {
                Console.WriteLine($"    City: {group.Key}");
                int count = 0;
                int min = int.MaxValue;
                int max = int.MinValue;
                foreach (int age in group)
                {
                    count++;
                    if (min > age) min = age;
                    if (max < age) max = age;
                }
                Console.WriteLine($"        Count: {count}");
                Console.WriteLine($"        Min: {min}");
                Console.WriteLine($"        Max: {max}");
                Console.WriteLine();
            }
        }

        private static void comparison1(List<Person> personList)
        {
            Console.WriteLine("First");

            IEnumerable<IGrouping<string, Person>> result = personList.GroupBy(x => x.City);

            foreach (IGrouping<string, Person> group in result)
            {
                Console.WriteLine($"    City: {group.Key}");
                int count = 0;
                int min = int.MaxValue;
                int max = int.MinValue;
                foreach (Person person in group)
                {
                    count++;
                    if (min > person.Age) min = person.Age;
                    if (max < person.Age) max = person.Age;
                }
                Console.WriteLine($"        Count: {count}");
                Console.WriteLine($"        Min: {min}");
                Console.WriteLine($"        Max: {max}");
                Console.WriteLine();
            }
        }
    }
}
