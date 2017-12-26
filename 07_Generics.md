# 變來變去的Generic Type: 泛型介紹
泛型(Generic Type)是一個C#語言的功能，它可以讓你在定義**Class**、**Method**、**Interface**時先不用決定型別，到了要實體化的時候再決定其型別，這在集合的應用([System.Collections.Generic](https://docs.microsoft.com/zh-tw/dotnet/api/system.collections.generic?view=netframework-4.7.1))上更為重要，因為集合通常只是容器而已，只需要訂定巡覽、新增、刪除元素...等的方法，而訂定這些方法並不需要知道元素的型別，管它是字串還是數字，跟容器本身的實作並沒有關係，因此集合用泛型實作是最佳的選擇，而LINQ就是一個集合的應用方法，當然就用到了大量的Generic Type。

## 箱子工廠
為了說明泛型的好處，我們來講一間箱子工廠的故事吧。

有間箱子工廠平常都是生產正方形的箱子: 
```C#
class Program
{
    static void Main(string[] args)
    {
        BoxFactory boxFactory = new BoxFactory();
        boxFactory.Start();
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

    public void Start()
    {
        Console.WriteLine("工廠開始運作");
        SquareBoxMaker maker = new SquareBoxMaker();
        maker.GetSquareBox();
    }
}
```
運作的結果如下:
```
/* 
 * 這是一間箱子工廠
 * 工廠開始運作
 * 正方形箱子製造機建置完成
 * 產生正方形箱子
 */
```

有一天工廠的老闆接到一個大客戶的訂單，興奮地跑到工廠跟廠長說了這個消息。

老闆: 廠長，我剛剛接到一個要生產大量**三角形箱子**的訂單啦~~。

廠長: 可是這個客戶它要的是**三角形的箱子**，工廠裡沒這樣的機器阿!!

老闆: 這是一個大客戶，沒關係，**多買一台**吧。

於是工廠裡就多了一台**製造三角形箱子的機器**: 
```C#
class BoxFactory
{
    public BoxFactory()
    {
        Console.WriteLine("這是一間箱子工廠");
    }
    class SquareBoxMaker
    {
        ...
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

    public void Start()
    {
        Console.WriteLine("工廠開始運作");

        SquareBoxMaker squareBoxMaker = new SquareBoxMaker();
        TriangleBoxMaker triangleBoxMaker = new TriangleBoxMaker();
        squareBoxMaker.GetSquareBox();
        triangleBoxMaker.GetTriangleBox();
    }
}
```
現在工廠運作是這樣的: 
```C#
/*
 * 這是一間箱子工廠
 * 工廠開始運作
 * 正方形箱子製造機建置完成
 * 三角形箱子製造機建置完成
 * 產生正方形箱子
 * 產生三角形箱子
*/
```

過了一陣子，公司就接到了一個客戶要做**圓形的箱子**，不過這個客戶的訂單量很少，為了他買一台圓形箱子的製造機並不划算，可是老闆怎麼會錯過這個賺錢的機會呢。

於是老闆左思右想終於想到了一個方法: 那我們的工廠就生產個比較大的箱子，這個箱子可以放下各個不同形狀的箱子，這樣不管以後再來多少不一樣的需求我都可以賺錢了阿。

廠長聽了老闆的想法後立刻改造了工廠: 
```C#
class BoxFactory
{
    public BoxFactory()
    {
        Console.WriteLine("這是一間箱子工廠");
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

    public void Start()
    {
        Console.WriteLine("工廠開始運作");
        ObjectBoxMaker maker = new ObjectBoxMaker();
        maker.GetBox("Square");
        maker.GetBox("Triangle");
        maker.GetBox("Circle");
    }
}
```
現在工廠的運作狀況變這樣: 
```C#
/*
 * 這是一間箱子工廠
 * 工廠開始運作
 * '大'箱子製造機建置完成
 * 產生'大'箱子
 * 產生'大'箱子
 * 產生'大'箱子
 */
```

又過了一陣子，公司開始接到客戶的抱怨電話: 那個'大'箱子雖然可以容納各種形狀的箱子，但是每次都要打開來**確定它真正的形狀是什麼**，**效率差了一大截**阿。

老闆這下子可真慌了手腳了，弄巧成拙，一時之間又想不出辦法，於是只能硬著頭皮去請救兵-**泛型哥**幫忙，泛型哥聽了老闆的說明以後不慌不忙地將工廠改造成這樣: 
```C#
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
    }
}
```
現在工廠運作變成這樣:
```C#
/*
 * 這是一間箱子工廠
 * 工廠開始運作
 * 箱子製造機建置完成
 * 產生合適的箱子
 * 正方形箱子
 * 產生合適的箱子
 * 三角形箱子
 * 產生合適的箱子
 * 圓形箱子
 */
```

**泛型**哥完美的解決了公司的危機，這個故事也告一個段落了。

接著我們來回顧一下這個故事: 
1. 特定箱子的製造機: 每個製造機只能產出跟其對應形狀的箱子
    * 在**定義類別時就決定了型別**
1. 大箱子的製造機: 此製造機所產出的箱子(Object)是相容於每個不同形狀的箱子
    * 所有的輸出類別都轉為`Object`，使其變為**弱型別**
    * `Object`在取值及附值時都需要**花費轉換的時間**
1. 泛型哥的製造機: 在定義時使用泛型先**暫緩型別的規格定義**，到了**實體化時再定義其型別規格**
    * **強型別**
    * **不需做轉換**

## 泛型方法介紹
泛型可以用在很多地方，像是類別、介面、方法...等，規則大同小異，因為LINQ常用的是泛型方法，所以就方法的部分來做介紹: 
```C#
public T Generic<T>(T b) where T : new()
{
    return new T();
}
```
* 在方法名稱的後面以`<>`括住待定義的型別參數
* 待定義的型別參數名稱習慣以`T`開頭(Ex: `TResult`)
* 泛型可用在**傳入參數**及**回傳值**
* 可以以`where`定義型別參數的條件，以此例來說，`where T : new()`定義`T`有建構子，如此一來我們才可以在`new T()`，請參考[Microsoft Docs-型別參數的條件約束](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters)

## 結語
泛型非常好用，比起Object既是強型別又不用轉換，也比特定型別定義來的有彈性，可以大大減少程式碼的編寫量，又可以寫出可讀性更高的程式，好泛型，不用嗎?

## 範例程式
[GitHub](https://github.com/peterhpchen/DigDeeperLINQ/tree/07_Generics/demo/07_Generics)

## 參考
* [Microsoft Docs-泛型](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/generics/)
* [Microsoft Docs-System.Collections.Generic](https://docs.microsoft.com/zh-tw/dotnet/api/system.collections.generic?view=netframework-4.7.1)