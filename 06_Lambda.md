# Lambda運算式介紹
Lambda在LINQ扮演著十分重要的角色，為了要對每一筆資料做特定的處理，LINQ會使用委派來將外面的方法帶入巡覽的時候執行以得到期望的資料，而為求簡潔，LINQ帶入的委派常常是以Lambda的形式表示。

現在讓我來簡單介紹Lambda吧。

## 前世今生
首先我們來看看委派的方式從以前到現在有哪些寫法，請參考下面的範例:

```C#
static string nameMethod(string output)
{
    return output;
}

static void Main()
{
    // Instantiate delegate with named method:
    consoleWriteLine(nameMethod, "name method");

    // Instantiate delegate with anonymous method:
    consoleWriteLine(delegate (string output) { return output; }, "anonymous method");

    // Instantiate delegate with lambda expression
    consoleWriteLine(output => output, "lambda method");
}

//public delegate TResult Func<in T, out TResult>(T arg);
private static void consoleWriteLine(Func<string, string> stringGetter, stringinput)
{
    Console.WriteLine(stringGetter(input));
}
```

上面的程式碼帶出以下的重點
* `consoleWriteLine`的第一個參數`Func`的定義寫於上方註解，它其實是一個有`input`及`output`的委派
* 委派的方式有三種**具名函式**、**匿名函式**、**Lambda運算式**
* **具名函式**: 將已宣告的方法(`nameMethod`)指給委派
* **匿名函式**: `delegate (arguments) { statements }`
    * delegate: 匿名函式的的保留字
    * arguments: 傳入參數的宣告，可以多個參數(以,隔開)
    * statements: 此函式執行的程式碼片段
    * 這只是簡述，詳細描述可以參考[C# spec](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/language-specification/expressions#anonymous-function-expressions)
* **Lambda**: `arguments => expression | block`
    * arguments: 傳入參數的宣告，可以多個參數(以,隔開)。
        * 只有一個參數時可以不用括號，**複數個參數都要加上括號**
        * 可以不用明確指定型別
        * 可以明確指定型別，明確指定型別時一定要加上括號
        * 沒有傳入參數時用空括號`()`表示
    * expression: 運算式，不括大括號`{}`，只能單行程式碼，代表回傳值
    * block: `{ statements }`: 程式碼區塊，`statement`為此函式執行的程式碼片段

## Lambda語法
在上面的範例說明有用文字描述了Lambda的格式規範，現在我們將每一個格式以例子的方式介紹，藉以加深印象。

格式: `arguments => expression | block`

### `arguments`
* 只有一個傳入參數時可以省略小括弧`()`
```C#
//Only one input parameter
x => x * x  //legal
(x) => x * x    //legal

//Two or more input parameters
x, y => x * y   //illegal
(x, y) => x * y //legal

```
* 可以明確指定型別，明確指定型別時一定要加上括號`()`，不明確指定型別也可以
```C#
string x => x * x   //illegal
(string x) => x * x //legal
x => x * x  //legal
```
* 沒有傳入參數時以空括號`()`表示
```C#
() => Console.WriteLine("Hello Lambda")
```

### `expression`
* 只有單行程式碼時為`expression`，可以不用`{}`包住程式，程式行的最後也不用加`;`，其程式碼所代表的是回傳值
```C#
x => x * x  //delegate (int x) { return x * x; }
```
* 使用`expression`格式的Lambda稱為**Lambda運算式**(Lambda Expressions)

### `block`
* 一般的程式碼區塊，可以多行程式碼，每行最後要加`;`
```C#
x => { return x * x; }
```
* 使用`block`格式的Lambda稱為**Lambda陳述式**(Lambda Statements)

## 結語
這章我們學到了各種函式，**具名函式**、**匿名函式**及**Lambda**，從寫法上來觀察，一個比一個還要簡潔，需要撰寫的程式碼也越來越少，到了Lambda更是能省的都已經省了的地步，再次地體會到`懶惰是人類進步的原動力`這樣的概念。

## 範例程式
[GitHub](https://github.com/peterhpchen/DigDeeperLINQ/tree/06_Lambda/demo/06_Lambda)

## 參考
* [Microsoft Docs-Lambda 運算式](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/statements-expressions-operators/lambda-expressions)
* [Microsoft Docs-匿名方法](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/statements-expressions-operators/anonymous-methods)
* [Microsoft Docs-具名方法委派與匿名方法](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/delegates/delegates-with-named-vs-anonymous-methods)
* [Microsoft Docs-delegate](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/keywords/delegate)
* [Microsoft Docs-Func](https://msdn.microsoft.com/zh-tw/library/bb549151(v=vs.110).aspx)
* [C# Spec-expressions#anonymous-function-expressions](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/language-specification/expressions#anonymous-function-expressions)