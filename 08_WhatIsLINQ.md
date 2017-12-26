# 所以什麼是LINQ?
應該有很多人覺得很奇怪，這系列的主題明明是LINQ，可是前面幾篇卻都不是在講LINQ呢?在這章我們就來介紹LINQ的用途，及LINQ跟前面講到的技術到底有什麼樣的關係吧。

## LINQ的介紹
LINQ全名為Language Integrated Query，顧名思義就是語言擁有查詢資料的能力，LINQ的出現使得C#
(F#、VB.NET也可以使用)有能力可以在程式中查找資料。

在沒有LINQ技術之前我們在查詢資料時會需要學習另一中查詢語法來達到查詢的需求，例如像是XML、SQL...等，除了要花費學習的精力外，也因為C#並不認識這些語法，所以寫出來的查詢語法在C#中並不會有型別檢查或是自動完成的功能，對於工程師來說這無疑會是一個除錯地獄。

有了LINQ之後，利用標準查詢運算子(Standard Query Operators)，工程師可以用原生的C#語言對資料做處理，選擇資料來源、進行篩選到組合、分組都可以利用標準查詢運算子完成，而且在撰寫的過程中還可以享受到型別檢查及自動完成帶來的便捷。

## LINQ的組成
上面有提到，LINQ是一種能力，微軟開發出了很多不同的技術讓C#擁有這樣的能力，接下來就稍微簡介一下這些技術分別是哪些。

### Standard Query Operators
標準查詢運算子是應用於集合類別的運算子，它對集合實作了篩選、組合、排序..等等的運算功能，像是Select、Where、OrderBy...等方法，而這些方法就是運作於`IEnumerable<T>`、`IQueryable<T>`之上，所以前面的章節說明**IEnumerable**及**泛型**就是想要講解LINQ的核心運作方式。

### Language Extensions
為了使LINQ可以更加便捷的使用而將C#擴充了以下的功能: 

#### Query Expression(Query Syntax)
查詢運算式(Query Expression)是一種跟SQL搜尋語法相似的運算式，透過查詢運算式，我們可以對資料做相關的處理，下面是一個最基本的查詢運算式: 
```C#
from x in Products
select x.ProductName
```
此段語法會被Compiler轉譯為標準查詢運算子:
```C#
Products
   .Select (x => x.ProductName)
```
而最後進資料庫的會是下面這樣的SQL語法:  
```SQL
SELECT [t0].[ProductName]
FROM [Products] AS [t0]
```
C#因為有查詢運算式，所以可以在程式中直接撰寫查詢語法，使得我們可以輕鬆的表達出我們想要的資料處理，再經由轉換最後變為SQL的查詢語法。

#### Implicitly typed variables
隱含型別變數就是我們再JavaScript上又愛又恨的`var`，但C#中的var變數還是強型別的變數，它會透過賦予變數的型別來推斷此變數為何種型別([type inference](https://en.wikipedia.org/wiki/Type_inference))。

#### Anonymous types
匿名型別可以只宣告資料欄位而不需要明確定義類別，這樣的技術在Select或是Join的時候非常好用，因為這些查詢有很大的機會不會是原來的物件。

#### Object Initializer
可以直接在`new`的時候訂定類別的參數初始值，例如說像是下面這樣([參考自維基百科](https://en.wikipedia.org/wiki/C_Sharp_syntax#Object_initializers)): 
```C#
Person person = new Person {
    Name = "John Doe",
    Age = 39
};

// Equal to
Person person = new Person();
person.Name = "John Doe";
person.Age = 39;
```

#### Lambda expression
Lambda運算式在前面的章節講過，是一種匿名方法，LINQ在Query Expression轉為Standard Query Operators時會使用它來做轉換。

#### 範例
上面介紹了這麼多的Language Extensions，看到這邊應該還是有點模糊吧，我們用個例子來說明([節錄自維基百科](https://en.wikipedia.org/wiki/Language_Integrated_Query#Language_extensions)):
```C#
var results =  from c in SomeCollection
               where c.SomeProperty < 10
               select new {c.SomeProperty, c.OtherProperty};

foreach (var result in results)
{
        Console.WriteLine(result);
}
```
這範例是**從Somecollection找出SomeProperty小於10的資料並將SomeProperty及OtherProperty取出，並且輸出在終端上**。

在這裡我們看到了不少剛剛介紹過的特性，我會在下面逐條列出: 
```C#
var results //Implicitly typed variables
    = from c in SomeCollection  //Query Expression
      where c.SomeProperty < 10
      select new {c.SomeProperty, c.OtherProperty}; //Anonymous types和Object Initializer
```
而這個例子在經過Compiler之後會變成下面這樣的Standard Query Operators: 
```C#
var results =
     SomeCollection
        .Where(c => c.SomeProperty < 10)    //Lambda Expression
        .Select(c => new {c.SomeProperty, c.OtherProperty});

results.ForEach(x => {Console.WriteLine(x.ToString());})    //Lambda Statement
```

由這範例就可以知道上述的語言擴充都是LINQ所必需要有的。

### LINQ providers
有沒有想過為什麼LINQ可以對Objects、Database做查詢?這中間其實就是有Provider在幫我們做事情，透過Provider，我們可以在不需要了解實際運作下對其做資料的處理，我們這裡舉兩個例子: **LINQ to Objects**及**LINQ to SQL**。

#### LINQ to Objects
我們在之前介紹過的IEnumerable，Provider就是利用這個介面去對任何要查詢的物件做處理，只要你有時做這個物件，你就可以使用LINQ。

#### LINQ to SQL
因為Database有自己的查詢引擎，所以無法直接透過LINQ的語法做處理，Provider處理了LINQ與SQL查詢語法間的轉換還有應用程式與資料庫間的溝通。

## 結語
這章帶著大家跟我一起了解LINQ背後的技術及其特性，希望之後在介紹與法時會有更具體的了解。

## 參考
* [Microsoft Docs-C#指南-LINQ](https://docs.microsoft.com/zh-tw/dotnet/csharp/linq/)
* [Microsoft Docs-LINQ](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/concepts/linq/index)
* [wiki-Language_Integrated_Query](https://en.wikipedia.org/wiki/Language_Integrated_Query)
* [wiki-Anonymous_type](https://en.wikipedia.org/wiki/Anonymous_type)
* [wiki-C_Sharp_syntax](https://en.wikipedia.org/wiki/C_Sharp_syntax)
* [Microsoft Docs-C# Spec-expressions#query-expressions](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/language-specification/expressions#query-expressions)