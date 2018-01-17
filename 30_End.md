# 旅程的結尾

這個主題在今天要畫上句點了，在這段時間謝謝各位的照顧，每一位鐵人寫的文章都讓我受益良多，希望我的文章也有幫到想要學習LINQ的讀者，這篇來回顧一下這30天的歷程。

## 目錄

首先先來看看這30天的足跡，這裡依照類別來分類，會比較容易查找。

### 旅程前的準備

> 工具及資源介紹、說明

1. [踏上探索的旅途: 前言](01_Preface.md)
1. [探索的準備: 使用工具及資源說明](02_Prepare.md)
1. [每個.NET工程師都要有的一隻箭: LINQPad介紹](03_LINQPad.md)

### 背景知識探索

> 閱讀LINQ原始碼前的基礎知識

1. [藏在`foreach`下的秘密: `foreach`原理說明](04_foreach.md)
1. [仔細體會`yield`的甜美: `yield`介紹](05_yield.md)
1. [Lambda運算式介紹](06_Lambda.md)
1. [變來變去的Generic Type: 泛型介紹](07_Generics.md)
1. [所以什麼是LINQ?](08_WhatIsLINQ.md)
1. [建置dotnet/corefx](10_BuildCoreFX.md)

### LINQ方法/運算式應用探索

> 使用方式及特性說明

1. [Select的應用](09_HowToUseSelect.md)
1. [SelectMany的應用](12_HowToUseSelectMany.md)
1. [Where的應用](14_HowToUseWhere.md)
1. [LINQ排序語法(OrderBy、OrderByDescending、ThenBy、ThenByDescending)的應用](16_HowToUseOrderBy.md)
1. [GroupBy的應用](18_HowToUseGroupBy.md)
1. [Join的應用](20_HowToUseJoin.md)
1. [GroupJoin的應用](22_HowToUseGroupJoin.md)
1. [Skip的應用](24_HowToUseSkip.md)
1. [Take的應用](26_HowToUseTake.md)
1. [Aggregate的應用](28_HowToUseAggregate.md)

### LINQ方法原理探索

> 原始碼及測試案例解析

1. [Select的原碼探險](11_InsideOfSelect.md)
1. [SelectMany的原碼探險](13_InsideOfSelectMany.md)
1. [Where的原碼探險](15_InsideOfWhere.md)
1. [OrderBy的原碼探索](17_InsideOfOrderBy.md)
1. [GroupBy的原碼探索](19_InsideOfGroupBy.md)
1. [Join的原碼探索](21_InsideOfJoin.md)
1. [GroupJoin的原碼探索](23_InsideOfGroupJoin.md)
1. [Skip的原碼探索](25_InsideOfSkip.md)
1. [Take的原碼探索](27_InsideOfTake.md)
1. [Aggregate的原碼探索](29_InsideOfAggregate.md)

## 收穫

這趟旅程下來介紹了10個不同性質的方法，每個方法的原始碼都讓人學到了很多，就算是相同的方法也有不同的實作方式，每看完一個方法所獲取到的東西都是很豐盛的。

在這段時間內也因為常常觀摩*dotnet/corefx*這個程式庫，所以提了一些Issue跟PR，學習了Open Source專案的協同開發方式，也用了超破的英文跟其他國家的人溝通，每一天都是新的體驗。

## 總結

終於這趟旅程進入尾聲了，在這次的鐵人賽中的時間過得又快又慢，快的是文章寫了一半就已經深夜了，慢的是離完賽的時間感覺是如此的遙遠。

如今不知不覺也已經走到了最後一篇了，感覺真的是經歷了一趟艱辛的旅途，但是每趟的旅程都會遇到美景，今天的自己又比30天前的自己又長了更多的見識，釐清了自己本來模糊的觀念，藉由看*dotnet/corefx*的原始碼學到了大神們如何實作及測試，本來覺得神奇的LINQ，在這段時間的抽絲剝繭後，夢幻的氛圍依舊，但在掌握了原始碼的實作後，使用起來也就不會這麼的模糊，變得更加的清晰，希望我有把學到的東西傳達出來，謝謝大家。

## 感謝

* **各位讀者**: 謝謝你們的閱讀，每一個觀看數都是我可以寫下去的原因
* **Sunny**: 謝謝妳幫我校稿，每天都陪我忙到深夜
* **Henry**: 沒有你，就不會有這次的鐵人賽
* **karelz**: 讓我有了第一次PR的機會
* **JonHanna**: 對我的疑惑提供了解答

## GitHub Repository

最後附上GitHub的[連結](https://github.com/peterhpchen/DigDeeperLINQ)，之後有時間會再加上其他的文章。