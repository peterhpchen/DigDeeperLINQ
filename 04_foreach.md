# 藏在`foreach`下的秘密: `foreach`原理說明
在開始使用LINQ之後，以前大量使用的`foreach`已經慢慢的淡出了我的螢光幕前...，我其實一直都沒意識到這一點，直到我在構思這次的文章時，才又想起了這昔日的好戰友，究竟為什麼會因為使用了LINQ而減少了`foreach`使用的次數呢?讓我們繼續看下去。

## 嘗試的第一步
總而言之我們先寫一個`foreach`的範例:
```C#
int[] integers = new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };

Console.WriteLine($"Is Array: {integers is Array}"); //Is Array: true

foreach (int integer in integers)
{
    Console.Write($"{integer} ");
} // 0 1 2 3 4 5 6 7 8 9 
```

這個是巡覽一個0~9數字的陣列，然後把這些數字印到終端的範例。

非常簡單的範例，但卻帶出了不簡單的疑問: **為什麼foreach知道要怎麼做巡覽?**，可能有人已經發現我有個提示在程式碼裡:

```C#
Console.WriteLine($"Is Array: {integerArray is Array}"); //Is Array: true
```

**因為`integers`是`Array`!!**，嗯...這個答案是對也是不對，因為其實有其他非Array的物件也是可以用    `foreach`來做巡覽的，例如我改為下面這樣子: 

```C#
String integers = "0123456789";

Console.WriteLine($"Is Array: {integers is Array}"); //Is Array: false

foreach (char integer in integers)
{
    Console.Write($"{integer} ");
} // 0 1 2 3 4 5 6 7 8 9 
```

把`integers`從`int[]`改為`String`照樣還是可以做巡覽，這是為什麼呢?

## 從錯誤中學習
