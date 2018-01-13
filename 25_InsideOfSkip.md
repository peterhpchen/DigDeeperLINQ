# Skip的原碼探索

本章會說明及分析`Skip`、`SkipLast`、`SkipWhile`三個方法的**原始碼實作**及**測試案例欣賞**。

## 原始碼分析

> Source Code: [Skip.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Skip.cs)、[Partition.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Partition.cs)

### Skip

`Skip`有一個公開方法的實作如下:

```C#
public static IEnumerable<TSource> Skip<TSource>(this IEnumerable<TSource> source, int count)
{
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }

    if (count <= 0)
    {
        // Return source if not actually skipping, but only if it's a type from here, to avoid
        // issues if collections are used as keys or otherwise must not be aliased.
        if (source is Iterator<TSource> || source is IPartition<TSource>)
        {
            return source;
        }

        count = 0;
    }

    else if (source is IPartition<TSource> partition)
    {
        return partition.Skip(count);
    }

    if (source is IList<TSource> sourceList)
    {
        return new ListPartition<TSource>(sourceList, count, int.MaxValue);
    }

    return new EnumerablePartition<TSource>(source, count, -1);
}
```

此公開方法做了下面幾件事情:

* 判斷`source`是否為空，空的話拋出`ArgumentNull`的**例外**
* 判斷`count`是否小於`0`，小於`0`的話將`count`設成`0`
* 前面已經是`IPartition`型別，也就是已經有執行過LINQ了，直接call之前method實作的`Skip`
* 如果是`IList`就用`ListPartition`實作
* 其餘的叫用`EnumerablePartition`實作

看到`Enumerable`就會想到`MoveNext()`，所以接下來會介紹`ListPartition`跟`EnumerablePartition`的定義及`MoveNext()`。

#### ListPartition

```C#
public ListPartition(IList<TSource> source, int minIndexInclusive, int maxIndexInclusive);
```

傳入一個`List`，設好**第一個**元素的**最後個**元素的`index`，他會把這區間內的元素集合輸出。

這裡要注意的是如果只要忽略前面的元素的話只需要設定`minIndexInclusive`，`maxIndexInclusive`設為`int.MaxValue`就好。

下面是`MoveNext()`的實作:

```C#
public override bool MoveNext()
{
    // _state - 1 represents the zero-based index into the list.
    // Having a separate field for the index would be more readable. However, we save it
    // into _state with a bias to minimize field size of the iterator.
    int index = _state - 1;
    if (unchecked((uint)index <= (uint)(_maxIndexInclusive - _minIndexInclusive) && index < _source.Count - _minIndexInclusive))
    {
        _current = _source[_minIndexInclusive + index];
        ++_state;
        return true;
    }

    Dispose();
    return false;
}
```

上面的程式有幾個重點:

* `_state`當作索引，初始值是`1`，所以`index = _state - 1`
* 這裡要輸出的元素是由`_minIndexInclusive`起算，可以想成`_minIndexInclusive`是個起點，而`index`則是由這個**起點數來第幾個**的變數
* 判斷`index`有沒有超出**最大索引值**及**集合數量**
* 如果超出則`return false`，結束迭代
* 如果沒有超出，則把目前的元素附給`_current`，然後`_state`加**1**，回傳`true`

這裡我們注意到一件事，因為`_maxIndexInclusive`的用法是`index <= _maxIndexInclusive - _minIndexInclusive`，所以只要把`_maxIndexInclusive`設為`int.MaxValue`，`_maxIndexInclusive`就不會影響判斷，因此`Skip`才會將其設為`int.MaxValue`。

#### EnumerablePartition

```C#
internal EnumerablePartition(IEnumerable<TSource> source, int minIndexInclusive, int maxIndexInclusive);
```

傳入一個`IEnumerable`，設好**第一個**元素及**最後個**元素的`index`，他會把這區間內的元素集合輸出。

如果只要忽略由第一個數來第N個元素的話只需要設定`minIndexInclusive`，`maxIndexInclusive`設為`-1`就好。

這裡有一個地方跟`ListPartition`不同，只要**忽略前面的元素**時`maxIndexInclusive`的設定一個是`int.MaxValue`，一個是`-1`，我們等下從實作上看為什麼會不同。

下面是`MoveNext()`的實作:

```C#
public override bool MoveNext()
{
    // Cases where GetEnumerator has not been called or Dispose has already
    // been called need to be handled explicitly, due to the default: clause.
    int taken = _state - 3;
    if (taken < -2)
    {
        Dispose();
        return false;
    }

    switch (_state)
    {
        case 1:
            _enumerator = _source.GetEnumerator();
            _state = 2;
            goto case 2;
        case 2:
            if (!SkipBeforeFirst(_enumerator))
            {
                // Reached the end before we finished skipping.
                break;
            }

            _state = 3;
            goto default;
        default:
            if ((!HasLimit || taken < Limit) && _enumerator.MoveNext())
            {
                if (HasLimit)
                {
                    // If we are taking an unknown number of elements, it's important not to increment _state.
                    // _state - 3 may eventually end up overflowing & we'll hit the Dispose branch even though
                    // we haven't finished enumerating.
                    _state++;
                }
                _current = _enumerator.Current;
                return true;
            }

            break;
    }

    Dispose();
    return false;
}
```

這段程式碼有下面幾個重點:

* 這裡的`_state`回歸原本的用法: **狀態的設置**
* `_state=1`: 初始`_source`，轉為`Enumerator`
* `_state=2`: 判斷設置的`minIndexInclusive`是否**超過集合總長度**並且將`_enumerator`的`_current`推至`minIndexInclusive`的位置
* `_state=3`: 判斷是否超過**最大長度**，沒有的話將`_current`往後**再推一個至目標位置**然後傳回**true**

我們可以在`HasLimit`找到為什麼`maxIndexInclusive`要設`-1`:

```C#
private bool HasLimit => _maxIndexInclusive != -1;
```

`EnumerablePartition`是用`_maxIndexInclusive != -1`判斷是否有設定最大值，所以如果沒有設定最大值的話要設為`-1`。

### SkipLast

`SkipLast`有一個公開方法，其實作為:

* 判斷參數是否為空，如果為空則拋出`ArgumentNull`例外
* 參數判斷合法後叫用`SkipLastIterator`

下面為`SkipLastIterator`的實作:

```C#
private static IEnumerable<TSource> SkipLastIterator<TSource>(IEnumerable<TSource> source, int count)
{
    Debug.Assert(source != null);
    Debug.Assert(count > 0);

    var queue = new Queue<TSource>();

    using (IEnumerator<TSource> e = source.GetEnumerator())
    {
        while (e.MoveNext())
        {
            if (queue.Count == count)
            {
                do
                {
                    yield return queue.Dequeue();
                    queue.Enqueue(e.Current);
                }
                while (e.MoveNext());
                break;
            }
            else
            {
                queue.Enqueue(e.Current);
            }
        }
    }
}
```

`SkipLast`是用`yield return`實作，有下面幾個重點:

* 維護一個`Queue`，用來存放集合的元素
* 叫用`MoveNext()`將`Queue`的元素數量塞到跟要`Skip`的元素數量一樣為止
* 當Queue的元素數量跟要`Skip`的數量相同時，做以下動作
    1. 從Queue裡抓出第一個元素做`yield return`
    1. 將目前的元素在塞到Queue裡
    1. 叫用`MoveNext()`做下一輪的判斷

第三點的處理會讓Queue裡一直保持最後`count`數的元素，代表到巡覽結束時在Queue中的元素就不會被輸出，所以就可以做到最後`count`數的元素`Skip`的處理。

### SkipWhile

`SkipWhlie`有兩個公開方法，差別在`predicate`參數上:

```C#
SkipWhile<TSource>(...Func<TSource, bool> predicate);

SkipWhile<TSource>(...Func<TSource, int, bool> predicate);
```

一個有傳入index的參數，另一個沒有傳入。

兩個方法都做了以下的處理:

* 判斷參數是否為空，如果為空則拋出`ArgumentNull`例外
* 參數判斷合法後叫用`SkipWhileIterator`

我們兩種`Iterator`一起看，直接看有`index`參數的`predicate`的`SkipWhileIterator`:

```C#
private static IEnumerable<TSource> SkipWhileIterator<TSource>(IEnumerable<TSource> source, Func<TSource, int, bool> predicate)
{
    using (IEnumerator<TSource> e = source.GetEnumerator())
    {
        int index = -1;
        while (e.MoveNext())
        {
            checked
            {
                index++;
            }

            TSource element = e.Current;
            if (!predicate(element, index))
            {
                yield return element;
                while (e.MoveNext())
                {
                    yield return e.Current;
                }

                yield break;
            }
        }
    }
}
```

這段有下列的重點:

* 每次`MoveNext()`時`index`就加`1`
* 判斷`predicate`的結果，如果是`true`代表要繼續`Skip`
* 如果是`false`的話代表要輸出**這個元素之後的所有元素**

## 測試案例賞析

> Source Code: [SkipTests.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/SkipTests.cs)、[SkipLastTests.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/SkipLastTests.cs)、[SkipWhileTests.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/SkipWhileTests.cs)

### SkipTests.cs

#### SkipExcessive

```C#
[Fact]
public void SkipExcessive()
{
    Assert.Equal(Enumerable.Empty<int>(), NumberRangeGuaranteedNotCollectionType(0, 20).Skip(42));
}
```

`count`超過元素數量的話會傳回`Empty`。

#### SkipOnEmpty

```C#
[Fact]
public void SkipOnEmpty()
{
    Assert.Equal(Enumerable.Empty<int>(), GuaranteeNotIList(Enumerable.Empty<int>()).Skip(0));
    Assert.Equal(Enumerable.Empty<string>(), GuaranteeNotIList(Enumerable.Empty<string>()).Skip(-1));
    Assert.Equal(Enumerable.Empty<double>(), GuaranteeNotIList(Enumerable.Empty<double>()).Skip(1));
}
```

`source`是`Empty`並不會拋出`ArgumentNull`的例外，而是回傳`Empty`的集合。

#### SkipNegative

```C#
[Fact]
public void SkipNegative()
{
    Assert.Equal(Enumerable.Range(0, 20), NumberRangeGuaranteedNotCollectionType(0, 20).Skip(-42));
}
```

`count`為**負數**時不會`Skip`任何元素。

## 結語

在`Skip`的原始碼中，我們可以觀察到`Skip`是用什麼方式達成目標的，其中最特別的是`SkipLast`，用了一個Queue存入跟要`Skip`數量相同的元素，在巡覽到想同數量時開始把Queue中的第一個元素吐出，最後Queue中只會剩下要`Skip`的元素，剩餘的都已經巡覽了。

## 參考

* [dotnet/corefx](https://github.com/dotnet/corefx)