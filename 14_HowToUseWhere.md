# Where的應用
`Where`這個語法對於大家來說應該都不陌生，要查詢的情境幾乎都脫離不了篩選資料的處理，`Where`在LINQ中就是篩選條件的語法，接下來請看`Where`的介紹。

## 功能說明
使用`Where`可以取得集合中符合描述的元素。

## 方法定義
`Where`的方法有**兩個**，差別依然是有沒有`index`傳入參數: 
```C#
public static IEnumerable<TSource> Where<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate);

public static IEnumerable<TSource> Where<TSource>(this IEnumerable<TSource> source, Func<TSource, int, bool> predicate);
```

* `predicate`: 資料的描述，可以注意到回傳值是一個`bool`，代表`predicate`會是一個**判斷式**，符合的資料就放進集合中
* `Where`方法有**延遲執行**的特性

我們來看看出自[Microsoft Docs](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/filtering-data)的例子: 

![linq_filter](image/14_HowToUseWhere/linq_filter.png)

我們有個`source`的`char`**陣列**如上圖的**Source**，現在我想要拿出`A`的元素，我們會利用下面的程式碼取得`A`的資料: 
```C#
char[] source = new char[] { 'A', 'B', 'C', 'A', 'B', 'A', 'C' };

IEnumerable<char> result = source.Where(letter => letter == 'A');

// output: A A A
```
* `predicate`是一個**判斷式**的Lambda Expression

透過這個例子我們就可以清楚的了解`Where`就是為了**篩選**資料。

## 查詢運算式
在[C# Spec](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/language-specification/expressions#query-expressions)可以找到`Where`的定義: 

```C#
where_clause
    : 'where' boolean_expression
    ;
```

我們可以看到`where`運算式後面是接**判斷式**，跟`if`一樣，如果是`true`就是符合的資料，反之是不符合的資料。

我們將剛剛在方法定義時使用的例子轉為運算式試試看: 
```C#
from letter in source
where letter == 'A'
select letter;

// output: A A A
```

這邊有一點要注意的是`where`可以在一段運算式中的**任何地方**，**除了最前面(from)及最後面(select、group)**。

## 方法範例
### 多個條件的判斷式
取得`A`或`C`的資料: 
```C#
char[] source = new char[] { 'A', 'B', 'C', 'A', 'B', 'A', 'C' };

var result = 
    //source.Where(letter => letter == 'A' || letter == 'C');
    from letter in source
    where letter == 'A' || letter == 'C'
    select letter;

// output: A C A A C
```
* 用`||`(或)跟`&&`(且)來串接多個條件

### 利用`index`取得資料
排除`index`為`5`的資料: 
```C#
char[] source = new char[] { 'A', 'B', 'C', 'A', 'B', 'A', 'C' };

var result = source.Where((letter, index) => index != 5);

// output: A B C A B C
```
* **查詢運算式**不能使用`index`參數

### 使用函式當條件
取得`A`的資料: 
```C#
char[] source = new char[] { 'A', 'B', 'C', 'A', 'B', 'A', 'C' };

IEnumerable<char> result =
    //source.Where(equalA);
    from letter in source
    where equalA(letter)
    select letter;

// output: A A A
```

## 結語
`Where`是一個篩選條件的方法，以`predicate`當作判斷式，如果符合判斷式則傳回此元素。

## 參考
* [Microsoft Docs-where-clause](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/keywords/where-clause)
* [Microsoft Docs-filtering-data](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/filtering-data)
* [Microsoft Docs-where](https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.where?view=netframework-4.7.1)
* [Microsoft Docs-Query Expressions](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/language-specification/expressions#query-expressions)