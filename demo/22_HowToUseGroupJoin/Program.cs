using System;
using System.Linq;

namespace _22_HowToUseGroupJoin
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

            Phone[] phones = new Phone[] { num1, num2, num3,
            num4,
            num5 };
            Person[] persons = new Person[] { Peter, Sunny,
            Tim, May
            };

            //joingroup(phones, persons);
            groupjoin(phones, persons);
            //leftjoin(phones, persons);
            //innerjoin(phones, persons);

        }

        private static void innerjoin(Phone[] phones, Person[] persons)
        {
            var results = persons.Join(
                phones,
                person => person,
                phone => phone.Person,
                (person, phone) =>
                    new
                    {
                        person.Name,
                        phone.PhoneNumber
                    }
            );

            foreach (var result in results)
            {
                Console.WriteLine($"{result.Name}: {result.PhoneNumber}");
            }
            Console.WriteLine();
        }

        private static void joingroup(Phone[] phones, Person[] persons)
        {
            var results = persons.Join(
                phones,
                person => person,
                phone => phone.Person,
                (person, phone) => new { person.Name, phone.PhoneNumber })
                .GroupBy(x => x.Name,
                    (name, data) => new
                    {
                        Name = name,
                        PhoneNumber = string.Join(',', data.Select(x => x.PhoneNumber))
                    });

            foreach (var result in results)
            {
                Console.WriteLine($"{result.Name}: {result.PhoneNumber}");
            }
            Console.WriteLine();
        }

        private static void groupjoin(Phone[] phones, Person[] persons)
        {
            var results = from person in persons
                            join phone in phones on person equals phone.Person into ppGroup
                            select new {person.Name, PhoneNumber= string.Join(',', ppGroup.Select(x => x.PhoneNumber))};
                //persons.GroupJoin(
                //    phones,
                //    person => person,
                //    phone => phone.Person,
                //    (person, phoneEnum) =>
                //        new
                //        {
                //            person.Name,
                //            PhoneNumber = string.Join(',', phoneEnum.Select(x => x.PhoneNumber))
                //        }
                //)
                ;

            foreach (var result in results)
            {
                Console.WriteLine($"{result.Name}: {result.PhoneNumber}");
            }
            Console.WriteLine();
        }

        private static void leftjoin(Phone[] phones, Person[] persons)
        {
            var results = from person in persons
                            join phone in phones on person equals phone.Person into ppGroup
                            from item in ppGroup.DefaultIfEmpty(new Phone() { Person = null, PhoneNumber = ""})
                            select new {name = person.Name, phone = item};
                // persons.GroupJoin(
                // phones,
                // person => person,
                // phone => phone.Person,
                // (person, phoneEnum) => new
                // {
                //     name = person.Name,
                //     phones = phoneEnum.DefaultIfEmpty()
                // })
                // .SelectMany(x => x.phones.Select(phone => new { name = x.name, phone = phone }))
                //;

            foreach (var result in results)
            {
                var phoneNnum = result.phone == null ? "" : result.phone.PhoneNumber;
                Console.WriteLine($"{result.name}: {phoneNnum}");
            }
            Console.WriteLine();
        }

    }
}
