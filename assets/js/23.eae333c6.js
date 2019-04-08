(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{214:function(e,t,r){"use strict";r.r(t);var n=r(0),_=Object(n.a)({},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"content"},[e._m(0),e._v(" "),e._m(1),e._v(" "),e._m(2),e._v(" "),e._m(3),e._v(" "),e._m(4),e._m(5),e._v(" "),e._m(6),e._v(" "),e._m(7),e._m(8),e._v(" "),e._m(9),e._v(" "),e._m(10),e._v(" "),e._m(11),e._m(12),e._v(" "),e._m(13),e._v(" "),e._m(14),e._v(" "),e._m(15),e._m(16),e._v(" "),e._m(17),e._v(" "),e._m(18),e._v(" "),e._m(19),e._m(20),e._v(" "),e._m(21),e._v(" "),e._m(22),e._v(" "),e._m(23),e._v(" "),e._m(24),e._v(" "),e._m(25),e._v(" "),e._m(26),e._m(27),e._v(" "),e._m(28),e._v(" "),e._m(29),e._v(" "),e._m(30),e._m(31),e._v(" "),e._m(32),e._v(" "),e._m(33),e._v(" "),e._m(34),e._v(" "),r("p",[r("a",{attrs:{href:"https://github.com/dotnet/corefx",target:"_blank",rel:"noopener noreferrer"}},[e._v("dotnet/corefx"),r("OutboundLink")],1)])])},[function(){var e=this.$createElement,t=this._self._c||e;return t("h1",{attrs:{id:"where的原碼探索"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#where的原碼探索","aria-hidden":"true"}},[this._v("#")]),this._v(" Where的原碼探索")])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v("前一章我們講到"),r("code",[e._v("Where")]),e._v("的使用方式，"),r("code",[e._v("Where")]),e._v("使用起來很直覺，就像用"),r("code",[e._v("if else")]),e._v("做判斷一樣，使用一個"),r("code",[e._v("bool")]),e._v("回傳型態的"),r("code",[e._v("Lambda Expression")]),e._v("就可以"),r("strong",[e._v("篩選")]),e._v("我們所需要的資料，既然"),r("code",[e._v("Where")]),e._v("使用起來這麼單純，那我們來看看它的原始碼是不是也這麼單純吧。")])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"原始碼分析"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#原始碼分析","aria-hidden":"true"}},[this._v("#")]),this._v(" 原始碼分析")])},function(){var e=this.$createElement,t=this._self._c||e;return t("ul",[t("li",[this._v("Source Code: https://github.com/dotnet/corefx/blob/master/src/System.Linq/src/System/Linq/Where.cs")]),this._v(" "),t("li",[this._v("Methods: "),t("code",[this._v("Where")]),this._v("有兩個Public Methods，我們先來看看其中一個:")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"language-C# extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[this._v("public static IEnumerable<TSource> Where<TSource>(this IEnumerable<TSource> source, Func<TSource, int, bool> predicate)\n{\n    if (source == null)\n    {\n        throw Error.ArgumentNull(nameof(source));\n    }\n    \n    if (predicate == null)\n    {\n        throw Error.ArgumentNull(nameof(predicate));\n    }\n\n    return WhereIterator(source, predicate);\n}\n")])])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[e._v("判斷"),r("code",[e._v("source")]),e._v("或是"),r("code",[e._v("predicate")]),e._v("是否為空，如果是空的就拋"),r("code",[e._v("ArgumentNull")]),e._v("的例外")]),e._v(" "),r("li",[e._v("如果都是合法參數則回傳"),r("code",[e._v("WhereIterator(source, predicate)")])])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v("這裡我們依然從委派方法有"),r("code",[e._v("index")]),e._v("傳入參數的方法看起，可以看到跟前面介紹的"),r("strong",[e._v("LINQ方法")]),e._v("在架構上幾乎沒有差別，所以關鍵依然在"),r("code",[e._v("Iterator")]),e._v("上，我們來看看"),r("code",[e._v("WhereIterator")]),e._v("的實作:")])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"language-C# extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[this._v("private static IEnumerable<TSource> WhereIterator<TSource>(IEnumerable<TSource> source, Func<TSource, int, bool> predicate)\n{\n    int index = -1;\n    foreach (TSource element in source)\n    {\n        checked\n        {\n            index++;\n        }\n\n        if (predicate(element, index))\n        {\n            yield return element;\n        }\n    }\n}\n")])])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[r("code",[e._v("yield")]),e._v("區塊中的"),r("code",[e._v("yield return")]),e._v("是傳回每個元素的值，而整個方法的回傳型別是"),r("code",[e._v("IEnumerable")])]),e._v(" "),r("li",[e._v("後一個元素會比前個元素多加"),r("strong",[e._v("1")])]),e._v(" "),r("li",[e._v("用"),r("code",[e._v("if")]),e._v("接收"),r("code",[e._v("predicate")]),e._v("執行後的結果來判斷是否要將目前的元素回傳")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[r("code",[e._v("Where")]),e._v("這裡毫無意外的用了"),r("code",[e._v("if")]),e._v("的判斷來決定是否要回傳此元素，整段程式的差別也只有這裡，可見只要學會了"),r("code",[e._v("Iterator")]),e._v("，大部分的"),r("strong",[e._v("LINQ方法")]),e._v("都能夠很快的理解。")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("接著我們要來看第二個Public Method了，這個是"),t("code",[this._v("predicate")]),this._v("沒有"),t("code",[this._v("index")]),this._v("傳入參數的方法:")])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"language-C# extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[this._v("public static IEnumerable<TSource> Where<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)\n{\n    #region 判斷傳入參數合法性\n    if (source == null)\n    {\n        throw Error.ArgumentNull(nameof(source));\n    }\n\n    if (predicate == null)\n    {\n        throw Error.ArgumentNull(nameof(predicate));\n    }\n    #endregion 判斷傳入參數合法性\n\n    #region 依據source的型別決定Iterator\n    if (source is Iterator<TSource> iterator)\n    {\n        return iterator.Where(predicate);\n    }\n\n    if (source is TSource[] array)\n    {\n        return array.Length == 0 ?\n            (IEnumerable<TSource>)EmptyPartition<TSource>.Instance :\n            new WhereArrayIterator<TSource>(array, predicate);\n    }\n\n    if (source is List<TSource> list)\n    {\n        return new WhereListIterator<TSource>(list, predicate);\n    }\n\n    return new WhereEnumerableIterator<TSource>(source, predicate);\n    #endregion 依據source的型別決定Iterator\n}\n")])])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[e._v("判斷傳入參數"),r("code",[e._v("source")]),e._v("及"),r("code",[e._v("predicate")]),e._v("是否為空，空的話回傳"),r("code",[e._v("ArgumentNull")]),e._v("例外")]),e._v(" "),r("li",[e._v("依據"),r("code",[e._v("source")]),e._v("的型別決定"),r("code",[e._v("Iterator")]),e._v(" "),r("ul",[r("li",[e._v("已經是"),r("code",[e._v("Iterator")]),e._v("的話就直接叫用"),r("code",[e._v("Iterator")]),e._v("的"),r("code",[e._v("Where")])]),e._v(" "),r("li",[e._v("是"),r("code",[e._v("Array")]),e._v("的話回傳"),r("code",[e._v("WhereArrayIterator")])]),e._v(" "),r("li",[e._v("是"),r("code",[e._v("List")]),e._v("的話回傳"),r("code",[e._v("WhereListIterator")])]),e._v(" "),r("li",[e._v("只是"),r("code",[e._v("IEnumerable")]),e._v("的話就回傳"),r("code",[e._v("WhereEnumerableIterator")])])])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("每個"),t("code",[this._v("Iterator")]),this._v("的處理都大同小異，主要的差別在對於各個型別的處理而已，我們就挑"),t("code",[this._v("WhereArrayIterator")]),this._v("來說明內部運作吧:")])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[r("code",[e._v("MoveNext()")]),e._v(": 這是整個"),r("code",[e._v("Iterator")]),e._v("最重要的Method，來看一下"),r("code",[e._v("Where")]),e._v("是怎麼實作"),r("code",[e._v("MoveNext()")]),e._v("的")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"language-C# extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[this._v("public override bool MoveNext()\n{\n    int index = _state - 1;\n    TSource[] source = _source;\n\n    while (unchecked((uint)index < (uint)source.Length))\n    {\n        TSource item = source[index];\n        index = _state++;\n        if (_predicate(item))\n        {\n            _current = item;\n            return true;\n        }\n    }\n\n    Dispose();\n    return false;\n}\n")])])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("ul",[r("li",[r("code",[e._v("_state")]),e._v("為陣列位置的基準，在"),r("code",[e._v("GetEnumerator()")]),e._v("執行後會被設為"),r("strong",[e._v("1")]),e._v("，所以起始的"),r("code",[e._v("index")]),e._v("是"),r("code",[e._v("_state - 1")])]),e._v(" "),r("li",[e._v("巡覽至陣列最尾端，每次都用"),r("code",[e._v("predicate")]),e._v("取得是否要回傳元素的判斷")]),e._v(" "),r("li",[e._v("通過"),r("code",[e._v("predicate")]),e._v("後將"),r("code",[e._v("current")]),e._v("設為目前的元素，然後回傳"),r("code",[e._v("true")])]),e._v(" "),r("li",[e._v("如果巡覽結束則"),r("code",[e._v("Dispose()")]),e._v("跟"),r("code",[e._v("return false")])])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v("這裡我們可以看到"),r("code",[e._v("_state")]),e._v("的用法跟前面介紹的"),r("code",[e._v("SelectMany")]),e._v("是不一樣的，"),r("code",[e._v("SelectMany")]),e._v("是用來決定是在"),r("strong",[e._v("第幾層")]),e._v("的"),r("code",[e._v("Enumerator")]),e._v("和巡覽結束後要"),r("strong",[e._v("跳回")]),e._v("哪層"),r("code",[e._v("Enumerator")]),e._v("，而"),r("code",[e._v("Where")]),e._v("則是完全當作"),r("code",[e._v("index")]),e._v("來使用。")])},function(){var e=this.$createElement,t=this._self._c||e;return t("ul",[t("li",[t("code",[this._v("GetCount")]),this._v(": 取得集合的元素數量")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"language-C# extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[this._v("public int GetCount(bool onlyIfCheap)\n{\n    if (onlyIfCheap)\n    {\n        return -1;\n    }\n\n    int count = 0;\n\n    foreach (TSource item in _source)\n    {\n        if (_predicate(item))\n        {\n            checked\n            {\n                count++;\n            }\n        }\n    }\n\n    return count;\n}\n")])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("ul",[t("li",[this._v("如果通過"),t("code",[this._v("predicate")]),this._v("的驗證則"),t("code",[this._v("count")]),this._v("加"),t("strong",[this._v("1")])])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v("之前我知道了"),r("code",[e._v("Where")]),e._v("是"),r("strong",[e._v("延遲執行")]),e._v("後我就很好奇它的"),r("code",[e._v("GetCount()")]),e._v("是怎麼運作的，原來還是會"),r("strong",[e._v("全部執行後")]),e._v("才取得元素"),r("strong",[e._v("數量")]),e._v("。")])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"測試案例賞析"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#測試案例賞析","aria-hidden":"true"}},[this._v("#")]),this._v(" 測試案例賞析")])},function(){var e=this.$createElement,t=this._self._c||e;return t("ul",[t("li",[this._v("Source Code: https://github.com/dotnet/corefx/blob/master/src/System.Linq/tests/WhereTests.cs")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("h3",{attrs:{id:"where-sourcethrowsongetenumerator"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#where-sourcethrowsongetenumerator","aria-hidden":"true"}},[this._v("#")]),this._v(" Where_SourceThrowsOnGetEnumerator")])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v("這個案例的"),r("code",[e._v("source")]),e._v("是"),r("code",[e._v("ThrowsOnGetEnumerator()")]),e._v("，會在第一次叫用"),r("code",[e._v("GetEnumerator()")]),e._v("時丟出"),r("code",[e._v("InvalidOperationException")]),e._v("例外。")])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"language-C# extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[this._v("protected class ThrowsOnGetEnumerator : TestEnumerator\n{\n    private int getEnumeratorCallCount;\n\n    public override IEnumerator<int> GetEnumerator()\n    {\n        if (getEnumeratorCallCount++ == 0)\n        {\n            throw new InvalidOperationException();\n        }\n\n        return base.GetEnumerator();\n    }\n}\n\n[Fact]\npublic void Where_SourceThrowsOnGetEnumerator()\n{\n    IEnumerable<int> source = new ThrowsOnGetEnumerator();\n    Func<int, bool> truePredicate = (value) => true;\n\n    var enumerator = source.Where(truePredicate).GetEnumerator();\n\n    // Ensure the first MoveNext call throws an exception\n    Assert.Throws<InvalidOperationException>(() => enumerator.MoveNext());\n\n    // Ensure Current is set to the default value of type T\n    int currentValue = enumerator.Current;\n    Assert.Equal(default(int), currentValue);\n    \n    // Ensure subsequent MoveNext calls succeed\n    Assert.True(enumerator.MoveNext());\n    Assert.Equal(1, enumerator.Current);\n}\n")])])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v("要看懂這個測試案例要建立一個觀念: "),r("code",[e._v("Where")]),e._v("叫用的"),r("code",[e._v("GetEnumerator()")]),e._v("並不是"),r("code",[e._v("source")]),e._v("的"),r("code",[e._v("GetEnumerator()")]),e._v("，而是"),r("code",[e._v("Where")]),e._v("自己的"),r("code",[e._v("GetEnumerator()")]),e._v("。")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("知道這觀念後我們再看測試案例，這樣也就說得通為什麼不是在"),t("code",[this._v("var enumerator = source.Where(truePredicate).GetEnumerator();")]),this._v("拋出例外，而是在"),t("code",[this._v("enumerator.MoveNext()")]),this._v("丟出例外。")])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v("由於我們剛剛介紹"),r("code",[e._v("Where")]),e._v("的"),r("code",[e._v("MoveNext()")]),e._v("的"),r("code",[e._v("source")]),e._v("是"),r("code",[e._v("Array")]),e._v("的，所以他並沒有叫用"),r("code",[e._v("GetEnumerator()")]),e._v("，現在我們來看看"),r("code",[e._v("WhereEnumerableIterator")]),e._v("的"),r("code",[e._v("MoveNext()")]),e._v(":")])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"language-C# extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[this._v("public override bool MoveNext()\n{\n    switch (_state)\n    {\n        case 1:\n            _enumerator = _source.GetEnumerator();\n            _state = 2;\n            goto case 2;\n        case 2:\n            while (_enumerator.MoveNext())\n            {\n                TSource item = _enumerator.Current;\n                if (_predicate(item))\n                {\n                    _current = item;\n                    return true;\n                }\n            }\n\n            Dispose();\n            break;\n    }\n\n    return false;\n}\n")])])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("p",[e._v("這裡才是"),r("code",[e._v("source.GetEnumerator()")]),e._v("叫用的地方，所以我們第一次叫用"),r("code",[e._v("source")]),e._v("的"),r("code",[e._v("GetEnumerator()")]),e._v("是在"),r("code",[e._v("MoveNext()")]),e._v("而不是在"),r("code",[e._v("Where")]),e._v("叫用"),r("code",[e._v("GetEnumerator()")]),e._v("時。")])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"結語"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#結語","aria-hidden":"true"}},[this._v("#")]),this._v(" 結語")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("Where語法的主要運作原理在於巡覽時使用"),t("code",[this._v("predicate")]),this._v("的結果判斷是否將此元素加入結果集合中，簡單的用"),t("code",[this._v("if")]),this._v("判斷就可以做出如此實用的方法真的是太棒了。")])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"參考"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#參考","aria-hidden":"true"}},[this._v("#")]),this._v(" 參考")])}],!1,null,null,null);t.default=_.exports}}]);