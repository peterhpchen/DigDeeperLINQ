# GroupBy的原碼探索

前面一章提到了我們提到了`GroupBy`的使用方式，LINQ方法提供給我們很多的選擇，讓我們可以在合適的情境下使用這些方法，我們已經會轉動輪子了，現在來看看輪子是怎麼製造出來的吧。

## 原始碼分析

* Source Code: [Grouping.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Grouping.cs)、[Lookup.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Lookup.cs)

`GroupBy`總共有**8**個公開方法，實作如下面程式碼所示:

```C#
#region GroupedEnumerable<TSource, TKey>

public static IEnumerable<IGrouping<TKey, TSource>> GroupBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector) =>
    new GroupedEnumerable<TSource, TKey>(source, keySelector, null);

public static IEnumerable<IGrouping<TKey, TSource>> GroupBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, IEqualityComparer<TKey> comparer) =>
    new GroupedEnumerable<TSource, TKey>(source, keySelector, comparer);

#endregion GroupedEnumerable<TSource, TKey>

#region GroupedEnumerable<TSource, TKey, TElement>

public static IEnumerable<IGrouping<TKey, TElement>> GroupBy<TSource, TKey, TElement>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector) =>
    new GroupedEnumerable<TSource, TKey, TElement>(source, keySelector, elementSelector, null);

public static IEnumerable<IGrouping<TKey, TElement>> GroupBy<TSource, TKey, TElement>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector, IEqualityComparer<TKey> comparer) =>
    new GroupedEnumerable<TSource, TKey, TElement>(source, keySelector, elementSelector, comparer);

#endregion GroupedEnumerable<TSource, TKey, TElement>

#region GroupedResultEnumerable<TSource, TKey, TResult>

public static IEnumerable<TResult> GroupBy<TSource, TKey, TResult>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TKey, IEnumerable<TSource>, TResult> resultSelector) =>
    new GroupedResultEnumerable<TSource, TKey, TResult>(source, keySelector, resultSelector, null);

public static IEnumerable<TResult> GroupBy<TSource, TKey, TResult>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TKey, IEnumerable<TSource>, TResult> resultSelector, IEqualityComparer<TKey> comparer) =>
    new GroupedResultEnumerable<TSource, TKey, TResult>(source, keySelector, resultSelector, comparer);

#endregion GroupedResultEnumerable<TSource, TKey, TResult>

#region GroupedResultEnumerable<TSource, TKey, TElement, TResult>

public static IEnumerable<TResult> GroupBy<TSource, TKey, TElement, TResult>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector, Func<TKey,IEnumerable<TElement>, TResult> resultSelector) =>
    new GroupedResultEnumerable<TSource, TKey, TElement, TResult>(source, keySelector, elementSelector, resultSelector, null);

public static IEnumerable<TResult> GroupBy<TSource, TKey, TElement, TResult>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector, Func<TKey,IEnumerable<TElement>, TResult> resultSelector, IEqualityComparer<TKey> comparer) =>
    new GroupedResultEnumerable<TSource, TKey, TElement, TResult>(source, keySelector, elementSelector, resultSelector, comparer);

#endregion GroupedResultEnumerable<TSource, TKey, TElement, TResult>
```

我已經有用`#region`做了一些整理，它們其實只是分別`new`出四個不同但是相似的類別，列在下面的是它們的名字及建構子的參數:

* `GroupedEnumerable<TSource, TKey>`
    1. `IEnumerable<TSource> source`: 欲做分組的**資料來源**
    1. `Func<TSource, TKey> keySelector`: 分組的**鍵值**
    1. `IEqualityComparer<TKey> comparer`: 比較鍵值是否相同的**等值比較器**
* `GroupedEnumerable<TSource, TKey, TElement>`
    1. `IEnumerable<TSource> source`: *欲做分組的資料來源*
    1. `Func<TSource, TKey> keySelector`: *分組的鍵值*
    1. `Func<TSource, TElement> elementSelector`: 每個**元素的輸出資料**
    1. `IEqualityComparer<TKey> comparer`: *比較鍵值是否相同的等值比較器*
* `GroupedResultEnumerable<TSource, TKey, TResult>`
    1. `IEnumerable<TSource> source`: *欲做分組的資料來源*
    1. `Func<TSource, TKey> keySelector`: *分組的鍵值*
    1. `Func<TKey, IEnumerable<TSource>, TResult> resultSelector`: 每個**組別的輸出資料**
    1. `IEqualityComparer<TKey> comparer`: *比較鍵值是否相同的等值比較器*
* `GroupedResultEnumerable<TSource, TKey, TElement, TResult>`
    1. `IEnumerable<TSource> source`: *欲做分組的資料來源*
    1. `Func<TSource, TKey> keySelector`: *分組的鍵值*
    1. `Func<TSource, TElement> elementSelector`: 每個**元素的輸出給resultSelector的資料**
    1. `Func<TKey, IEnumerable<TElement>, TResult> resultSelector`: *每個組別的輸出資料*
    1. `IEqualityComparer<TKey> comparer`: *比較鍵值是否相同的等值比較器*

這裡我盡量清楚的表示每個方法的差異:

* *斜體字*代表上面一組有的參數，
* **粗體字**表示這個類別多的參數

看了這麼多的類別，看的都眼花撩亂了，但是其實它們都是很相似的類別，我們就挑一個最複雜的`GroupedResultEnumerable<TSource, TKey, TElement, TResult>`來看吧。

### GroupedResultEnumerable<TSource, TKey, TElement, TResult>

此類別目標如下:
> 將資料來源(`source`)用比較器(`comparer`)將鍵值(`keySelector`)分組，再將分組的每個元素用`elementSelector`取得資料丟到`resultSelector`中輸出結果。

知道這個類別要做什麼之後，我們先從建構子看起，實作如下:

```C#
public GroupedResultEnumerable(IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector, Func<TKey, IEnumerable<TElement>, TResult> resultSelector, IEqualityComparer<TKey> comparer)
{
    _source = source ?? throw Error.ArgumentNull(nameof(source));
    _keySelector = keySelector ?? throw Error.ArgumentNull(nameof(keySelector));
    _elementSelector = elementSelector ?? throw Error.ArgumentNull(nameof(elementSelector));
    _comparer = comparer;
    _resultSelector = resultSelector ?? throw Error.ArgumentNull(nameof(resultSelector));
}
```

* 判斷傳入參數(`source`、`keySelector`、`elementSelector`、`resultSelector`)是否為空，空的話拋出`ArgumentNull`例外

建構子就是單純的檢查參數是否合法，接著我們要來看什麼方法相信大家應該猜到了，沒錯，就是當你看到`Enumerable`時就會想到的`GetEnumerator()`:

```C#
public IEnumerator<TResult> GetEnumerator()
{
    Lookup<TKey, TElement> lookup = Lookup<TKey, TElement>.Create(_source, _keySelector, _elementSelector, _comparer);
    return lookup.ApplyResultSelector(_resultSelector).GetEnumerator();
}
```

在`GetEnumerator()`中我們可以看到它去`Create`了一個`Lookup`的實體，看來得把`GroupedResultEnumerable`先擺在一邊了，我們先來看看`Lookup`到底做了什麼吧。

### Lookup<TKey, TElement>

首先來看剛剛`GroupedResultEnumerable`叫用的`Create`方法:

```C#
internal static Lookup<TKey, TElement> Create<TSource>(IEnumerable<TSource> source, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector, IEqualityComparer<TKey> comparer)
{
    Debug.Assert(source != null);
    Debug.Assert(keySelector != null);
    Debug.Assert(elementSelector != null);

    Lookup<TKey, TElement> lookup = new Lookup<TKey, TElement>(comparer);
    foreach (TSource item in source)
    {
        lookup.GetGrouping(keySelector(item), create: true).Add(elementSelector(item));
    }

    return lookup;
}
```

這個`Create`方法有幾個看點:

1. 新建了一個Lookup的實體
    * 如果沒有設定`comparer`的話，用預設(`Default`)的比較器
    * 新建`Grouping`的實體，預設大小為**7**

```C#
private Lookup(IEqualityComparer<TKey> comparer)
{
    _comparer = comparer ?? EqualityComparer<TKey>.Default;
    _groupings = new Grouping<TKey, TElement>[7];
}
```

2. 對`source`集合中每一個元素做兩個階段的處理
    1. 取得此元素所在的組別
    1. 將此元素的資料加到上一階段取得的組別中
3. 傳回已分好組的`lookup`

上述這幾個步驟最重要的就是第二步了，我們來看一下第二步的兩個階段到底做了什麼，先來看`GetGrouping`是如何**取得此元素所在的組別**的。

在看這段程式碼前我們先回想一下`GroupBy`回傳的是什麼? 是一個`Grouping`的集合，每個Grouping內有一個鍵值及其對應的元素組合，在`GetGrouping`中就是要找出目前巡覽到的元素鍵值所在的`Grouping`。

知道了`GetGrouping`目的後，我們來看一下他的定義:

```C#
internal Grouping<TKey, TElement> GetGrouping(TKey key, bool create)
```

`GetGrouping`這裡我們分兩個部份說，可以看到`GetGrouping`有兩個參數，第二個參數的`create`是在`Lookup<TKey, TElement>.Create()`時才會設為`true`，這也就是說`GetGrouping`本身有兩個執行邏輯:

1. 兩種執行邏輯都會先取得傳入鍵值的`HashCode`
    1. 叫用`InternalGetHashCode()`取得鍵值`HashCode`
    1. 叫用客製的比較器(`_comparer`)做取得`HashCode`的處理(如果客製比較器沒有設定是使用`Default`比較器)

```C#
private int InternalGetHashCode(TKey key)
{
    // Handle comparer implementations that throw when passed null
    return (key == null) ? 0 : _comparer.GetHashCode(key) & 0x7FFFFFFF; // 1.ii
}
...
internal Grouping<TKey, TElement> GetGrouping(TKey key, bool create)
{
    int hashCode = InternalGetHashCode(key);    // 1.i
    ...
}
```

2. `create==false`: 取得目前`_groupings`中相同鍵值的`grouping`回傳，如果在`_groupings`中找不到的話同鍵值的`grouping`就回傳`null`
    1. 比對是否已有相同鍵值的`grouping`存在
    1. 比對方式: 先比對`hashCode`，`hashCode`相同再用`Equals`比對
    1. 有相同鍵值的`grouping`則回傳此`grouping`
    1. 沒有的話則傳回`null`

```C#
internal Grouping<TKey, TElement> GetGrouping(TKey key, bool create)
{
    ...
    for (Grouping<TKey, TElement> g = _groupings[hashCode % _groupings.Length]; g != null; g = g._hashNext) // 2.i
    {
        if (g._hashCode == hashCode && _comparer.Equals(g._key, key))   // 2.ii
        {
            // 2.iii
            return g;
        }
    }
    ...
    return null;    // 2.iv
}
```

3. `create==true`: 在新增模式下如果第二步沒有找到相應的`grouping`的話，則新增一個
    1. 判斷是否為新增模式
    1. 新增此鍵值的`Grouping`
    1. 加進`_groupings`中，讓之後的查找找的到
    1. 回傳`grouping`

```C#
internal Grouping<TKey, TElement> GetGrouping(TKey key, bool create)
{
    ...
    if (create) // 3.i
    {
        if (_count == _groupings.Length)
        {
            Resize();
        }

        int index = hashCode % _groupings.Length;
        Grouping<TKey, TElement> g = new Grouping<TKey, TElement>();    // 3.ii
        g._key = key;
        g._hashCode = hashCode;
        g._elements = new TElement[1];
        g._hashNext = _groupings[index];
        _groupings[index] = g;  // 3.iii
        if (_lastGrouping == null)
        {
            g._next = g;
        }
        else
        {
            g._next = _lastGrouping._next;
            _lastGrouping._next = g;
        }

        _lastGrouping = g;
        _count++;
        return g;   // 3.iv
    }
    ...
}
```

執行完`GetGrouping()`後我們得到了一個`Grouping`的物件，這裡面可能已經有元素，因為之前的元素可能跟目前的元素有相同的鍵值，接下來要把目前的元素加到這個`Grouping`裡面，所以叫用了`Grouping`的`Add`方法。

現在`Lookup.Create()`的工作完成了，它把每個元素放進了它該待的`Grouping`中，然後傳回給`GroupedResultEnumerable`。

還記得上面有說`GroupedResultEnumerable`是四種`Enumerable`中最複雜的嗎? 其實介紹到這裡，我們已經把`GroupedEnumerable`要做的事給說完，因為`GroupedEnumerable`比`GroupedResultEnumerable`還要少了**彙整組內資料**的處理，所以`GroupedEnumerable`其實在分完`Grouping`後就已經完成了，那就在這裡先來看看`GetEnumerator()`是怎麼處理分組資料的:

```C#
public IEnumerator<IGrouping<TKey, TElement>> GetEnumerator()
{
    Grouping<TKey, TElement> g = _lastGrouping;
    if (g != null)
    {
        do
        {
            g = g._next;
            yield return g;
        }
        while (g != _lastGrouping);
    }
}
```

* 迴圈將串列中的所有`Grouping`巡覽
* 每個`Grouping`都`yield return`

這裡很單純地用`yield`傳回每個`Grouping`的資料。

接著我們要講講`GroupedResultEnumerable`**彙整組內資料**的處理:

```C#
public IEnumerator<TResult> GetEnumerator()
{
    // 1. 將元素擺到對應鍵值的Grouping中
    Lookup<TKey, TElement> lookup = Lookup<TKey, TElement>.Create(_source, _keySelector, _elementSelector, _comparer);
    // 2. 彙整組內資料
    return lookup.ApplyResultSelector(_resultSelector).GetEnumerator();
}
```

從上面的程式碼可以看到彙整的處理是在`ApplyResultSelector`中發生的，我們來看一下`ApplyResultSelector`裡面做了什麼:

```C#
public IEnumerable<TResult> ApplyResultSelector<TResult>(Func<TKey, IEnumerable<TElement>, TResult> resultSelector)
{
    Grouping<TKey, TElement> g = _lastGrouping;
    if (g != null)
    {
        do
        {
            g = g._next;
            g.Trim();
            yield return resultSelector(g._key, g._elements);
        }
        while (g != _lastGrouping);
    }
}
```

整個流程跟剛剛講到的`GetEnumerator()`一樣，只差在回傳的是`resultSelector`處理過後的資料。

## 測試案例賞析

### Grouping_IList_IsReadOnly

```C#
[Fact]
public void Grouping_IList_IsReadOnly()
{
    IEnumerable<IGrouping<bool, int>> oddsEvens = new int[] { 1, 2, 3, 4 }.GroupBy(i => i % 2 == 0);
    foreach (IList<int> grouping in oddsEvens)
    {
        Assert.True(grouping.IsReadOnly);
    }
}
```

前一章我們在說客製比較器的時候有用基偶數的例子，這裡它是直接用`keySelector`實作。

### AllElementsSameKey

```C#
[Fact]
public void AllElementsSameKey()
{
    string[] key = { "Tim", "Tim", "Tim", "Tim" };
    int[] scores = { 60, -10, 40, 100 };
    var source = key.Zip(scores, (k, e) => new Record { Name = k, Score = e });

    AssertGroupingCorrect(key, source, source.GroupBy(e => e.Name, new AnagramEqualityComparer()), new AnagramEqualityComparer());
}
```

這裡看到一個神奇的東西: `Zip`，它可以把兩個集合合併成一個，太酷了!!

## 結語

要結束之前我們來順一下整個GroupBy的流程:

1. `GroupBy`會去實體化相應的`Enumerable`
1. `Enumerable`會去叫用`Lookup.Create()`取得分組資料
    1. 叫用`GetGrouping`取得對應鍵值的`Grouping`
    1. 將元素用`Add`加入`Grouping`
1. `GroupedEnumerable`的`GetEnumerator()`依序叫用各個`Grouping`
1. `GroupedResultEnumerable`會再叫用`ApplyResultSelector`彙整資料

## 參考

[dotnet/corefx](https://github.com/dotnet/corefx)