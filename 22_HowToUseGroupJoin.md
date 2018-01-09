# GroupJoin的應用

今天我們來看`GroupBy`跟`Join`的合體`GroupJoin`，一般資料表都會是一對多的關聯設計，很少會有一對一、多對多的情況出現，所以當我們`Join`完兩個資料時，我們得到的結果會是一邊的資料有重複的情形，例如有個人有兩筆電話號碼，當我們`Join`人跟電話的資料時，這個人的資料就會出現兩筆，造成我們的資料處理上的困難，`GroupJoin`就是讓你在`Join`時就可以做彙整資料的作業，增加便利性。

## 功能說明

將`outer`鍵值跟`inner`鍵值相等的資料合併，並且對資料進行彙整的動作。

## 方法定義

`GroupJoin`跟`Join`一樣有兩個公開方法:

```C#
public static IEnumerable<TResult> GroupJoin<TOuter, TInner, TKey, TResult>(
    this IEnumerable<TOuter> outer,
    IEnumerable<TInner> inner,
    Func<TOuter, TKey> outerKeySelector,
    Func<TInner, TKey> innerKeySelector,
    Func<TOuter, IEnumerable<TInner>, TResult> resultSelector);

public static IEnumerable<TResult> GroupJoin<TOuter, TInner, TKey, TResult>(
    this IEnumerable<TOuter> outer,
    IEnumerable<TInner> inner,
    Func<TOuter, TKey> outerKeySelector,
    Func<TInner, TKey> innerKeySelector,
    Func<TOuter, IEnumerable<TInner>, TResult> resultSelector,
    IEqualityComparer<TKey> comparer);
```

仔細看`GroupJoin`跟`Join`只差在`resultSelector`，而在講這個`resultSelector`前，來喚醒一下對`GroupBy`的`resultSelector`的記憶，他會將每個鍵值及其資料傳入`resultSelector`，讓每個鍵值資料可以彙整回傳。

複習完`GroupBy`的`resultSelector`後，`GroupJoin`的也是跟其相似的，它是將`outer`對應的`inner`資料的集合跟著`outer`一起傳入`resultSelector`，這樣你就可以做彙整的動作。

## 查詢運算式

`GroupJoin`在查詢運算式中是跟`Join`用同樣的運算式: `join`，不同的是`GroupJoin`會在後面加一個`into`。

```C#
join_into_clause
    : 'join' type? identifier 'in' expression 'on' expression 'equals' expression 'into' identifier
    ;
```

這個`into`的後面是接一個要在`select`中使用`inner`的別名，`inner`在查詢運算式中就是`join`後面定義的物件，現在我們來看一下轉換的公式:

下面這段查詢運算式:

```C#
from x1 in e1
join x2 in e2 on k1 equals k2 into g
select v
```

可以被轉換成`GroupJoin`:

```C#
( e1 ) . GroupJoin( e2 , x1 => k1 , x2 => k2 , ( x1 , g ) => v )
```

我們可以看到`g`是在`inner Enumerable`的位置，所以他會是`x2`中跟`x1`有關係的集合。

## 方法範例

這裡我們使用跟Join範例相同的物件及資料。

下面是人跟電話的物件，電話上有個人的物件藉此跟人關聯:

```C#
class Person
{
    public string Name { get; set; }
}

class Phone
{
    public string PhoneNumber { get; set; }
    public Person Person { get; set; }
}
```

下面是範例資料:

```C#
Person Peter = new Person() { Name = "Peter" };
Person Sunny = new Person() { Name = "Sunny" };
Person Tim = new Person() { Name = "Tim" };
Person May = new Person() { Name = "May" };

Phone num1 = new Phone() { PhoneNumber = "01-5555555", Person = Peter };
Phone num2 = new Phone() { PhoneNumber = "02-5555555", Person = Sunny };
Phone num3 = new Phone() { PhoneNumber = "03-5555555", Person = Tim };
Phone num4 = new Phone() { PhoneNumber = "04-5555555", Person = May };
Phone num5 = new Phone() { PhoneNumber = "05-5555555", Person = Peter };
```

接下來我們來看幾個範例。

### 跟Join的比較

**題目**: 取得每個人的電話，如有多筆用逗號(,)隔開。

**答案**如下:

```C#
/*
 * output:
 *
 * Peter: 01-5555555,05-5555555
 * Sunny: 02-5555555
 * Tim: 03-5555555
 * May: 04-5555555
 */
```

1. 用Join及GroupBy實作

```C#
var results = persons.Join(
    phones,
    person => person,
    phone => phone.Person,
    (person, phone) => new { person.Name, phone.PhoneNumber })
    .GroupBy(x => x.Name,
        (name, data) => new {
            Name = name,
            PhoneNumber = string.Join(',', data.Select(x => x.PhoneNumber)) });
```

2. 用GroupBy實作

```C#
var results = persons.GroupJoin(
    phones,
    person => person,
    phone => phone.Person,
    (person, phoneEnum) =>
        new {
            person.Name,
            PhoneNumber = string.Join(',', phoneEnum.Select(x => x.PhoneNumber))
        }
);
```

我們可以看到下面幾個重點:

* 因為`Join`出來的資料是沒有分組的，所以需要再用`GroupBy`做分組
* 兩個最大的差別在於`resultSelector`的**第二個**傳入參數
    * `Join`是傳入此`outer`鍵值對應的其中一個`inner`的資料
    * `GroupJoin`是傳入此`outer`鍵值對應的所有`inner`的集合

### Left Join

之前介紹`Join`的時候有說過`Join`是`Inner Join`，而`GroupJoin`可以經過一些手腳來取得`Left Join`的結果。

**資料**: 還是上一題的資料，為了可以看到`Left Join`的結果，我們把`num4`給拿掉，讓`May`沒有電話資料。

一般的`Join`會拿到`Inner Join`的資料:

```C#
var results = persons.Join(
    phones,
    person => person,
    phone => phone.Person,
    (person, phone) =>
        new
        {
            person.Name,
            phone.PhoneNumber
        }
);

/*
 * output
 * Peter: 01-5555555
 * Peter: 05-5555555
 * Sunny: 02-5555555
 * Tim: 03-5555555
 */
```

用`GroupJoin`搭配`DefaultIfEmpty`和`SelectMany`達到**Left Join**的效果

```C#
var results = persons.GroupJoin(
    phones,
    person => person,
    phone => phone.Person,
    (person, phoneEnum) => new
    {
        name = person.Name,
        phones = phoneEnum.DefaultIfEmpty()
    })
    .SelectMany(x => x.phones.Select(phone => new { name = x.name, phone = phone }))
    ;

/*
 * output
 * Peter: 01-5555555
 * Peter: 05-5555555
 * Sunny: 02-5555555
 * Tim: 03-5555555
 * May:
 */
```

* `DefaultIfEmpty`: 如果空的話回傳預設資料，讓此筆資料不會因為沒有電話資料而被刪掉
* `SelectMany`: `phones`傳回來的是`phone`的集合，所以要用`SelectMany`把他打平

### 查詢運算式

**題目**: 使用查詢運算式取得資料。

1. 一個人一筆資料

```C#
var results = from person in persons
    join phone in phones on person equals phone.Person into ppGroup
    select new {person.Name, PhoneNumber= string.Join(',', ppGroup.Select(x => x.PhoneNumber))};

/*
 * output
 *
 * Peter: 01-5555555,05-5555555
 * Sunny: 02-5555555
 * Tim: 03-5555555
 * May: 04-5555555
 */
```

2. 每筆電話都一筆資料，沒有電話的人也要顯示名稱(Left Join)

```C#
var results = from person in persons
                join phone in phones on person equals phone.Person into ppGroup
                from item in ppGroup.DefaultIfEmpty(new Phone() { Person = null, PhoneNumber = ""})
                select new {name = person.Name, phone = item};

/*
 * output
 *
 * Peter: 01-5555555
 * Peter: 05-5555555
 * Sunny: 02-5555555
 * Tim: 03-5555555
 * May:
 */
```

## 特別之處

* 有**延遲執行**的特性，在`foreach`或是`GetEnumerator()`叫用時才會執行
* 透過`SelectMany`及`DefaultIfEmpty`可以對資料做**Left Join**

## 結語

`GroupJoin`的特性就像是`Join`跟`GroupBy`的合併，前半段作`Join`合併資料，後半段做`GroupBy`將相同鍵值的資料做彙整，下一章來看看`GroupJoin`是怎麼做到的。

## 範例程式

## 參考

* [docs.microsoft: system.linq.enumerable.groupjoin](https://docs.microsoft.com/zh-tw/dotnet/api/system.linq.enumerable.groupjoin?view=netframework-4.7.1)
* [docs.microsoft: query-expressions](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/language-specification/expressions#query-expressions)
* [docs.microsoft: join-clause](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/keywords/join-clause?view=netframework-4.7.1)
* [stackoverflow: how-to-implement-left-join-in-join-extension-method](https://stackoverflow.com/questions/3792888/how-to-implement-left-join-in-join-extension-method)