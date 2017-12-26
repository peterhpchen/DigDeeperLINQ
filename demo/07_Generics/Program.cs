using System;

namespace _07_Generics
{
    class Program
    {
        static void Main(string[] args)
        {
            BoxFactory boxFactory = new BoxFactory();
            boxFactory.Start();
        }
        public T Generic<T>(T b) where T : new()
        {
            return new T();
        }
    }

    class SquareBox
    {
        public SquareBox()
        {
            Console.WriteLine("正方形箱子");
        }
    }

    class TriangleBox
    {
        public TriangleBox()
        {
            Console.WriteLine("三角形箱子");
        }
    }

    class CircleBox
    {
        public CircleBox()
        {
            Console.WriteLine("圓形箱子");
        }
    }

    class BoxFactory
    {
        public BoxFactory()
        {
            Console.WriteLine("這是一間箱子工廠");
        }

        class SquareBoxMaker
        {
            public SquareBoxMaker()
            {
                Console.WriteLine("正方形箱子製造機建置完成");
            }

            public SquareBox GetSquareBox()
            {
                Console.WriteLine("產生正方形箱子");
                return new SquareBox();
            }
        }

        class TriangleBoxMaker
        {
            public TriangleBoxMaker()
            {
                Console.WriteLine("三角形箱子製造機建置完成");
            }

            public TriangleBox GetTriangleBox()
            {
                Console.WriteLine("產生三角形箱子");
                return new TriangleBox();
            }
        }

        class ObjectBoxMaker
        {
            public ObjectBoxMaker()
            {
                Console.WriteLine("'大'箱子製造機建置完成");
            }

            public object GetBox(string shape)
            {
                Console.WriteLine("產生'大'箱子");
                if (shape == "Triangle") return new TriangleBox();
                if (shape == "Square") return new SquareBox();
                return new CircleBox();
            }
        }

        class GenericBoxMaker
        {
            public GenericBoxMaker()
            {
                Console.WriteLine("箱子製造機建置完成");
            }

            public object GetBox<T>() where T : new()
            {
                Console.WriteLine("產生合適的箱子");
                return new T();
            }
        }

        public void Start()
        {
            Console.WriteLine("工廠開始運作");

            GenericBoxMaker maker = new GenericBoxMaker();
            maker.GetBox<SquareBox>();
            maker.GetBox<TriangleBox>();
            maker.GetBox<CircleBox>();

            // ObjectBoxMaker maker = new ObjectBoxMaker();
            // maker.GetBox("Square");
            // maker.GetBox("Triangle");
            // maker.GetBox("Circle");
            // SquareBoxMaker squareBoxMaker = new SquareBoxMaker();
            // TriangleBoxMaker triangleBoxMaker = new TriangleBoxMaker();
            // squareBoxMaker.GetSquareBox();
            // triangleBoxMaker.GetTriangleBox();
        }
    }
}
