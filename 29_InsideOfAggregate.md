# Aggregate的原碼探索

這次我們要來看Aggregate的原始碼，由上一章的介紹可以知道Aggregate的功能是把前面元素的彙整結果傳到目前的元素再跟其合併並且再傳至下個元素，這樣累加的方式實際上是怎麼實作的呢? 讓我們來看看吧。

## 原始碼分析

> Source Code: [Aggregate.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Aggregate.cs)

前一章介紹到Aggregate有三個公開方法，我們依照慣例由單純開始。

### 第一個方法

第一個是只有一個`func`運算式參數的方法:

```C#
public static TSource Aggregate<TSource>(this IEnumerable<TSource> source, Func<TSource, TSource, TSource> func)
{
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }

    if (func == null)
    {
        throw Error.ArgumentNull(nameof(func));
    }

    using (IEnumerator<TSource> e = source.GetEnumerator())
    {
        if (!e.MoveNext())
        {
            throw Error.NoElements();
        }

        TSource result = e.Current;
        while (e.MoveNext())
        {
            result = func(result, e.Current);
        }

        return result;
    }
}
```

這個方法有幾個重點:

* 檢查傳入參數(`source`、`func`)是否為空，如果為空則拋出`ArgumentNull`例外
* 通過參數檢查後，取得`Enumerator`(`GetEnumerator()`)開始巡覽
* 如果沒有集合沒有元素，拋出`NoElements`例外
* 有元素的話將自己的數值丟給`func`，然後執行`func`
* 每次將`func`的結果傳給`result`，下一輪再丟進`func`
* 巡覽結束就傳回結果

每次都將自己上一輪的結果再丟進`func`中，可以做到**彙整**的處理，從這裡我們也可以看到`Aggregate`並**沒有延遲執行**的特性，因為在叫用的時候馬上就做巡覽了，並不像是之前介紹的方法是回傳**Iterator**。

### 第二個方法

第二個方法多了一個`seed`參數的方法:

```C#
public static TAccumulate Aggregate<TSource, TAccumulate>(this IEnumerable<TSource> source, TAccumulate seed, Func<TAccumulate, TSource, TAccumulate> func)
{
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }

    if (func == null)
    {
        throw Error.ArgumentNull(nameof(func));
    }

    TAccumulate result = seed;

    foreach (TSource element in source)
    {
        result = func(result, element);
    }

    return result;
}
```

與第一個方法比較，兩個方法的差距只有`result`的起始值:

* 第一個方法: `TSource result = e.Current;`
* 第二個方法: `TAccumulate result = seed;`

我們可以看到有`seed`傳入參數的方法將`seed`當作第一次的`result`，這讓我們可以不用一定要把第一個元素當作起始值，對於不一定會取第一個元素值做彙整的處理來說是必要的。

### 第三個方法

與第二個方法比起來，第三個方法多了一個`resultSelector`的`Lambda`:

```C#
public static TResult Aggregate<TSource, TAccumulate, TResult>(this IEnumerable<TSource> source, TAccumulate seed, Func<TAccumulate, TSource, TAccumulate> func, Func<TAccumulate, TResult> resultSelector)
{
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }

    if (func == null)
    {
        throw Error.ArgumentNull(nameof(func));
    }

    if (resultSelector == null)
    {
        throw Error.ArgumentNull(nameof(resultSelector));
    }

    TAccumulate result = seed;

    foreach (TSource element in source)
    {
        result = func(result, element);
    }

    return resultSelector(result);
}
```

我們可以看到第三跟第二個方法的差別再最後一行的`return`:

* 第二個方法: `return result;`
* 第三個方法: `return resultSelector(result);`

所以從兩者的差別上我們可以知道，最後的`return`多了`resultSelector`的叫用，讓我們可以做最後的處理。

## 測試案例賞析

> Source Code: [AggregateTests.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/AggregateTests.cs)

### EmptySourceAndSeed

```C#
[Fact]
public void EmptySourceAndSeed()
{
    int[] source = { };
    long seed = 2;
    long expected = 2;

    Assert.Equal(expected, source.Aggregate(seed, (x, y) => x * y));
}
```

`expected`會是**2**是因為`source`雖然是空陣列，但並不是`null`，所以不會拋出例外，再來就是`source`是空所以不會做巡覽，因此`seed`的值就會是回傳值。

## 結語

這次看的Aggregate是一個比較特別的方法，首先他並不是延遲執行的，再來是會參考上一個元素的資料，讓我們看到了不一樣的寫法實作。

## 參考

[dotnet/corefx](https://github.com/dotnet/corefx)