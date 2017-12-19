# 探索的準備
相信各位或多或少都有玩過線上遊戲，在遊戲中我們扮演的角色都會需要去打怪賺取經驗值、提升等級進而增強自己的實力，對我來說學習技術也是可以套用在這個公式上的，我們去研讀文章、撰寫程式，跟我們在遊戲中打怪提升經驗是一樣的，但是實際上不是這麼簡單的，就算將角色練到了很高的等級，如果沒有好的裝備或是藥水，照樣會走上`勝敗乃兵家常事，大俠請重新來過...`一途，所以我們這一章就是要來說說我們要帶著哪些神兵利器踏上我們的冒險旅途。

## 環境概述
* OS: Windows 10
* 語言: C#
* .NET版本: .NET Core 2.0
* IDE: Visual Studio 2017

## LINQPad(The .NET Programmer's Playground)
* 連結: [LINQPad](http://www.linqpad.net/)

`LINQPad`是一個可以讀取.NET相關語言並產出結果的工具，像是強化版的[.NET Fiddle](https://dotnetfiddle.net/)或是弱化版的Visual Studio，不只有LINQ語法，只要是.NET的語言(C#、F#、VB)都可以做演示，還可以直接連接資料庫，用LINQ的語法來Query出所需的資料，我認為LINQPad對我幫助最大的地方有兩個:
* 在嘗試寫法時可以直接用LINQPad做演練
* 在LINQPad中撰寫LINQ確定取得期望的資料

在後續的章節中會詳細介紹此工具的詳細用法。

## dotnet/corefx(.NET Core foundational libraries)
* 連結: [.NET Core foundational libraries](https://github.com/dotnet/corefx)

本文使用`.NET Core`來做為示範，因其是Open Source的，在GitHub上就找的到Source Code，在還沒有Open Source前要研究原理就只能查詢公開的文件或是自己用Decompiler去找出原碼，現在終於不用這麼辛苦，可以直接看到程式碼來學習了。

本文是LINQ的分享，所以會聚焦在[System.Linq](https://github.com/dotnet/corefx/tree/master/src/System.Linq)上，文章中解釋的原理都是依照此原碼來的，這裡的測試案例及原碼都很有參考價值，有興趣的朋友可以去瞧瞧。

## Northwind(範例資料庫)
* 連結: [在SQL Server 2012安裝Northwind資料庫](http://limitlessping.blogspot.tw/2016/04/sql-server-2012northwind.html)

這是微軟SQL Server 2000的範例資料庫，在LINQPad上當作範例使用，本文也會使用這個資料庫做為範本來演示相關的操作。

## 參考文件
這裡列列上我自己學習時所看的資源:
* [C# Spec](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/): C# 6.0的語言規格書。
* [LINQ](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/): LINQ說明

## 結語
有了LINQPad當武器、參考資料當護具及dotnet/corefx當地圖，相信我們的這趟旅程一定可以很順利的，下一篇會介紹`LINQPad`的使用方法，我們下次再見嘍。