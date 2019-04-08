# LINQ排序語法(OrderBy、OrderByDescending、ThenBy、ThenByDescending)的應用
這章我們來說說要如何在LINQ中使用排序的功能整理集合，由於LINQ中的排序其實是一組的語法所組合而成的，所以今天會講到多個不同的語法，雖然說是多個語法，但是關鍵都還是圍繞在**排序**這個目的上，只是使用的情境會不同而已，讓我們來看看這些語法各有什麼樣的作用吧。

## 功能說明
### `OrderBy`
設定**第一個**排序條件，而且此排序條件為**遞增**排序。

### `OrderByDescending`
設定**第一個**排序條件，而且此排序條件為**遞減**排序。

### `ThenBy`
設定**第二個以後**的排序條件，此排序條件為**遞增**排序。

### `ThenByDescending`
設定**第二個以後**的排序條件，此排序條件為**遞減**排序。

本章會講解以上四個方法，藉由說明我們可以看到它們其實只有**順序**及**遞增遞減**的差別而已，性質其實是相同的。

## 方法定義
這組方法主要目的就是排序資料，請看下面的例子(節錄自[Microsoft Docs](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/sorting-data)):

![sort](./image/16_HowToUseOrderBy/linq_ordering.png)

```C#
char[] Source = new char[] { 'G', 'C', 'F', 'E', 'B', 'A', 'D' };
IOrderedEnumerable<char> Results = Source.OrderBy(c => c);

foreach(char result in Results){
    Console.Write($"{result} ");
}
Console.WriteLine();

// output: A B C D E F G
```
由上面的例子我們知道了`OrdeBy`的作用是將資料`遞增排序`，讓我們來看看它的定義: 
```C#
public static IOrderedEnumerable<TSource> OrderBy<TSource, TKey>(
    this IEnumerable<TSource> source, 
    Func<TSource, TKey> keySelector);

public static IOrderedEnumerable<TSource> OrderBy<TSource, TKey>(
    this IEnumerable<TSource> source, 
    Func<TSource, TKey> keySelector, 
    IComparer<TKey> comparer);
```
* `keySelector`: 要排序的欄位
* `comparer`: 客製的比較器
* `IOrderedEnumerable`: **LINQ排序語法**都會回傳此型別

`OrderBy`有兩個方法，差別在於要不要傳入**客製的比較器**，客製的比較器是使用在你有特別的排序方式的情況時，等下的範例程式我們做個範例。

這裡我們會看到一個特別的回傳型別`IOrderedEnumerable`，它繼承自`IEnumerable`，會定義這個型別的目的是為了要讓`ThenBy`及`ThenByDescending`可以接續在這個排序之後再做其他的排序。

當然，因為`IOrderedEnumerable`是繼承自`IEnumerable`，所以你要在後面用`OrderBy`也是合法的，但是這樣做會讓它忽略之前的排序，將其本身視為第一個排序條件，我們之後的範例程式再來看看。

接下來的`OrderByDescending`的方法定義:
```C#
public static IOrderedEnumerable<TSource> OrderByDescending<TSource, TKey>(
    this IEnumerable<TSource> source, 
    Func<TSource, TKey> keySelector);

public static IOrderedEnumerable<TSource> OrderByDescending<TSource, TKey>(
    this IEnumerable<TSource> source, 
    Func<TSource, TKey> keySelector, 
    IComparer<TKey> comparer);
```
整個方法結構跟`OrderBy`完全一樣，只是差在它的結果會是`遞減`的。

最後我們來看ThenBy這一組的方法:
```C#
public static IOrderedEnumerable<TSource> ThenBy<TSource, TKey>(
    this IOrderedEnumerable<TSource> source, 
    Func<TSource, TKey> keySelector)

public static IOrderedEnumerable<TSource> ThenBy<TSource, TKey>(
    this IOrderedEnumerable<TSource> source, 
    Func<TSource, TKey> keySelector, 
    IComparer<TKey> comparer)

public static IOrderedEnumerable<TSource> ThenByDescending<TSource, TKey>(
    this IOrderedEnumerable<TSource> source, 
    Func<TSource, TKey> keySelector)

public static IOrderedEnumerable<TSource> ThenByDescending<TSource, TKey>(
    this IOrderedEnumerable<TSource> source, 
    Func<TSource, TKey> keySelector, 
    IComparer<TKey> comparer)
```

前面有說到`ThenBy`及`ThenByDescending`是要接在其他排序的後面，現在看到定義`this`的確是需要傳入`IOrderedEnumerable`，所以代表你在一個`IEnumerable`的後面是不能接`ThenBy`的，要先接`OrderBy`才能用`ThenBy`。

## 查詢運算式
依據[C# Spec](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/language-specification/expressions#query-expressions)可以照到下面跟`orderby`相關的定義: 
```C#
orderby_clause
    : 'orderby' orderings
    ;

orderings
    : ordering (',' ordering)*
    ;

ordering
    : expression ordering_direction?
    ;

ordering_direction
    : 'ascending'
    | 'descending'
    ;
```
* `orderby`查詢運算式後面可以接多個排序條件(以`,`分隔)
* 每個查詢條件後可以用`ascending`或`descending`來決定要遞增還是遞減

來看一個查詢運算式的例子: 
```C#
string[] words = new string[] { "Apple", "Banana", "Cherry", "Donut", "Eat", "Football" };
IOrderedEnumerable<string> results = from word in words
                                     orderby word.Substring(1 1),
                                             word.Substring(2,1) descending
                                     select word;
...
```
* **第一個**排序條件為**第二個字母遞增**
* **第二個**排序條件為**第三個字母遞減**

可以看到查詢運算式的排序是非常直覺的，相較於方法要用各個不同的方法來排序，運算式的語法更像是我們熟悉的**SQL**。

我們可以依照[C# Spec](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/language-specification/expressions#query-expressions)的定義將下面的運算式: 
```C#
from x in e
orderby k1 , k2 , ..., kn
...
```
轉成下面的方法: 
```C#
from x in ( e ) . 
OrderBy ( x => k1 ) . 
ThenBy ( x => k2 ) .
... .
ThenBy ( x => kn )
...
```
可以看到查詢運算式所轉出來的方法是按照`OrderBy.ThenBy`的方式實作。

## 方法範例
### 客製比較器
想要將偶數排在奇數之前，我們可以實作一個客製的比較器如下: 
```C#
int[] numbers = new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
IOrderedEnumerable<int> results = numbers.OrderBy(x => x, newCustomComparer());
...
class CustomComparer : IComparer<int>
{
    public int Compare(int x, int y)
    {
        return x % 2 - y % 2;
    }
}
// output: 0 2 4 6 8 1 3 5 7 9
```
* 奇數除以二的餘數一定大於偶數，所以排在偶數之後
* 當比較的大小相同時，因為`OrderBy`是**Stable Sort**所以會依照原本的序列排序

### 連續使用`OrderBy`
```C#
string[] words = new string[] { "Apple", "Banana", "Cherry", "Donut", "Eat", "Football" };

IOrderedEnumerable<string> results = words
    .OrderBy(x =>x.Substring(1, 1))
    .OrderByDescending(x => x.Substring(2, 1));
/* output: 
 * 
 * Eat
 * Apple
 * Football
 * Banana
 * Donut
 * Cherry
 */
IOrderedEnumerable<string> results2 = words
    .OrderBy(x =>x.Substring(1, 1))
    .ThenByDescending(x => x.Substring(2, 1));
/* output: 
 * 
 * Eat
 * Banana
 * Cherry
 * Football
 * Donut
 * Apple
 */
```
由結果可以看出不用`ThenBy`的話**第一個查詢條件形同虛設**，根本沒有用到。

# 特別之處
* 屬於延遲執行的方法，回傳的只是查詢的資訊，要等到`GetEnumerator()`或是`foreach`觸發才會做巡覽
* 回傳值不是`IEnumerable`而是`IOrderedEnumerable`，目的是要讓ThenBy及ThenByDescending接續其後設定其他的排序條件
* 可以是實作`IComparer`來客製比較器

## 結語
這一章我們學了4個**排序**方法，`OrderBy`家族會排在第一個條件，而`ThenBy`家族則是排在第二到第n個條件，利用`Descending`搭配讓我們可以遞增遞減排序。

## 參考
* [Microsoft Docs-OrderBy](https://docs.microsoft.com/zh-tw/dotnet/api/system.linq.enumerable.orderby?view=netframework-4.7.1)
* [Microsoft Docs-comparer](https://docs.microsoft.com/zh-tw/dotnet/api/system.collections.generic.comparer-1?view=netframework-4.7.1)
* [Microsoft Docs-query-expressions](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/language-specification/expressions#query-expressions)
* [Microsoft Docs-sorting-data](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/sorting-data)