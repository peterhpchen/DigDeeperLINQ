# SelectMany的原碼探險
`Select`及`SelectMany`的差別在前一章的說明後應該有個初步的了解了，知道了應用的方式後我們接著來看看它是怎麼做到的吧。

## 原始碼分析
* Source Code: https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/SelectMany.cs
* Public Method: `SelectMany`總共有四個多載的方法，兩個是只有**一個**`selector`，另外兩個是有**兩個**`selector`(`collectionSelector`及`resultSelector`)
```C#
/* 下面兩個方法只有一個selector */
public static IEnumerable<TResult> SelectMany<TSource, TResult>(    // 4
    this IEnumerable<TSource> source, 
    Func<TSource, IEnumerable<TResult>> selector);
    
public static IEnumerable<TResult> SelectMany<TSource, TResult>(    // 1
    this IEnumerable<TSource> source, 
    Func<TSource, int, IEnumerable<TResult>> selector); // 多一個int參數

/* 下面兩個方法有兩個selector */
public static IEnumerable<TResult> SelectMany<TSource, TCollection, TResult>(   // 2
    this IEnumerable<TSource> source, 
    Func<TSource, IEnumerable<TCollection>> collectionSelector, 
    Func<TSource, TCollection, TResult> resultSelector);
    
public static IEnumerable<TResult> SelectMany<TSource, TCollection, TResult>(   // 3
    this IEnumerable<TSource> source, 
    Func<TSource, int, IEnumerable<TCollection>> collectionSelector, // 多一個int參數
    Func<TSource, TCollection, TResult> resultSelector);
```
* 方法的右邊註解的數字為等下講解的順序

1. 第一個看的是只有**一個**`selector`但有`int`傳入參數的方法: 
```C#
public static IEnumerable<TResult> SelectMany<TSource, TResult>(
    this IEnumerable<TSource> source, Func<TSource, int, IEnumerable<TResult>> selector)
{
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }

    if (selector == null)
    {
        throw Error.ArgumentNull(nameof(selector));
    }

    return SelectManyIterator(source, selector);
}
```
* 判斷`source`及`selector`是否為空，為空的話丟`ArgumentNull`例外
* 傳回`SelectManyIterator`

到這裡跟`Select`幾乎一模一樣，唯一有差別的就只有最後的回傳值，`SelectMany`是傳回`SelectManyIterator`，相信特別之處就是在這裡，我們來看看`SelectMany`的定義: 
```C#
private static IEnumerable<TResult> SelectManyIterator<TSource, TResult>(
    IEnumerable<TSource> source, Func<TSource, int, IEnumerable<TResult>> selector)
{
    int index = -1;
    foreach (TSource element in source)
    {
        checked
        {
            index++;
        }

        foreach (TResult subElement in selector(element, index))
        {
            yield return subElement;
        }
    }
}
```
* 此方法區塊為`yield`區塊，會轉為`Iterator Pattern`，回傳的資料是`IEnumerable`的集合
* `yield return`傳回**每一個元素**的資料
* 每個元素的`index`較前面的元素多加**1**
* `selector`執行後取得每個元素的**子集合**資料，再用`foreach`巡覽整個**子集合**
* 傳回**子集合**的每個元素

我們可以看到跟`SelectIterator`還是幾乎一模一樣，差別在於**第二個**`foreach`，還記得我們前面講**SelectMany的應用**時比較了跟`Select`的差別之處就是`SelectMany`不用多一個迴圈去處理子集合的資料，從原始碼中觀察就更加明顯了，原來`SelectMany`已經幫我們把**第二個**迴圈要做的事情給做掉了。

2. 接著我們要來看有兩個`selector`(collectionSelector及resultSelector)但`CollectionSelector`沒有`int`參數的方法: 
```C#
public static IEnumerable<TResult> SelectMany<TSource, TCollection, TResult>(
    this IEnumerable<TSource> source, 
    Func<TSource, IEnumerable<TCollection>> collectionSelector, 
    Func<TSource, TCollection, TResult> resultSelector)
{
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }

    if (collectionSelector == null)
    {
        throw Error.ArgumentNull(nameof(collectionSelector));
    }

    if (resultSelector == null)
    {
        throw Error.ArgumentNull(nameof(resultSelector));
    }

    return SelectManyIterator(source, collectionSelector, resultSelector);
}
```
* 判斷`source`及`selector`是否為空，空的話丟出`ArgumentNull`的例外
* 傳回`SelectManyIterator`

這個方法跟剛剛介紹的第一個`SelectMany`的方法差在多了一個`if`判斷`resultSelector`是否為空，然後回傳的方法`SelectManyIterator`有**三個參數**，想當然，這裡不會是重點所在，我們接著來看看這個有**三個參數**的`SelectManyIterator`: 
```C#
private static IEnumerable<TResult> SelectManyIterator<TSource, TCollection, TResult>(
    IEnumerable<TSource> source, 
    Func<TSource, IEnumerable<TCollection>> collectionSelector, 
    Func<TSource, TCollection, TResult> resultSelector)
{
    foreach (TSource element in source)
    {
        foreach (TCollection subElement in collectionSelector(element))
        {
            yield return resultSelector(element, subElement);
        }
    }
}
```
* 回傳值為`resultSelector`執行後的結果

跟第一個介紹的方法差別只差在子集合的元素要回傳前再去執行了`resultSelector`，這樣的目的就是可以輸出**子集合**跟**原集合**合併的資料。

我們可以看到它跟第一個方法的結構是完全一樣的，但是有`resultSelector`的幫助讓我們可以更省力的拿到自己想要的檔案。

3. **第三個**方法是有`int`的`collectionSelector`的方法，因為方法的實作跟**第二個**完全一樣，我們就直接來看`SelectManyIterator`的實作: 
```C#
private static IEnumerable<TResult> SelectManyIterator<TSource, TCollection, TResult>(
    IEnumerable<TSource> source, 
    Func<TSource, int, IEnumerable<TCollection>> collectionSelector, 
    Func<TSource, TCollection, TResult> resultSelector)
{
    int index = -1;
    foreach (TSource element in source)
    {
        checked
        {
            index++;
        }

        foreach (TCollection subElement in collectionSelector(element, index))
        {
            yield return resultSelector(element, subElement);
        }
    }
}
```

學一套就會了全部，這個方法中完全沒有新的東西，只是把第一跟第二個方法合併起來而已。

* 用`index`來給予每個`selector`位置的資訊(第一個方法)
* 回傳`resultSelector`執行結果(第二個方法)

4. 接著我們要來看最後一個方法了: 
```C#
public static IEnumerable<TResult> SelectMany<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, IEnumerable<TResult>> selector)
{
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }

    if (selector == null)
    {
        throw Error.ArgumentNull(nameof(selector));
    }

    return new SelectManySingleSelectorIterator<TSource, TResult>(source, selector);
}
```

跟前面的方法一樣，判斷參數是否為空，如果都是合法的就傳給`Iterator`做事，眼尖的人應該有發現到這次叫用的`Iterator`跟前面方法叫用的並不相同，看來是有什麼秘密藏在這裡喔，我們來看看吧: 
```C#
private sealed class SelectManySingleSelectorIterator<TSource, TResult> : 
    Iterator<TResult>, 
    IIListProvider<TResult>
```
這是一個實作了`Iterator`的`Class`，看到`Iterator`的`Class`自然就會想看看它的`MoveNext`，以下是它的實作: 
```C#
public override bool MoveNext()
{
    switch (_state)
    {
        case 1:
            // Retrieve the source enumerator.
            _sourceEnumerator = _source.GetEnumerator();
            _state = 2;
            goto case 2;
        case 2:
            // Take the next element from the source enumerator.
            if (!_sourceEnumerator.MoveNext())
            {
                break;
            }

            TSource element = _sourceEnumerator.Current;

            // Project it into a sub-collection and get its enumerator.
            _subEnumerator = _selector(element).GetEnumerator();
            _state = 3;
            goto case 3;
        case 3:
            // Take the next element from the sub-collection and yield.
            if (!_subEnumerator.MoveNext())
            {
                _subEnumerator.Dispose();
                _subEnumerator = null;
                _state = 2;
                goto case 2;
            }

            _current = _subEnumerator.Current;
            return true;
    }

    Dispose();
    return false;
}
```
* `_state`在`GetEnumerator()`時會設為**1**(請參考第11章-*Select的原碼探險*)
* `_state`為**1**時取得**集合**的`Enumerator`
* `_state`為**2**時對集合執行`_selector`取得目標資料，到這裡為止就是`Select`的`MoveNext()`所做的事，但`SelectMany`將目標資料的`Enumerator`取得放進`_subEnumerator`並且進入**第三狀態**(`_state=3`)
* `_state`為**3**時將子集合的`Enumerator`(`_subEnumerator`)做巡覽放進`_current`裡面，如果巡覽終止則將狀態調回**2**(`_state=2`)

實際上`SelectMany`比`Select`多了一層的`MoveNext()`來取得子集合的元素資料，達到扁平化的目的。

## 測試案例分析
* Source Code: https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/SelectManyTests.cs
### ParameterizedTests
```C#
[Theory]
[MemberData(nameof(ParameterizedTestsData))]
public void ParameterizedTests(IEnumerable<int> source, Func<int, IEnumerable<int>>selector)
{
    var expected = source.Select(i => selector(i)).Aggregate((l, r) => l.Concat(r));
    var actual = source.SelectMany(selector);

    Assert.Equal(expected, actual);
    Assert.Equal(expected.Count(), actual.Count()); // SelectMany may employ an optimized Count implementation.
    Assert.Equal(expected.ToArray(), actual.ToArray());
    Assert.Equal(expected.ToList(), actual.ToList());
}

public static IEnumerable<object[]> ParameterizedTestsData()
{
    for (int i = 1; i <= 20; i++)
    {
        Func<int, IEnumerable<int>> selector = n => Enumerable.Range(i, n);
        yield return new object[] { Enumerable.Range(1, i), selector };
    }
}
```

`Aggregate()`會將每個目前巡覽的結果向後一個元素丟，以上述程式碼為例`Aggregate((l, r) => l.Concat(r))`: 
* `l`: 前個元素執行`Aggregate`後的值
* `r`: 目前的元素值

所以`Aggregate((l, r) => l.Concat(r))`是把所有元素合為一個`IEnumerable`，而在這個測試案例我們可以發現到`SelectMany()`可以轉為`Select().Aggregate((l, r) => l.Concat(r))`。

### DisposeAfterEnumeration

這是一個驗證`Dispose`執行的測試，在剛剛觀察程式碼後我們知道在巡覽(`MoveNext()`)過程中會產生兩層`Enumerator`(**Source**及**Sub**)，這個測試就是要確定`Enumerator`都有在應該`Dispose`時`Dispose`，由於案例較長，我們節錄重要的部分: 
```C#
using (e)   // Enumerator
{
    while (e.MoveNext())
    {
        int item = e.Current;

        Assert.Equal(subState[subIndex], item); // Verify Current.
        Assert.Equal(index / subLength, subIndex);

        // 第一層的Source巡覽結束後才會Dispose
        Assert.False(sourceDisposed); // Not yet.

        // This represents whehter the sub-collection we're iterating thru right now
        // has been disposed. Also not yet.
        Assert.False(subCollectionDisposed[subIndex]);  // 目前的Sub因還在執行巡覽所以不會Dispose

        // However, all of the sub-collections before us should have been disposed.
        // Their indices should also be maxed out.
        Assert.All(subState.Take(subIndex), s => Assert.Equal(subLength + 1, s));

        // 此Source中的其他已巡覽完的Sub會Dispose
        Assert.All(subCollectionDisposed.Take(subIndex), t => Assert.True(t));        

        index++;
    }
}

// 巡覽結束Source會Dispose
Assert.True(sourceDisposed);
Assert.Equal(sourceLength, subIndex);
Assert.All(subState, s => Assert.Equal(subLength + 1, s));
Assert.All(subCollectionDisposed, t => Assert.True(t));
```
* `Source`在全部巡覽完後`Dispose`
* 之前的`Sub`都應該`Dispose`

### CollectionInterleavedWithLazyEnumerables_ToArray
我們都知道`IEnumerable`只會知道目前的元素資料，它是屬於一種**延遲執行**的巡覽方式，而**陣列**跟`Enumerable`的狀況不同，它一開始就知道**所有的元素值**了，那如果把它們兩個同時放到一個`IEnumerable`要如何處理呢? 例如像下面這樣: 
```C#
// Marker at the end
new IEnumerable<int>[]
{
    new TestEnumerable<int>(new int[] { 0 }),
    new TestEnumerable<int>(new int[] { 1 }),
    new TestEnumerable<int>(new int[] { 2 }),
    new int[] { 3 },
}
```

當然我們還是可以把**陣列**當作`IEnumerable`去做處理，這在一般的處理中是可以的(因為都必須要Call `MoveNext()`)，但在`ToArray()`中你的目標本來就是要轉為**Array**了，你卻要把**陣列**轉成`IEnumerable`再轉成**Array**怎麼樣都划不來，因此`SelectMany`的`ToArray()`用了一個`Marker`來表示集合中的陣列，我們先來看程式碼: 
```C#
public TResult[] ToArray()
{
    var builder = new SparseArrayBuilder<TResult>(initialize: true);
    var deferredCopies = new ArrayBuilder<IEnumerable<TResult>>();

    foreach (TSource element in _source)
    {
        IEnumerable<TResult> enumerable = _selector(element);

        /* 
         * 是陣列(或是非延遲的集合)嗎?
         * Yes: 將其的位置(Index)及數量(Count)加到builder.Markers中，然後傳回true
         * No: 加到builder中，然後回傳false
         */
        if (builder.ReserveOrAdd(enumerable))
        {
            // 陣列內容加到deferredCopies中
            deferredCopies.Add(enumerable);
        }
    }

    // 將builder中的資料做ToArray的動作(因為已經排除了陣列的資料，所以沒有做多餘的轉換)
    TResult[] array = builder.ToArray();

    ArrayBuilder<Marker> markers = builder.Markers; // 取得陣列位置(Index)及數量(Count)資訊
    for (int i = 0; i < markers.Count; i++)
    {
        Marker marker = markers[i];
        IEnumerable<TResult> enumerable = deferredCopies[i];    // 取得陣列內容
        EnumerableHelpers.Copy(enumerable, array, marker.Index, marker.Count);  // 複製到剛剛builder轉出來的陣列中
    }

    return array;
}
```

從上述的程式碼說明可以知道`ToArray()`的運作細節，這個測試案例就是在測這個部分，我是因為看到這個案例才知道它的實作方式這麼的特別，所以才在測試案例這個單元做說明，如果想要深入了解的可以仔細看看這個測試案例。

## 結語
`SelectMany`是在`Select`的基礎上多做事情，整體的邏輯更為複雜，希望透過本文的介紹可以讓大家更加了解這個方法的原理。

## 參考
* [dotnet/corefx](https://github.com/dotnet/corefx)
* [Enumerable.Aggregate](https://msdn.microsoft.com/zh-tw/library/bb548651(v=vs.110).aspx)