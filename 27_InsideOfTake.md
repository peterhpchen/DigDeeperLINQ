# Take的原碼探索

今天要來說說`Take`的原始碼，由於`Take`跟`Skip`非常的相似，所以有些部分在`Skip`已經說過了，在這裡就只會帶過，不會再深入的說明，這裡建議可以先回去看`Skip`的部分再來看本篇文章。

## 原始碼解析

> Source Code: [Take.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Take.cs)

前面有提到`Take`有三個不同名稱的方法: `Take`、`TakeLast`、`TakeWhile`，下面我們依序來做說明。

### Take

方法的實作如下:

```C#
public static IEnumerable<TSource> Take<TSource>(this IEnumerable<TSource> source, int count)
{
    ...

    if (source is IPartition<TSource> partition)
    {
        return partition.Take(count);
    }

    if (source is IList<TSource> sourceList)
    {
        return new ListPartition<TSource>(sourceList, 0, count - 1);
    }

    return new EnumerablePartition<TSource>(source, 0, count - 1);
}
```

前面檢查傳入參數是否合法的部分用...代替，剩下的是真正做事的地方，這裡會做下面幾件事:

* 如果已經是`IPartition`的類別，直接叫用之前設定的`Take`
* 如果是`IList`，叫用`ListPartition`
* 上述皆不符合的話就叫用`EnumerablePartition`

這裡我們把焦點方到`Skip`中有出現的`ListPartition`跟`EnumerablePartition`上，它們的傳入index跟Skip剛好相反:

* `minIndexInclusive`: 設為`0`，代表從第一個元素開始取
* `maxIndexInclusive`: 設為`count - 1`，因為要從索引值為`0`開始取，所以最後一個元素應該要`count - 1`

這邊看出`Skip`跟`Take`的**互補**關係，`Take`從`0`到`count - 1`，`Skip`從`count`到**最後個**元素，所以兩個合併就會是原本的集合。

### TakeLast

TakeLast的方法有做下面幾件事:

* 檢查傳入參數合法性，如果為**空**則拋出`ArgumentNull`例外
* 如果參數皆合法則叫用`TakeLastIterator`

接下來我們來看一下`TakeLastIterator`:

```C#
private static IEnumerable<TSource> TakeLastIterator<TSource>(IEnumerable<TSource> source, int count)
{
    ...
    Queue<TSource> queue;

    using (IEnumerator<TSource> e = source.GetEnumerator())
    {
        if (!e.MoveNext())
        {
            yield break;
        }

        queue = new Queue<TSource>();
        queue.Enqueue(e.Current);

        while (e.MoveNext())
        {
            if (queue.Count < count)
            {
                queue.Enqueue(e.Current);
            }
            else
            {
                do
                {
                    queue.Dequeue();
                    queue.Enqueue(e.Current);
                }
                while (e.MoveNext());
                break;
            }
        }
    }
    ...
    do
    {
        yield return queue.Dequeue();
    }
    while (queue.Count > 0);
}
```

這段程式我們可以知道:

* 建立一個Queue存放結果集合
* 巡覽將Queue給填滿
* 填滿後，如果集合還沒巡覽結束，則將Queue中的第一個元素丟出，再將目前的元素放入
* 重複丟出放入直到集合巡覽結束
* 將Queue中的元素回傳

這裡跟`Skip`同樣都是用Queue來實作，可是用法卻差很多，`Skip`**不回傳Queue中的元素**，反之`Take`卻是**只回傳Queue中的元素**。

## TakeWhile

`TakeWhile`的公開方法做了下面的事情:

* 判斷傳入參數是否為空，如果空的話拋出`ArgumentNull`的例外
* 傳入參數合法的話則叫用`TakeWhileIterator`

接下來我們來看看`TakeWhileIterator`，他有兩個方法，差別在於`predicate`有沒有傳入`index`參數，我們直接來看有index參數的方法:

```C#
private static IEnumerable<TSource> TakeWhileIterator<TSource>(IEnumerable<TSource> source, Func<TSource, int, bool> predicate)
{
    int index = -1;
    foreach (TSource element in source)
    {
        checked
        {
            index++;
        }

        if (!predicate(element, index))
        {
            break;
        }

        yield return element;
    }
}
```

* 每次跳至下一個元素，index就加1
* 如果符合`predicate`的判斷，就回傳這個元素
* 如果遇到不符合`predicate`的元素，則直接結束巡覽

## 測試案例賞析

> Source Code: [TakeTests.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/TakeTests.cs)、[TakeLastTests.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/TakeLastTests.cs)、[TakeWhileTests.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/TakeWhileTests.cs)

### TakeWhileTests.cs

#### SourceNonEmptyPredicateTrueSomeFalseSecond

```C#
[Fact]
public void SourceNonEmptyPredicateTrueSomeFalseSecond()
{
    int[] source = { 8, 3, 12, 4, 6, 10 };
    int[] expected = { 8 };

    Assert.Equal(expected, source.TakeWhile(x => x % 2 == 0));
}
```

只要遇到不符合`predicate`的元素，之後的元素都不再做判斷直接忽略。

## 結語

這次觀看的Take中跟Skip的相似之處有很多，但是也有不同且特別的部分，從Skip跟Take的原始碼中我覺得收穫最多的就是Queue的運用，利用Queue暫緩回傳時機，可以使回傳的資料有更多的彈性，以後有相關需求時希望可以用上。

## 參考

* [dotnet/corefx](https://github.com/dotnet/corefx)