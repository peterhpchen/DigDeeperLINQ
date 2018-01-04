# OrderBy的原碼探索
前面我們說到LINQ排序方法有四個`OrderBy`、`OrderByDescending`、`ThenBy`及`ThenByDescending`，
`OrderBy`及`OrderByDescending`是設定**第一個**排序條件，而有沒有`Descending`是差在是不是**遞減**排序，它們會回傳`IOrderedEnumerable`型別，只有`ThenBy`及`ThenByDescending`接在它們後面才可以下**複數個**查詢條件，本章會聚焦在方法的原始碼說明上，讓我們來看看裡面施了什麼魔法吧。

## 原始碼分析
* Source Code: https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/OrderBy.cs

`OrderBy`及`OrderByDescending`都是傳回一個新的`IOrderedEnumerable`的實作，之間的差別只是在傳入的參數不同，我們以`OrderBy`講解定義: 
```C#
public static IOrderedEnumerable<TSource> OrderBy<TSource, TKey>(
    this IEnumerable<TSource> source, 
    Func<TSource, TKey> keySelector) 
    => new OrderedEnumerable<TSource, TKey>(source, keySelector, null, false, null);
```
回傳的`OrderedEnumerable`有**5**個參數，後面的三個參數就是這幾個方法的不同之處，我們慢一點在去看`OrderedEnumerable`的建構子，現在我們先再來觀察`ThenBy`的定義: 
```C#
public static IOrderedEnumerable<TSource> ThenBy<TSource, TKey>(
    this IOrderedEnumerable<TSource> source, 
    Func<TSource, TKey> keySelector)
{
    if (source == null)
    {
        throw Error.ArgumentNull(nameof(source));
    }

    return source.CreateOrderedEnumerable(keySelector, null, false);
}
``` 
由於`ThenBy`會接在`OrderBy`後面，使用`OrderBy`已經建立好的`OrderedEnumerable`類別叫用`CreateOrderedEnumerable()`來更新`OrderedEnumerable`，接著我們來找找`CreateOrderedEnumerable()`做了什麼事情，在[OrderedEnumerable.cs](https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/OrderedEnumerable.cs)中找到下面的定義: 
```C#
IOrderedEnumerable<TElement> IOrderedEnumerable<TElement>.CreateOrderedEnumerable<TKey>(
    Func<TElement, TKey> keySelector, 
    IComparer<TKey> comparer, 
    bool descending) 
    => new OrderedEnumerable<TElement, TKey>(_source, keySelector, comparer, @descending, this);
```
咦~這不是就是去新建一個新的`OrderedEnumerable`嗎? 可是仔細看好像有點不太一樣，我們把目光放在最後一個參數，這裡傳入了`this`，這裡應該藏了什麼秘密，我們來觀察`OrderedEnumerable`的建構子吧: 
```C#
internal OrderedEnumerable(
    IEnumerable<TElement> source, 
    Func<TElement, TKey> keySelector, 
    IComparer<TKey> comparer, 
    bool descending, 
    OrderedEnumerable<TElement> parent)
{
    _source = source ?? throw Error.ArgumentNull(nameof(source));
    _parent = parent;
    _keySelector = keySelector ?? throw Error.ArgumentNull(nameof(keySelector));
    _comparer = comparer ?? Comparer<TKey>.Default;
    _descending = descending;
}
```
這個建構子有下面這些需注意的點: 
* 跟之前介紹的方法一樣會去檢查`source`跟`keySelector`是否為空，空的話會回傳`ArgumentNull`的例外
* 如果沒有設定`comparer`會使用`default`的比較器
* 是否**遞減**由參數`descending`決定
* 紀錄是誰(`parent`)`new`了這個`OrderedEnumerable`

在這邊我們發現了`OrderBy`及`ThenBy`的差別就是`ThenBy`會傳入`this`當作`parent`參數，所以`ThenBy`的動作會被**之前**的`Source`所影響。

由上面的觀察我們可以觀察到OrderBy及ThenBy的差別就是有沒有傳入之前的`Source`進`OrderedEnumerable`，現在我們先將這個部分放一邊，單純一點的觀察排序的方式，我們前一章有提到`OrderBy`系列的方法也是延遲執行，代表它排序的時間點是在`GetEnumerator()`之後，我們先來看`GetEnumerator()`的定義: 

```C#
public IEnumerator<TElement> GetEnumerator()
{
    Buffer<TElement> buffer = new Buffer<TElement>(_source);
    if (buffer._count > 0)
    {
        int[] map = SortedMap(buffer);
        for (int i = 0; i < buffer._count; i++)
        {
            yield return buffer._items[map[i]];
        }
    }
}
```
* 將`_source`轉為`Buffer`
* 叫用`SortedMap()`排序元素
* 用`yield`依序回傳元素

之前介紹的方法的`GetEnumerator()`都只是單純的判斷是不是要給一個**新的實體**及設定`_state`，而`OrderBy`卻在`GetEnumerator()`時就執行完成了。

接下來大家應該都很好奇`SortedMap()`到底做了什麼吧，在介紹`SortedMap()`之前得先了解`Buffer`這個類別，它其實是會將`_source`轉為`Array`，它有兩個屬性，一個是陣列型態的`_items`，另一個是元素總數的`_count`，下面是參數的代碼片段: 
```C#
/// <summary>
/// The stored items.
/// </summary>
internal readonly TElement[] _items;

/// <summary>
/// The number of stored items.
/// </summary>
internal readonly int _count;
```

接著我們來看`SortedMap()`，它會回傳`GetEnumerableSorter().Sort(buffer._items, buffer._count)`，這邊會需要分`GetEnumerableSorter()`及`Sort()`來說明，我們依序來看，先看`GetEnumerableSorter()`:
```C#
private EnumerableSorter<TElement> GetEnumerableSorter() => GetEnumerableSorter(null);
...
internal override EnumerableSorter<TElement> GetEnumerableSorter(EnumerableSorter<TElement> next)
{
    EnumerableSorter<TElement> sorter = new EnumerableSorter<TElement, TKey>(_keySelector, _comparer, _descending, next);
    if (_parent != null)
    {
        sorter = _parent.GetEnumerableSorter(sorter);
    }

    return sorter;
}
```
`GetEnumerableSorter()`會建立一個`EnumerableSorter`實體，這時如果有使用`ThenBy()`的話就會有_parent的資料，我們就會將目前的`Sorter`放在`_parent`的`next`，用`_parent.GetEnumerableSorter(sorter)`取得`_parent`的`Sorter`。

所以`GetEnumerableSorter()`是在取得實體化每個查詢條件的`Sorter`，並且將**第一個**(祖先)查詢條件回傳。

接下來解析`Sort()`，我們上面提到的`Buffer`的兩個屬性會傳入`Sort()`中，來看一下`Sort()`的定義: 
```C#
internal int[] Sort(TElement[] elements, int count)
{
    int[] map = ComputeMap(elements, count);
    QuickSort(map, 0, count - 1);
    return map;
}
```
從`Sort()`這裡只能看到叫用了`ComputeMap()`取得`map`陣列，再對陣列做`QuickSort()`，並看不出它真的做了什麼，所以我們得再往內追，先來看`ComputeMap()`: 
```C#
private int[] ComputeMap(TElement[] elements, int count)
{
    ComputeKeys(elements, count);
    int[] map = new int[count];
    for (int i = 0; i < map.Length; i++)
    {
        map[i] = i;
    }

    return map;
}
```
原來`map`根本就只是初始陣列而已，沒有做任何處理，看來真正做事的是`ComputeKeys()`，來看一下它吧: 
```C#
internal override void ComputeKeys(TElement[] elements, int count)
{
    _keys = new TKey[count];
    for (int i = 0; i < count; i++)
    {
        _keys[i] = _keySelector(elements[i]);
    }

    _next?.ComputeKeys(elements, count);
}
```
終於看到`Selector`了，這裡是把我們在`Selector`定的委派方法執行後取得查詢條件，再將條件依目前元素排序放進`_keys`裡面，後面的查詢條件也會因`_next?.ComputeKeys(elements, count)`取得它們的`Key`值。

這裡雖然取得了查詢條件，但是還沒有做排序，所以我們接著就要來解析在`Sort()`中的`QuickSort()`: 
```C#
protected override void QuickSort(int[] keys, int lo, int hi) =>
            Array.Sort(keys, lo, hi - lo + 1, Comparer<int>.Create(CompareAnyKeys));
```
這裡是叫用`Array.Sort()`做排序，最重要的是比較器的實作，這就是排序的基準: 
```C#
internal override int CompareAnyKeys(int index1, int index2)
{
    int c = _comparer.Compare(_keys[index1], _keys[index2]);
    if (c == 0)
    {
        if (_next == null)
        {
            return index1 - index2; // ensure stability of sort
        }

        return _next.CompareAnyKeys(index1, index2);
    }

    // -c will result in a negative value for int.MinValue (-int.MinValue == int.MinValue).
    // Flipping keys earlier is more likely to trigger something strange in a comparer,
    // particularly as it comes to the sort being stable.
    return (_descending != (c > 0)) ? 1 : -1;
}
```
* 叫用**比較器**做排序
* 如果目前的排序相同的話，檢查是否有下一個排序條件
* 有的話則往下一個查詢條件叫用，沒有的話則直接傳回兩個`index`的相減值，由於剛剛`map`是按照`index`排序的，所以一定會是負值，它依然會按照原本的順序輸出，所以會是**stability of sort**
* 如果有設定`_descending`，會將`comparer`的值相反
* 回傳比較值

到這裡就是整個**排序**的流程了，可以看到他們將每個步驟都**切分**，設定`Sorter`、取得`Keys`到`Comparer`完成排序都切得很乾淨，這樣的程式碼看上去真是賞心悅目，而且又學到了很多的技巧，在理解LINQ的過程中又可以增強程式能力，真是太棒了。

## 結語
這裡的排序方法跟前面的方法差別比較大，所以在**原始碼分析**上花了不少的篇幅，**測試案例賞析**就留到下章再說(我絕對不是要偷懶喔XD)。

## 參考
* [dotnet/corefx](https://github.com/dotnet/corefx)