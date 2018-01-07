using System;
using System.Collections.Generic;
using System.Linq;

namespace _20_HowToUseJoin
{
    class Program
    {
        class Person
        {
            public string Name { get; set; }
        }

        class Phone
        {
            public string PhoneNumber { get; set; }
            public Person Person { get; set; }
        }

        static void Main(string[] args)
        {
            Person Peter = new Person() { Name = "Peter" };
            Person Sunny = new Person() { Name = "Sunny" };
            Person Tim = new Person() { Name = "Tim" };
            Person May = new Person() { Name = "May" };

            Phone num1 = new Phone() { PhoneNumber = "01-5555555", Person = Peter };
            Phone num2 = new Phone() { PhoneNumber = "02-5555555", Person = Sunny };
            Phone num3 = new Phone() { PhoneNumber = "03-5555555", Person = Tim };
            Phone num4 = new Phone() { PhoneNumber = "04-5555555", Person = May };
            Phone num5 = new Phone() { PhoneNumber = "05-5555555", Person = Peter };


            Phone[] phones = new Phone[] { num1, num2, num3, num4, num5 };
            Person[] persons = new Person[] { Peter, Sunny, Tim, May };

            //sort(phones, persons);
            //lostPersonData(phones, persons);
            //lostPhoneData(phones, persons);
            comparer(phones, persons);
        }

        private static void sort(Phone[] phones, Person[] persons)
        {
            var results = persons.Join(
                phones,
                person => person,
                phone => phone.Person,
                (person, phone) => new { name = person.Name, phoneNumber = phone.PhoneNumber });

            foreach (var result in results)
            {
                Console.WriteLine($"{result.name}: {result.phoneNumber}");
            }
            Console.WriteLine();
        }

        private static void lostPersonData(Phone[] phones, Person[] persons)
        {
            IEnumerable<Person> skipPersons = persons.Skip(1);
            var results = skipPersons.Join(phones,
                            person => person,
                            phone => phone.Person,
                            (person, phone) => new { name = person.Name, phoneNumber = phone.PhoneNumber });

            foreach (var result in results)
            {
                Console.WriteLine($"{result.name}: {result.phoneNumber}");
            }
            Console.WriteLine();
        }

        private static void lostPhoneData(Phone[] phones, Person[] persons)
        {
            IEnumerable<Phone> skipPhones = phones.Skip(1);
            var results = persons.Join(skipPhones,
                            person => person,
                            phone => phone.Person,
                            (person, phone) => new { name = person.Name, phoneNumber = phone.PhoneNumber });

            foreach (var result in results)
            {
                Console.WriteLine($"{result.name}: {result.phoneNumber}");
            }
            Console.WriteLine();
        }

        private static void comparer(Phone[] phones, Person[] persons)
        {
            var results = persons.Join(phones,
                            person => person,
                            phone => phone.Person,
                            (person, phone) => new { name = person.Name, phoneNumber = phone.PhoneNumber },
                            new CustomComparer());

            foreach (var result in results)
            {
                Console.WriteLine($"{result.name}: {result.phoneNumber}");
            }
            Console.WriteLine();
        }

        class CustomComparer : IEqualityComparer<Person>
        {
            public bool Equals(Person x, Person y)
            {
                return x.Name.TakeLast(1).FirstOrDefault() == y.Name.TakeLast(1).FirstOrDefault();
            }

            public int GetHashCode(Person obj)
            {
                return obj.Name.TakeLast(1).FirstOrDefault().GetHashCode();
            }
        }
    }
}
