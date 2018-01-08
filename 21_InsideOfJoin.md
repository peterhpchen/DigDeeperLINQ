# Join的原碼探索

上一章我們講到`Join`的應用方式，在方法中設定`inner`跟`outer`及對應的鍵值就可以取得兩個資料(物件)合併的資料，現在我們來看看他是怎麼做到的吧。

## 原始碼分析

> Source Code: [Join.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Join.cs)

`Join`有**兩個**公開方法，差別在於其中一個多了一個`Comparer`的參數，而這兩個公開方法的實作其實就只差在這個`Comparer`有沒有傳入`Iterator`而已，下面列出了他們的實作流程:

* 判斷傳入的參數是否為空，如果是空則拋出`ArgumentNull`例外
* 如果參數皆合法，則叫用`JoinIterator`取得Join的結果

接下來我們來看`JoinIterator`:

```C#
private static IEnumerable<TResult> JoinIterator<TOuter, TInner, TKey, TResult>(IEnumerable<TOuter> outer, IEnumerable<TInner> inner, Func<TOuter, TKey> outerKeySelector, Func<TInner, TKey> innerKeySelector, Func<TOuter, TInner, TResult> resultSelector, IEqualityComparer<TKey> comparer)
{
    using (IEnumerator<TOuter> e = outer.GetEnumerator())
    {
        if (e.MoveNext())
        {
            Lookup<TKey, TInner> lookup = Lookup<TKey, TInner>.CreateForJoin(inner, innerKeySelector, comparer);
            if (lookup.Count != 0)
            {
                do
                {
                    TOuter item = e.Current;
                    Grouping<TKey, TInner> g = lookup.GetGrouping(outerKeySelector(item), create: false);
                    if (g != null)
                    {
                        int count = g._count;
                        TInner[] elements = g._elements;
                        for (int i = 0; i != count; ++i)
                        {
                            yield return resultSelector(item, elements[i]);
                        }
                    }
                }
                while (e.MoveNext());
            }
        }
    }
}
```

此`Iterator`的流程如下:

* 巡覽`outer`的每個元素
* 取得以`inner`鍵值分組的`inner`元素的`Grouping`
* 用`outer`的鍵值去`inner`的`Grouping`中查找是否有相同的鍵值組別
* 有的話將目前的`outer`及`inner`傳給`resultSelector`取得結果回傳

這裡我們看到了一個熟悉的身影，就是上次介紹`GroupBy`的時候有講解的`Lookup`，它的功用是可以將相同鍵值的物件整理到同一個`Grouping`物件中，這裡它將`inner`分組，`outer`再使用它查找對應的鍵值，藉以取得對應的資料。

這裡也可以看出因為外層是巡覽`outer`，`outer`找到`inner`後才依序輸出`outer`跟`inner`的資料，所以資料排序會是`outer`後才是`inner`。

最後這段實作告訴我們`Join`這個方法確實是**Inner Join**的實作。

## 測試案例賞析

* Source Code: [JoinTests](https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/JoinTests.cs)

```C#
[Fact]
public void SelectorsReturnNull()
{
    int?[] inner = { null, null, null };
    int?[] outer = { null, null };
    Assert.Empty(outer.Join(inner, e => e, e => e, (x, y) => x));
}
```

如果是`null`跟`null`做`Join`的話，還是會得到**空**。

## 結語

這篇的篇幅比較短，真正複雜的分組(`Lookup`)已經在介紹`GroupBy`的時候講解了，這裡就是利用`Lookup`來取得對應的資料，明天我們來介紹另一個`Join`: `GroupJoin`。

## 參考

* [JoinTests](https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/JoinTests.cs)
* [Join.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Join.cs)