# GroupJoin的原碼探索

今天要來看`GroupJoin`的內部實作，知道`GroupJoin`的使用方式後，我就想過它的實作可能跟`Join`很相似: 因為`GroupJoin`主要還是做`Join`的動作，只是最後加了個`resultSeletor`讓它可以對每個鍵值做彙整，現在來看看是不是真的是這樣吧。

## 原始碼分析

如往常一樣，我們來看一下`GroupJoin`的公開方法，再一次的如同之前`Join`的原始碼，這裡只做了兩件事:

* 檢查傳入參數是否為空，如果是空的拋出`ArgumentNull`例外
* 所有參數皆合法的話叫用`GroupJoinIterator`取得`Iterator`之後回傳

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

這邊可以看到跟`JoinIterator`很像的實作，差別在於