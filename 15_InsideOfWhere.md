# Where的原碼探索
前一章我們講到`Where`的使用方式，`Where`使用起來很直覺，就像用`if else`做判斷一樣，使用一個`bool`回傳型態的`Lambda Expression`就可以篩選我們所需要的資料，既然`Where`使用起來這麼單純，那我們來看看它的原始碼是不是也這麼單純吧。

## 原始碼分析
* Source Code: https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Where.cs
* Methods: `Where`有兩個Public Methods，我們先來看看其中一個: 
```C#
public static IEnumerable<TSource> Where<TSource>(this IEnumerable<TSource> source, Func<TSource, int, bool> predicate)
{
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }
    
    if (predicate == null)
    {
        throw Error.ArgumentNull(nameof(predicate));
    }

    return WhereIterator(source, predicate);
}
```
* 判斷`source`或是`predicate`是否為空，如果是空的就拋`ArgumentNull`的例外
* 如果都是合法參數則回傳`WhereIterator(source, predicate)`

這裡我們依然從委派方法有`index`傳入參數的方法看起，可以看到跟前面介紹的**LINQ方法**在架構上幾乎沒有差別，所以關鍵依然在`Iterator`上，我們來看看`WhereIterator`的實作: 
```C#
private static IEnumerable<TSource> WhereIterator<TSource>(IEnumerable<TSource> source, Func<TSource, int, bool> predicate)
{
    int index = -1;
    foreach (TSource element in source)
    {
        checked
        {
            index++;
        }

        if (predicate(element, index))
        {
            yield return element;
        }
    }
}
```
* `yield`區塊中的yield return是傳回每個元素的值，而整個方法的回傳型別是`IEnumerable`
* 後一個元素會比前個元素多加**1**
* 用`if`接收`predicate`執行後的結果來判斷是否要將目前的元素回傳

`Where`這裡毫無意外的用了`if`的判斷來決定是否要回傳此元素，整段程式的差別也只有這裡，可見只要學會了`Iterator`，大部分的**LINQ方法**都能夠很快的理解。

接著我們要來看第二個Public Method了，這個是`predicate`沒有`index`傳入參數的方法: 
```C#
public static IEnumerable<TSource> Where<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
{
    #region 判斷傳入參數合法性
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }

    if (predicate == null)
    {
        throw Error.ArgumentNull(nameof(predicate));
    }
    #endregion 判斷傳入參數合法性

    #region 依據source的型別決定Iterator
    if (source is Iterator<TSource> iterator)
    {
        return iterator.Where(predicate);
    }

    if (source is TSource[] array)
    {
        return array.Length == 0 ?
            (IEnumerable<TSource>)EmptyPartition<TSource>.Instance :
            new WhereArrayIterator<TSource>(array, predicate);
    }

    if (source is List<TSource> list)
    {
        return new WhereListIterator<TSource>(list, predicate);
    }

    return new WhereEnumerableIterator<TSource>(source, predicate);
    #endregion 依據source的型別決定Iterator
}
```
* 判斷傳入參數`source`及`predicate`是否為空，空的話回傳`ArgumentNull`例外
* 依據`source`的型別決定`Iterator`
    * 已經是`Iterator`的話就直接叫用`Iterator`的`Where`
    * 是`Array`的話回傳`WhereArrayIterator`
    * 是`List`的話回傳`WhereListIterator`
    * 只是`IEnumerable`的話就回傳`WhereEnumerableIterator`

每個`Iterator`的處理都大同小異，主要的差別在對於各個型別的處理而已，我們就挑`WhereArrayIterator`來說明內部運作吧: 
* `MoveNext()`: 這是整個`Iterator`最重要的Method，來看一下`Where`是怎麼實作`MoveNext()`的
```C#
public override bool MoveNext()
{
    int index = _state - 1;
    TSource[] source = _source;

    while (unchecked((uint)index < (uint)source.Length))
    {
        TSource item = source[index];
        index = _state++;
        if (_predicate(item))
        {
            _current = item;
            return true;
        }
    }

    Dispose();
    return false;
}
```
* `_state`為陣列位置的基準，在`GetEnumerator()`執行後會被設為**1**，所以起始的`index`是`_state - 1`
* 巡覽至陣列最尾端，每次都用`predicate`取得是否要回傳元素的判斷
* 通過`predicate`後將`current`設為目前的元素，然後回傳`true`
* 如果巡覽結束則`Dispose`跟`return false`

這裡我們可以看到`_state`的用法跟前面介紹的`SelectMany`是不一樣的，`SelectMany`是用來決定是在**第幾層**的`Enumerator`和巡覽結束後要**跳回**哪層`Enumerator`，而`Where`則是完全當作`index`來使用。

* `GetCount`: 取得集合的元素數量
```C#
public int GetCount(bool onlyIfCheap)
{
    if (onlyIfCheap)
    {
        return -1;
    }

    int count = 0;

    foreach (TSource item in _source)
    {
        if (_predicate(item))
        {
            checked
            {
                count++;
            }
        }
    }

    return count;
}
```
* 如果通過`predicate`的驗證則`count`加**1**

之前我知道了`Where`是**延遲執行**後我就很好奇它的`GetCount()`是怎麼運作的，原來還是會**全部執行後**才取得元素**數量**。

## 測試案例賞析
* Source Code: https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/WhereTests.cs
### Where_SourceThrowsOnGetEnumerator
這個案例的`source`是`ThrowsOnGetEnumerator()`，會在第一個叫用`GetEnumerator()`時丟出`InvalidOperationException`例外。
```C#
protected class ThrowsOnGetEnumerator : TestEnumerator
{
    private int getEnumeratorCallCount;

    public override IEnumerator<int> GetEnumerator()
    {
        if (getEnumeratorCallCount++ == 0)
        {
            throw new InvalidOperationException();
        }

        return base.GetEnumerator();
    }
}

[Fact]
public void Where_SourceThrowsOnGetEnumerator()
{
    IEnumerable<int> source = new ThrowsOnGetEnumerator();
    Func<int, bool> truePredicate = (value) => true;

    var enumerator = source.Where(truePredicate).GetEnumerator();

    // Ensure the first MoveNext call throws an exception
    Assert.Throws<InvalidOperationException>(() => enumerator.MoveNext());

    // Ensure Current is set to the default value of type T
    int currentValue = enumerator.Current;
    Assert.Equal(default(int), currentValue);
    
    // Ensure subsequent MoveNext calls succeed
    Assert.True(enumerator.MoveNext());
    Assert.Equal(1, enumerator.Current);
}
```
要看懂這個測試案例要建立一個觀念: `Where`叫用的`GetEnumerator()`並不是`source`的`GetEnumerator()`，而是`Where`自己的`GetEnumerator()`。

知道這觀念後我們再看測試案例，這樣也就說得通為什麼不是在`var enumerator = source.Where(truePredicate).GetEnumerator();`拋出例外，而是在`enumerator.MoveNext()`丟出例外，由於我們剛剛介紹`Where`的`MoveNext()`的`source`是`Array`的，所以他並沒有叫用`GetEnumerator()`，現在我們來看看`WhereEnumerableIterator`的`MoveNext()`: 
```C#
public override bool MoveNext()
{
    switch (_state)
    {
        case 1:
            _enumerator = _source.GetEnumerator();
            _state = 2;
            goto case 2;
        case 2:
            while (_enumerator.MoveNext())
            {
                TSource item = _enumerator.Current;
                if (_predicate(item))
                {
                    _current = item;
                    return true;
                }
            }

            Dispose();
            break;
    }

    return false;
}
```
這裡才是`source.GetEnumerator()`叫用的地方，所以我們第一次叫用`source`的`GetEnumerator()`是在`MoveNext()`而不是在`Where`叫用`GetEnumerator()`時。

## 結語
Where語法的主要運作原理在於巡覽時使用`predicate`的結果判斷是否將此元素加入結果集合中，簡單的用`if`判斷就可以做出如此實用的方法真的是太棒了。

## 參考
[dotnet/corefx](https://github.com/dotnet/corefx)