# GroupBy的應用

在整理資料的時候常常都需要給資料做分組，以便更進一步的分析及處理，最常見的分組處理應該就是在餐廳問券上常常會看到的年齡組別的部分，因各個年齡層的喜好並不相同，所以做分組對於分析資料來說非常的重要，在LINQ的應用上也是如此，接著讓我們來看看`GroupBy`要怎麼使用吧。

## 功能說明

使用`GroupBy`時**指定元素的屬性**(欄位)，它就會以這個屬性做**分組**的處理。

請看下面的示意圖(節錄自[Microsoft Docs](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/grouping-data)):

![linq_group](image/18_HowToUseGroupBy/linq_group.png)

我們有一個英文字集合的物件`Source`，想要把各個英文字的資料抓出來，這時就會用到分組的處理，處理完的結果就會像示意圖上的一樣，由單個集合變成多個集合。

## 方法定義

`GroupBy`的方法有很多，應用於各種不同的需求上，我們現在來看看這些方法的定義及說明。

方法總共有**8**個，因為有些方法很相近，所以我們**分4組**來說明，由單純到複雜的順序來介紹，下面先介紹第一組的方法:

```C#
public static IEnumerable<IGrouping<TKey, TSource>> GroupBy<TSource, TKey>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector);

public static IEnumerable<IGrouping<TKey, TSource>> GroupBy<TSource, TKey>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector,
    IEqualityComparer<TKey> comparer);
```

這裡我們看到它們回傳的是`IGrouping<TKey, TSource>`的集合，`IGrouping<TKey, TSource>`就是分組後的資料，每一個`IGrouping`會有一個`Key`值(型別是`TKey`)及同一`Key`值的資料(型別是`TSource`)集合。

再來我們看到傳入參數的部分:

* `keySelector`: 定義要以什麼屬性(欄位)做分組
* `comparer`: 客製的等值比較器，這裡是比較兩個鍵值是否相同來決定要不要分在同一組

第一組的方法是對`source`設定要分組的欄位(`keySelector`)，然後將資料以此欄位分組輸出成已分組的資料(`IGrouping<TKey, TSource>`)集合(`IEnumerable`)。

而這組的兩個方法差在是否要自己設定比較器(`comparer`)，如果不設定的話就會使用預設(`Default`)的比較器。

接著我們來看第二組的方法:

```C#
public static IEnumerable<IGrouping<TKey, TElement>> GroupBy<TSource, TKey, TElement>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector,
    Func<TSource, TElement> elementSelector);

public static IEnumerable<IGrouping<TKey, TElement>> GroupBy<TSource, TKey, TElement>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector,
    Func<TSource, TElement> elementSelector,
    IEqualityComparer<TKey> comparer);
```

跟上組相同，這組的差別也是在有沒有`comparer`的參數，而這組多增加了一個`elementSelector`，這是決定你的每個元素的資料要輸出什麼，在第一組方法時並沒有這個參數，所以第一組會把每個元素的全部物件回傳，如果你只需要特定的屬性(欄位)資料的話就可以使用`elementSelector`去指定，可以想成它是對每個組別中的每個元素做`Select`的處理。

上面介紹的四個方法的回傳資料都是`IGrouping`的集合，就是會拿到**分組的集合的的集合**，會是一個兩層的集合，這是需要**每個元素的詳細資料**時使用的方法，但如果我只是想要拿到每個組別的統計資料呢? 使用上面的方法的話我還要再跑迴圈將每個組別的資料作統整才能得到我要的資料，是不是有點麻煩又多此一舉呢? 後面的兩組方法就是幫我們解決這樣的問題。

我們先來看第三組的方法定義:

```C#
public static IEnumerable<TResult> GroupBy<TSource, TKey, TResult>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector,
    Func<TKey, IEnumerable<TSource>, TResult> resultSelector);

public static IEnumerable<TResult> GroupBy<TSource, TKey, TResult>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector,
    Func<TKey, IEnumerable<TSource>, TResult> resultSelector,
    IEqualityComparer<TKey> comparer);
```

同樣的，這組的兩個方法還是差在有沒有客製的`comparer`，而跟上組的差別如下:

* 回傳值變為`IEnumerable<TResult>`
* 多了一個`resultSelector`

這裡我們可以看到多了一個`resultSelector`的參數，前面兩組的方法都只能將同組的集合各別輸出，而這個方法它可以透過`resultSelector`讓我們可以來指定每組要輸出的資料，它傳入兩個資料:

* `TKey`: 分組依據的屬性
* `IEnumerable<TSource>`: 每組的集合資料

有了這兩個資料我們就能匯出我們想要的資料了。

最後我們來看看最後一組方法:

```C#
public static IEnumerable<TResult> GroupBy<TSource, TKey, TElement, TResult>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector,
    Func<TSource, TElement> elementSelector,
    Func<TKey, IEnumerable<TElement>, TResult> resultSelector);

public static IEnumerable<TResult> GroupBy<TSource, TKey, TElement, TResult>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector,
    Func<TSource, TElement> elementSelector,
    Func<TKey, IEnumerable<TElement>, TResult> resultSelector,
    IEqualityComparer<TKey> comparer);
```

這組跟上面的組別差異在多了一個`elementSelector`，它訂定了要傳入`resultSelector`中的每組的集合資料，跟第二組一樣，這組的方法它可以自己定義每個元素要傳回什麼資料給`resultSelector`，讓`resultSelector`可以拿到所需的資料就好。

## 查詢運算式

依據[C# Spec](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/language-specification/expressions#query-expressions)的定義如下:

```C#
group_clause
    : 'group' expression 'by' expression
    ;
```

單單只觀察這個定義我們是不會知道要怎麼使用的，我們再來看它給我們的例子:

```C#
from c in customers
group c by c.Country into g
select new { Country = g.Key, CustCount = g.Count() }
```

有上面這個例子我們就比較好理解它的用法了:

* `group`後的`expression`: 要做分組處理的資料來源
* `by`後的`expression`: 分組的鍵值

這裡我們還會看到一個`into`，你可以把它想成是把前面所取得的資料(`from c in customers group c by c.Country`)用別名代稱(`g`)，因此它可以轉為下面這樣:

```C#
from g in
    from c in customers
    group c by c.Country
select new { Country = g.Key, CustCount = g.Count() }
```

最後轉為方法時就會是下面這樣:

```C#
customers.
GroupBy(c => c.Country).
Select(g => new { Country = g.Key, CustCount = g.Count() })
```

## 方法範例

範例使用的資料如下:

```C#
class Person
{
    public string Name { get; set; }
    public string City { get; set; }
    public int Age { get; set; }
}
...
List<Person> people = new List<Person>{
    new Person{Name="Peter", City="KHH", Age=40},
    new Person{Name="Eden", City="TPE", Age=35},
    new Person{Name="Scott", City="KHH", Age=27},
    new Person{Name="Tim", City="TPE", Age=18}
};
```

### 四組方法的應用

分別用不同的方法取得每個城市的人數、最大及最小年齡，得到的結果如下:

```C#
City: KHH

    Count: 2
    Min: 27
    Max: 40


City: TPE

    Count: 2
    Min: 18
    Max: 35
```

#### 第一組方法

> public static IEnumerable<IGrouping<TKey, TSource>> GroupBy<TSource, TKey>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector);

```C#
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
```

第一組方法要再做彙整的處理，並且需要兩層的迴圈才能把資料輸出。

#### 第二組方法

> public static IEnumerable<IGrouping<TKey, TElement>> GroupBy<TSource, TKey, TElement>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector,
    Func<TSource, TElement> elementSelector);

```C#
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
```

可以看到因為我們在`GroupBy`的時候只把所需的年齡資訊抓出來，所以在做處理時不用再從`Person`中找出`Age`資料了，變得更為精簡。

#### 第三組方法

> public static IEnumerable<TResult> GroupBy<TSource, TKey, TResult>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector,
    Func<TKey, IEnumerable<TSource>, TResult> resultSelector);

```C#
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
```

第三個方法又更加的簡化了迴圈中需要做的彙整動作，把所有GroupBy需要做的事在方法中就做完了，在迴圈中只有輸出的工作而已。

#### 第四組方法

> public static IEnumerable<TResult> GroupBy<TSource, TKey, TElement, TResult>(
    this IEnumerable<TSource> source,
    Func<TSource, TKey> keySelector,
    Func<TSource, TElement> elementSelector,
    Func<TKey, IEnumerable<TElement>, TResult> resultSelector);

```C#
var result = personList.GroupBy(x => x.City, x=> x.Age,  (city, ages) => new
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
```

最後一組方法則可以簡化`resultSelector`的處理，使其可以專注於它的對象資料(`age`)就好。

這個例子利用了四組方法各個不同的特性，將相同的資料作輸出，雖然越後面的方法，在執行完後需要做的處理越少，但是每個方法都有適用於它的情境，工程師可以就需要查詢的資料做最適當的選擇。

### 比較器的應用

這個例子繼續使用上面的資料(`people`)，這次我想要把基偶數年齡的人分別找出來，為了這個我們需要客製自己的比較器。

```C#
IEnumerable<IGrouping<int, string>> result = personList.GroupBy<Person, int, string>(x => x.Age, x => x.Name, new CustomComparer());

foreach (IGrouping<int, string> group in result)
{
    string groupName = group.Key % 2 == 0 ? "Even" : "Odd";
    Console.WriteLine($"{groupName}");

    foreach (string name in group)
    {
        Console.WriteLine($"    {name}");
    }
    Console.WriteLine();
}
...
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

// output

// Even
//     Peter
//     Tim

// Odd
//     Eden
//     Scott
```

`IEqualityComparer`有下面的重點:

* 要實作`Equals`及`GetHashCode`
* 由`GetHashCode`取得每個元素的雜湊值，如果雜湊值相同才會交由`Equals`比對
* `Equals`比對**相同**傳回`true`，反之傳回`false`

對於`IEqualityComparer`不熟的可以參考[這裡](https://github.com/peterhpchen/TDDTariningByLeetCode/blob/master/LeetCode.No40.CombinationSumII/README.md#iequalitycomparert)。

## 特別之處

### 查詢運算式的特別之處

#### 只有group及select可以是運算式的最後一個指令

來看Query Expression的定義:

```C#
query_expression
    : from_clause query_body
    ;

query_body
    : query_body_clauses? select_or_group_clause query_continuation?
    ;

```

可以看到`query_expression`最後一定要接`query_body`，而`query_body`的最後要接`select_or_group_clause`(`query_continuation`可以不用有)，所以`select`跟`group`會是唯二可以在運算式最後的指令。

### 方法的特別之處

* 有延遲執行的特性，`GetEnumerator`或`foreach`叫用時才會執行
* `comparer`比較出來的鍵值相同，則會回傳第一個鍵值

關於`comparer`的特性，我們用上面比較器的例子來證明，現在印出`groupName`的後面多輸出`group.Key`:

```C#
Console.WriteLine($"{groupName}: {group.Key}");

/*
 * output:
 *
 * Even: 40
 *     Peter
 *     Tim
 *
 * Odd: 35
 *     Eden
 *     Scott
 */
```

的確都是基數偶數年齡的第一筆資料。

## 結語

GroupBy提供給我們很多種的用法，讓我們在某個情境下能找出最合適的方法，帶給我們的不只是便利，也讓我們驚艷能有如此絕妙的方式來做出我們認為複雜的處理，下一章我們來探索到底是怎麼做到的。

## 範例程式

[GitHub](https://github.com/peterhpchen/DigDeeperLINQ/tree/18_HowToUseGroupBy/demo/18_HowToUseGroupBy)

## 參考

* [Microsoft Docs-query-expressions](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/language-specification/expressions#query-expressions)
* [Microsoft Docs-grouping-data](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/grouping-data)
* [Microsoft Docs-groupby](https://docs.microsoft.com/zh-tw/dotnet/api/system.linq.enumerable.groupby?view=netframework-4.7.1)
* [Microsoft Docs-igrouping](https://docs.microsoft.com/zh-tw/dotnet/api/system.linq.igrouping-2?view=netframework-4.7.1)