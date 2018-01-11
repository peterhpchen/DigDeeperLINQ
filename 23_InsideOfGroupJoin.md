# GroupJoin的原碼探索

今天要來看`GroupJoin`的內部實作，知道`GroupJoin`的使用方式後，應該不難猜出它的實作可能跟`Join`很相似: 因為`GroupJoin`主要還是做`Join`的動作，只是最後加了個`resultSeletor`讓它可以對每個鍵值做**彙整**，現在來看看是不是真的是這樣吧。

## 原始碼分析

> Source Code: [GroupJoin.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/GroupJoin.cs)

如往常一樣，我們來看一下`GroupJoin`的公開方法，再一次的如同之前`Join`的原始碼，這裡只做了兩件事:

* **檢查傳入參數**是否為空，如果是空的拋出`ArgumentNull`例外
* 所有參數皆合法的話叫用`GroupJoinIterator`取得`Iterator`之後回傳

其實在*System.Linq*專案中的公開方法都是這樣做處理的，只有做檢查參數的動作，接著就丟給其他**Method**做事，以後如果沒有其他特別的處理，都會像上面一樣用文字說明，就不再貼原始碼了。

接著我們來看一下`GroupJoinIterator`的實作:

```C#
private static IEnumerable<TResult> GroupJoinIterator<TOuter, TInner, TKey, TResult>(
    IEnumerable<TOuter> outer,
    IEnumerable<TInner> inner,
    Func<TOuter, TKey> outerKeySelector,
    Func<TInner, TKey> innerKeySelector,
    Func<TOuter, IEnumerable<TInner>, TResult> resultSelector,
    IEqualityComparer<TKey> comparer)
{
    using (IEnumerator<TOuter> e = outer.GetEnumerator())
    {
        if (e.MoveNext())
        {
            Lookup<TKey, TInner> lookup = Lookup<TKey, TInner>.CreateForJoin(inner, innerKeySelector, comparer);
            do
            {
                TOuter item = e.Current;
                yield return resultSelector(item, lookup[outerKeySelector(item)]);
            }
            while (e.MoveNext());
        }
    }
}
```

這邊可以看到跟`JoinIterator`很像的實作，差別在於下面兩點:

* 未檢查`inner`是否有值就叫傳入`resultSelector`作結果輸出
* 沒有對`inner`再做一次迴圈，而是直接把整包`inner`丟給`resultSelector`

第一點是`GroupJoin`是**Left Join**的原因，在沒有`inner`資料的情況下還是會執行`yield return`，就算只有`outer`的資料也可以回傳。

第二點是`GroupJoin`可以**彙整**資料的原因，因為沒有做迴圈，所以丟給`resultSelector`的是`inner`的**集合**資料，所以可以用集合資料來做**彙整**。

## 測試案例賞析

* Source Code: [GroupJoinTests.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/GroupJoinTests.cs)

### OuterInnerBothSingleNullElement

```C#
[Fact]
public void OuterInnerBothSingleNullElement()
{
    string[] outer = new string[] { null };
    string[] inner = new string[] { null };
    string[] expected = new string[] { null };

    Assert.Equal(expected, outer.GroupJoin(inner, e => e, e => e, (x, y) => x, EqualityComparer<string>.Default));
    Assert.Empty(outer.Join(inner, e => e, e => e, (x, y) => x, EqualityComparer<string>.Default));
}
```

這裡我們可以看到`inner`跟`outer`是有一個`null`的字串陣列，可是他還是會回傳有一個`null`的字串陣列，可是`Join`就會傳回空。

### SelectorsReturnNull

```C#
[Fact]
public void SelectorsReturnNull()
{
    CustomerRec[] outer = new []
    {
        new CustomerRec{ name = "Tim", custID = null },
        new CustomerRec{ name = "Bob", custID = null }
    };
    OrderRec[] inner = new []
    {
        new OrderRec{ orderID = 97865, custID = null, total = 25 },
        new OrderRec{ orderID = 34390, custID = null, total = 19 }
    };
    JoinRec[] expected = new []
    {
        new JoinRec{ name = "Tim", orderID = new int?[]{ }, total = new int?[]{ } },
        new JoinRec{ name = "Bob", orderID = new int?[]{ }, total = new int?[]{ } }
    };

    Assert.Equal(expected, outer.GroupJoin(inner, e => e.custID, e => e.custID, createJoinRec));
}
```

在鍵值為`null`的情形下會拿不到`inner`的資料，可是`outer`的資料依然可以輸出。

## 結語

這次賞析的`GroupJoin`跟`Join`大同小異，最大的差別就在於`GroupJoin`可以不用`inner`的資料也可以輸出，這也是造成`GroupJoin`是**Left Join**的原因，另外也因為`GroupJoin`沒有再做迴圈巡覽`inner`就輸出給`resultSeletor`做處理，所以可以直接**彙整**每個鍵值的資料，跟`Join`在用途及情境上就有差異了。

## 參考

* [dotnet/corefx](https://github.com/dotnet/corefx)