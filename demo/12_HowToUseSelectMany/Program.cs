using System;
using System.Collections.Generic;
using System.Linq;

namespace _12_HowToUseSelectMany
{
    class Program
    {
        static void Main(string[] args)
        {
            Store[] stores = new Store[]
            {
                new Store()
                {
                    Name = "App Store",
                    Products = new string[] {"iPhone 8", "iPhone 8s", "iPhone X"}
                },
                new Store()
                {
                    Name = "Google Store",
                    Products = new string[] {"Pixel", "Pixel 2"}
                }
            };

            string[] PCs = new string[] { "ASUS", "ACER", "DELL" };

            //comparison(stores);
            //secondSelector(stores);
            //multiFrom(stores);

            var query = from store in stores
                        from PC in PCs
                        select PC;

            foreach (var product in query)
            {
                Console.WriteLine(product);
            }
        }



        private static void multiFrom(Store[] stores)
        {
            IEnumerable<char> query = from store in stores
                                      from product in store.Products
                                      from c in product
                                      select c;
            foreach (char product in query)
            {
                Console.WriteLine(product);
            }
        }

        private static void secondSelector(Store[] stores)
        {
            var selectMany = stores.SelectMany(store => store.Products, (store, product) => new { StoreName = store.Name, ProductName = product });

            foreach (var product in selectMany)
            {
                Console.WriteLine($"Store Name: {product.StoreName}, Product Name: {product.ProductName}");
            }
        }

        private static void comparison(Store[] stores)
        {
            IEnumerable<string[]> selectQuery = stores.Select(store => store.Products);

            IEnumerable<string> selectManyQuery = stores.SelectMany(store => store.Products);

            Console.WriteLine("**Select**");
            Console.WriteLine();
            foreach (string[] products in selectQuery)
            {
                foreach (string product in products)
                {
                    Console.WriteLine(product);
                }
                Console.WriteLine();
            }

            Console.WriteLine("**SelectMany**");
            Console.WriteLine();
            foreach (string product in selectManyQuery)
            {
                Console.WriteLine(product);
            }
            Console.WriteLine();
        }

        class Store
        {
            public string Name { get; set; }
            public string[] Products { get; set; }
        }
    }
}
