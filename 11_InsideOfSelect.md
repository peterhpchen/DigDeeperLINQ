# Select的原碼探險
前面的章節我們提到Select的使用方式，在知道了它神奇的運作方式及效果後，是不是加深了你對其運作方式的好奇心，其實它的運作方式比我們想的都還要單純，現在讓我們來場精彩的探險吧。

## dotnet/corefx使用說明
原碼探險的章節是以[dotnet/corefx](https://github.com/dotnet/corefx)為基礎來做解說的，一般來說每次會參考兩個檔案: 
* *corefx/src/System.Linq/src/System/Linq/{語法名稱}.cs*: 語法的原始碼檔案
* *corefx/src/System.Linq/tests/{語法名稱}Tests.cs*: 語法的測試案例

## 文章結構
在原碼探險的章節中主要會有下面兩個主題: 
* 原始碼分析: 語法的原始碼來做觀察及學習
* 測試案例賞析: 從語法的測試案例挑幾個比較特別的來做介紹

我們會由兩個面相出發，先以觀察原始碼來讓自己對於語法的運作有個初步的概念，再來學習測試案例來強化觀念及增加在原碼分析中沒有注意到的細節概念。

## 原始碼分析
* Source Code: https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Select.cs
* Public Method
```C#
public static IEnumerable<TResult> Select<TSource, TResult>(
    this IEnumerable<TSource> source, Func<TSource, TResult> selector);

public static IEnumerable<TResult> Select<TSource, TResult>(
    this IEnumerable<TSource> source, Func<TSource, int, TResult> selector);
```

我們先來看`selector`有`Index`參數方法的原始碼: 
```C#
public static IEnumerable<TResult> Select<TSource, TResult>(
    this IEnumerable<TSource> source, Func<TSource, int, TResult> selector)
{
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }

    if (selector == null)
    {
        throw Error.ArgumentNull(nameof(selector));
    }

    return SelectIterator(source, selector);
}
```
* 在`source`或是`selector`傳入`null`時會丟出`ArgumentNull`的Exception
* 回傳值為`SelectIterator`

是不是很單純呢? 基本上這裡只有判斷傳入參數的合法性，確定合法後就丟給`SelectIterator`，接著來看一下`SelectIterator`的實作: 
```C#
private static IEnumerable<TResult> SelectIterator<TSource, TResult>(
    IEnumerable<TSource> source, Func<TSource, int, TResult> selector)

int index = -1;
foreach (TSource element in source)
{
    checked
    {
        index++;
    }

        yield return selector(element, index);
    }
}
```
* 這是個`yield`區塊，實作方式為**Iterator Pattern**，回傳的資料是`IEnumerable`型別的集合
* 每一個元素會較前一個元素的`index`多加**1**
* 每個元素的資料會是執行完委派方法`selector`後的結果

到這裡就是有`index`的Select全部的原始碼了，實作主要是基於`yield`的應用，`yield`會擴展為**Iterator Pattern**，在巡覽時藉由叫用`MoveNext()`來對**index加1**以及**將`Selector`執行後的值給予`Cuurent`**，也因為是`Iterator Pattern`所以可以知道有`index`的Select確定是擁有延遲執行的功能的。

接著我們來觀察沒有`index`的Select原始碼如下: 
```C#
public static IEnumerable<TResult> Select<TSource, TResult>(
    this IEnumerable<TSource> source, Func<TSource, TResult> selector)
{
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }

    if (selector == null)
    {
        throw Error.ArgumentNull(nameof(selector));
    }

    if (source is Iterator<TSource> iterator)
    {
        return iterator.Select(selector);
    }

    if (source is IList<TSource> ilist)
    {
        if (source is TSource[] array)
        {
            return array.Length == 0 ?
                EmptyPartition<TResult>.Instance :
                new SelectArrayIterator<TSource, TResult>(array, selector);
        }

        if (source is List<TSource> list)
        {
            return new SelectListIterator<TSource, TResult>(list, selector);
        }

        return new SelectIListIterator<TSource, TResult>(ilist, selector);
    }

    if (source is IPartition<TSource> partition)
    {
        return partition is EmptyPartition<TSource>
            ? EmptyPartition<TResult>.Instance
            : new SelectIPartitionIterator<TSource, TResult>(partition, selector);
    }

    return new SelectEnumerableIterator<TSource, TResult>(source, selector);
}
```
* 在`source`或是`selector`傳入`null`時會丟出`ArgumentNull`的Exception
* 判斷傳入值的型別，分別實作不同的`Iterator`

之前的有`index`的Select因為是借助`yield`來實作，所以我們並不清楚它實作`Iterator`的細節，但從這個Select的原始碼我們就可以清楚的知道實作的`Iterator`長什麼樣子了。

從這段程式中我們可以觀察到一些有趣的事實: 
* `IList`、`Array`、`List`雖然是`IEnumerable`但並不是`Iterator`
* 所有型別在查詢過程中都會被轉為`Iterator`
* 叫用`Select()`後如果再接一個`Select()`會因為第一個`Select`已經是`Iterator`了而直接叫用`iterator.Select(selector)`

接下來觀察`Iterator`的方法定義:
* Source Code: https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Iterator.cs
```C#
internal abstract class Iterator<TSource> : IEnumerable<TSource>, IEnumerator<TSource>
```
* 同時實作了`IEnumerable`跟`IEnumerator`，這也是為什麼我們叫用了LINQ方法後都會變為`IEnumerable`的原因。

往下看到`GetEnumerator()`: 
```C#
public IEnumerator<TSource> GetEnumerator()
{
    Iterator<TSource> enumerator = 
        _state == 0 && _threadId == Environment.CurrentManagedThreadId ? this : Clone();
    enumerator._state = 1;
    return enumerator;
}
```
* 除了叫用第一次`GetEnumerator()`所取得的物件為原本的物件外，其他都是複製出新的實體

最後我們來說說`IPartition`，繼承了這個介面就是要實作取得部分集合的方法，IPartition的方法定義在下面: 
```C#
// 忽略前{count}個元素
IPartition<TElement> Skip(int count);

// 拿取前{count}個元素
IPartition<TElement> Take(int count);

// 取得特定{index}的元素
TElement TryGetElementAt(int index, out bool found);

// 取得第一個元素
TElement TryGetFirst(out bool found);

// 取得最後一個元素
TElement TryGetLast(out bool found);
```

## 測試案例分析
我們剛剛自己走了一輪原碼，現在來看看別人是怎麼去觀察程式碼的，如果說自己去觀察程式碼是自己在闖關，那看測試案例就像在看精彩重播一樣，會讓人學到更多的技巧，我會挑幾個覺得有趣的案例來說明。

1. Select_SourceIsAnArray_ExecutionIsDeferred
```C#
[Fact]
public void Select_SourceIsAnArray_ExecutionIsDeferred()
{
    bool funcCalled = false;
    Func<int>[] source = new Func<int>[] { () => { funcCalled = true; return 1; } };

    IEnumerable<int> query = source.Select(d => d());
    Assert.False(funcCalled);
}
```

這個案例的原由(**延遲執行**)相信大家應該都已經清楚了，我自己在閱覽的時候覺得`funcCalled`這個參數值得一提，就把這案例加進來討論。

大家覺得Lambda陳述式中吃得到`funcCalled`嗎? 看碼說故事: 可以!!

在建立委派方法時，Lambda(或是匿名方法)會擷取在方法中有使用到的外部變數(傳址)，所以可以在Lambda中使用這個外部變數，且外部程式也可以取得在Lambda中變動的變數值。

2. Select_SourceListGetsModifiedDuringIteration_ExceptionIsPropagated
```C#
[Fact]
public void Select_SourceListGetsModifiedDuringIteration_ExceptionIsPropagated()
{
    List<int> source = new List<int>() { 1, 2, 3, 4, 5 };
    Func<int, int> selector = i => i + 1;

    var result = source.Select(selector);
    var enumerator = result.GetEnumerator();

    Assert.True(enumerator.MoveNext());
    Assert.Equal(2 /* 1 + 1 */, enumerator.Current);

    source.Add(6);  // 新增元素會使Iterator拋錯誤
    Assert.Throws<InvalidOperationException>(() => enumerator.MoveNext());
}
```
在叫用`foreach`或是`GetEnumerator()`做巡覽時不能對集合作增減元素的動作，否則會拋`InvalidOperationException`例外。

3. Select_GetEnumeratorCalledTwice_DifferentInstancesReturned
```C#
[Fact]
public void Select_GetEnumeratorCalledTwice_DifferentInstancesReturned()
{
    int[] source = new[] { 1, 2, 3, 4, 5 };
    var query = source.Select(i => i + 1);

    var enumerator1 = query.GetEnumerator();
    var enumerator2 = query.GetEnumerator();

    Assert.Same(query, enumerator1);    // 第一次的GetEnumerator()會是原本的
    Assert.NotSame(enumerator1, enumerator2);   // 第二次或更多會以Clone()複製實體化

    enumerator1.Dispose();
    enumerator2.Dispose();
}
```

這個測試跟我們剛剛觀察`Iterator.GetEnumerator()`時得到的結論互相呼應，當你Call兩次以上的`GetEnumerator()`時就不在是原本的實體了。

4. ForcedToEnumeratorDoesntEnumerateIndexed
```C#
[Fact]
public void ForcedToEnumeratorDoesntEnumerateIndexed()
{
    var iterator = NumberRangeGuaranteedNotCollectionType(0, 3).Select((e, i) => i);
    // Don't insist on this behaviour, but check it's correct if it happens
    var en = iterator as IEnumerator<int>;
    Assert.False(en != null && en.MoveNext());
}
```

* 雖然**Iterator**同時實作了`IEnumerable`跟`IEnumerator`，但在還沒叫用`GetEnumerator()`前是不能做巡覽的，原因為`_state`(控制目前巡覽的狀態(GetEnumerator(): 1、Dispose(): -1))的值在是在`GetEnumerator()`中初始，沒有狀態碼`MoveNext()`會直接判定已經巡覽結束而回傳`false`。

5. MoveNextAfterDispose
這個測試案例有點長，大部分是測試資料，我們擷取主要的部份: 
```C#
IEnumerable<int> result = equivalentSource.Select(i => i);
using (IEnumerator<int> e = result.GetEnumerator())
{
    while (e.MoveNext()) ; // Loop until we reach the end of the iterator, @ which pt it gets disposed.
    Assert.False(e.MoveNext()); // MoveNext should not throw an exception after Dispose.
}
```
* 這是在測試在巡覽結束後再次叫用`MoveNext()`
* 巡覽結束時會去叫用`Dispose()`，程式如下:
```C#
public virtual void Dispose()
{
    _current = default(TSource);
    _state = -1;
}
```
可以看到`Dispose()`只有將`_current`及`_state`調回初始值，所以再次叫用`MoveNext()`時就會`return false`。

## 結語
我們自己一步一步的了解原始碼，經由對原始碼的初步了解去觀察測試案例，在觀看時又進一步的加深對原始碼的了解，有個相輔相成的效果，接下來我們都會依照這樣的方式去講解其他的LINQ方法。

## 參考
* [GitHub-dotnet/corefx](https://github.com/dotnet/corefx)