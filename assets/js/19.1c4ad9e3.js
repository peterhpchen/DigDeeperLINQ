(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{221:function(e,n,t){"use strict";t.r(n);var r=t(0),s=Object(r.a)({},function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"content"},[e._m(0),e._v(" "),t("p",[e._v("泛型(Generic Type)是一個C#語言的功能，它可以讓你在定義"),t("strong",[e._v("Class")]),e._v("、"),t("strong",[e._v("Method")]),e._v("、"),t("strong",[e._v("Interface")]),e._v("時先不用決定型別，到了要實體化的時候再決定其型別，這在集合的應用("),t("a",{attrs:{href:"https://docs.microsoft.com/zh-tw/dotnet/api/system.collections.generic?view=netframework-4.7.1",target:"_blank",rel:"noopener noreferrer"}},[e._v("System.Collections.Generic"),t("OutboundLink")],1),e._v(")上更為重要，因為集合通常只是容器而已，只需要訂定巡覽、新增、刪除元素...等的方法，而訂定這些方法並不需要知道元素的型別，管它是字串還是數字，跟容器本身的實作並沒有關係，因此集合用泛型實作是最佳的選擇，而LINQ就是一個集合的應用方法，當然就用到了大量的Generic Type。")]),e._v(" "),e._m(1),e._v(" "),t("p",[e._v("為了說明泛型的好處，我們來講一間箱子工廠的故事吧。")]),e._v(" "),t("p",[e._v("有間箱子工廠平常都是生產正方形的箱子:")]),e._v(" "),e._m(2),t("p",[e._v("運作的結果如下:")]),e._v(" "),e._m(3),t("p",[e._v("有一天工廠的老闆接到一個大客戶的訂單，興奮地跑到工廠跟廠長說了這個消息。")]),e._v(" "),e._m(4),e._v(" "),e._m(5),e._v(" "),e._m(6),e._v(" "),e._m(7),e._v(" "),e._m(8),t("p",[e._v("現在工廠運作是這樣的:")]),e._v(" "),e._m(9),e._m(10),e._v(" "),t("p",[e._v("於是老闆左思右想終於想到了一個方法: 那我們的工廠就生產個比較大的箱子，這個箱子可以放下各個不同形狀的箱子，這樣不管以後再來多少不一樣的需求我都可以賺錢了阿。")]),e._v(" "),t("p",[e._v("廠長聽了老闆的想法後立刻改造了工廠:")]),e._v(" "),e._m(11),t("p",[e._v("現在工廠的運作狀況變這樣:")]),e._v(" "),e._m(12),e._m(13),e._v(" "),e._m(14),e._v(" "),e._m(15),t("p",[e._v("現在工廠運作變成這樣:")]),e._v(" "),e._m(16),e._m(17),e._v(" "),t("p",[e._v("接著我們來回顧一下這個故事:")]),e._v(" "),e._m(18),e._v(" "),e._m(19),e._v(" "),t("p",[e._v("泛型可以用在很多地方，像是類別、介面、方法...等，規則大同小異，因為LINQ常用的是泛型方法，所以就方法的部分來做介紹:")]),e._v(" "),e._m(20),t("ul",[e._m(21),e._v(" "),e._m(22),e._v(" "),e._m(23),e._v(" "),t("li",[e._v("可以以"),t("code",[e._v("where")]),e._v("定義型別參數的條件，以此例來說，"),t("code",[e._v("where T : new()")]),e._v("定義"),t("code",[e._v("T")]),e._v("有建構子，如此一來我們才可以在"),t("code",[e._v("new T()")]),e._v("，請參考"),t("a",{attrs:{href:"https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters",target:"_blank",rel:"noopener noreferrer"}},[e._v("Microsoft Docs-型別參數的條件約束"),t("OutboundLink")],1)])]),e._v(" "),e._m(24),e._v(" "),t("p",[e._v("泛型非常好用，比起Object既是強型別又不用轉換，也比特定型別定義來的有彈性，可以大大減少程式碼的編寫量，又可以寫出可讀性更高的程式，好泛型，不用嗎?")]),e._v(" "),e._m(25),e._v(" "),t("p",[t("a",{attrs:{href:"https://github.com/peterhpchen/DigDeeperLINQ/tree/07_Generics/demo/07_Generics",target:"_blank",rel:"noopener noreferrer"}},[e._v("GitHub"),t("OutboundLink")],1)]),e._v(" "),e._m(26),e._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/generics/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Microsoft Docs-泛型"),t("OutboundLink")],1)]),e._v(" "),t("li",[t("a",{attrs:{href:"https://docs.microsoft.com/zh-tw/dotnet/api/system.collections.generic?view=netframework-4.7.1",target:"_blank",rel:"noopener noreferrer"}},[e._v("Microsoft Docs-System.Collections.Generic"),t("OutboundLink")],1)])])])},[function(){var e=this.$createElement,n=this._self._c||e;return n("h1",{attrs:{id:"變來變去的generic-type-泛型介紹"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#變來變去的generic-type-泛型介紹","aria-hidden":"true"}},[this._v("#")]),this._v(" 變來變去的Generic Type: 泛型介紹")])},function(){var e=this.$createElement,n=this._self._c||e;return n("h2",{attrs:{id:"箱子工廠"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#箱子工廠","aria-hidden":"true"}},[this._v("#")]),this._v(" 箱子工廠")])},function(){var e=this.$createElement,n=this._self._c||e;return n("div",{staticClass:"language-C# extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[this._v('class Program\n{\n    static void Main(string[] args)\n    {\n        BoxFactory boxFactory = new BoxFactory();\n        boxFactory.Start();\n    }\n}\n\nclass BoxFactory\n{\n    public BoxFactory()\n    {\n        Console.WriteLine("這是一間箱子工廠");\n    }\n\n    class SquareBoxMaker\n    {\n        public SquareBoxMaker()\n        {\n            Console.WriteLine("正方形箱子製造機建置完成");\n        }\n\n        public SquareBox GetSquareBox()\n        {\n            Console.WriteLine("產生正方形箱子");\n            return new SquareBox();\n        }\n    }\n\n    public void Start()\n    {\n        Console.WriteLine("工廠開始運作");\n        SquareBoxMaker maker = new SquareBoxMaker();\n        maker.GetSquareBox();\n    }\n}\n')])])])},function(){var e=this.$createElement,n=this._self._c||e;return n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[this._v("/* \n * 這是一間箱子工廠\n * 工廠開始運作\n * 正方形箱子製造機建置完成\n * 產生正方形箱子\n */\n")])])])},function(){var e=this.$createElement,n=this._self._c||e;return n("p",[this._v("老闆: 廠長，我剛剛接到一個要生產大量"),n("strong",[this._v("三角形箱子")]),this._v("的訂單啦~~。")])},function(){var e=this.$createElement,n=this._self._c||e;return n("p",[this._v("廠長: 可是這個客戶它要的是"),n("strong",[this._v("三角形的箱子")]),this._v("，工廠裡沒這樣的機器阿!!")])},function(){var e=this.$createElement,n=this._self._c||e;return n("p",[this._v("老闆: 這是一個大客戶，沒關係，"),n("strong",[this._v("多買一台")]),this._v("吧。")])},function(){var e=this.$createElement,n=this._self._c||e;return n("p",[this._v("於是工廠裡就多了一台"),n("strong",[this._v("製造三角形箱子的機器")]),this._v(":")])},function(){var e=this.$createElement,n=this._self._c||e;return n("div",{staticClass:"language-C# extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[this._v('class BoxFactory\n{\n    public BoxFactory()\n    {\n        Console.WriteLine("這是一間箱子工廠");\n    }\n    class SquareBoxMaker\n    {\n        ...\n    }\n\n    class TriangleBoxMaker\n    {\n        public TriangleBoxMaker()\n        {\n            Console.WriteLine("三角形箱子製造機建置完成");\n        }\n        public TriangleBox GetTriangleBox()\n        {\n            Console.WriteLine("產生三角形箱子");\n            return new TriangleBox();\n        }\n    }\n\n    public void Start()\n    {\n        Console.WriteLine("工廠開始運作");\n\n        SquareBoxMaker squareBoxMaker = new SquareBoxMaker();\n        TriangleBoxMaker triangleBoxMaker = new TriangleBoxMaker();\n        squareBoxMaker.GetSquareBox();\n        triangleBoxMaker.GetTriangleBox();\n    }\n}\n')])])])},function(){var e=this.$createElement,n=this._self._c||e;return n("div",{staticClass:"language-C# extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[this._v("/*\n * 這是一間箱子工廠\n * 工廠開始運作\n * 正方形箱子製造機建置完成\n * 三角形箱子製造機建置完成\n * 產生正方形箱子\n * 產生三角形箱子\n*/\n")])])])},function(){var e=this.$createElement,n=this._self._c||e;return n("p",[this._v("過了一陣子，公司就接到了一個客戶要做"),n("strong",[this._v("圓形的箱子")]),this._v("，不過這個客戶的訂單量很少，為了他買一台圓形箱子的製造機並不划算，可是老闆怎麼會錯過這個賺錢的機會呢。")])},function(){var e=this.$createElement,n=this._self._c||e;return n("div",{staticClass:"language-C# extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[this._v('class BoxFactory\n{\n    public BoxFactory()\n    {\n        Console.WriteLine("這是一間箱子工廠");\n    }\n\n    class ObjectBoxMaker\n    {\n        public ObjectBoxMaker()\n        {\n            Console.WriteLine("\'大\'箱子製造機建置完成");\n        }\n\n        public object GetBox(string shape)\n        {\n            Console.WriteLine("產生\'大\'箱子");\n            if (shape == "Triangle") return new TriangleBox();\n            if (shape == "Square") return new SquareBox();\n            return new CircleBox();\n        }\n    }\n\n    public void Start()\n    {\n        Console.WriteLine("工廠開始運作");\n        ObjectBoxMaker maker = new ObjectBoxMaker();\n        maker.GetBox("Square");\n        maker.GetBox("Triangle");\n        maker.GetBox("Circle");\n    }\n}\n')])])])},function(){var e=this.$createElement,n=this._self._c||e;return n("div",{staticClass:"language-C# extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[this._v("/*\n * 這是一間箱子工廠\n * 工廠開始運作\n * '大'箱子製造機建置完成\n * 產生'大'箱子\n * 產生'大'箱子\n * 產生'大'箱子\n */\n")])])])},function(){var e=this.$createElement,n=this._self._c||e;return n("p",[this._v("又過了一陣子，公司開始接到客戶的抱怨電話: 那個'大'箱子雖然可以容納各種形狀的箱子，但是每次都要打開來"),n("strong",[this._v("確定它真正的形狀是什麼")]),this._v("，"),n("strong",[this._v("效率差了一大截")]),this._v("阿。")])},function(){var e=this.$createElement,n=this._self._c||e;return n("p",[this._v("老闆這下子可真慌了手腳了，弄巧成拙，一時之間又想不出辦法，於是只能硬著頭皮去請救兵-"),n("strong",[this._v("泛型哥")]),this._v("幫忙，泛型哥聽了老闆的說明以後不慌不忙地將工廠改造成這樣:")])},function(){var e=this.$createElement,n=this._self._c||e;return n("div",{staticClass:"language-C# extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[this._v('class SquareBox\n{\n    public SquareBox()\n    {\n        Console.WriteLine("正方形箱子");\n    }\n}\n\nclass TriangleBox\n{\n    public TriangleBox()\n    {\n        Console.WriteLine("三角形箱子");\n    }\n}\n\nclass CircleBox\n{\n    public CircleBox()\n    {\n        Console.WriteLine("圓形箱子");\n    }\n}\n\nclass BoxFactory\n{\n    public BoxFactory()\n    {\n        Console.WriteLine("這是一間箱子工廠");\n    }\n    \n    class GenericBoxMaker\n    {\n        public GenericBoxMaker()\n        {\n            Console.WriteLine("箱子製造機建置完成");\n        }\n\n        public object GetBox<T>() where T : new()\n        {\n            Console.WriteLine("產生合適的箱子");\n            return new T();\n        }\n    }\n    public void Start()\n    {\n        Console.WriteLine("工廠開始運作");\n        GenericBoxMaker maker = new GenericBoxMaker();\n        maker.GetBox<SquareBox>();\n        maker.GetBox<TriangleBox>();\n        maker.GetBox<CircleBox>();\n    }\n}\n')])])])},function(){var e=this.$createElement,n=this._self._c||e;return n("div",{staticClass:"language-C# extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[this._v("/*\n * 這是一間箱子工廠\n * 工廠開始運作\n * 箱子製造機建置完成\n * 產生合適的箱子\n * 正方形箱子\n * 產生合適的箱子\n * 三角形箱子\n * 產生合適的箱子\n * 圓形箱子\n */\n")])])])},function(){var e=this.$createElement,n=this._self._c||e;return n("p",[n("strong",[this._v("泛型")]),this._v("哥完美的解決了公司的危機，這個故事也告一個段落了。")])},function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("ol",[t("li",[e._v("特定箱子的製造機: 每個製造機只能產出跟其對應形狀的箱子\n"),t("ul",[t("li",[e._v("在"),t("strong",[e._v("定義類別時就決定了型別")])])])]),e._v(" "),t("li",[e._v("大箱子的製造機: 此製造機所產出的箱子(Object)是相容於每個不同形狀的箱子\n"),t("ul",[t("li",[e._v("所有的輸出類別都轉為"),t("code",[e._v("Object")]),e._v("，使其變為"),t("strong",[e._v("弱型別")])]),e._v(" "),t("li",[t("code",[e._v("Object")]),e._v("在取值及附值時都需要"),t("strong",[e._v("花費轉換的時間")])])])]),e._v(" "),t("li",[e._v("泛型哥的製造機: 在定義時使用泛型先"),t("strong",[e._v("暫緩型別的規格定義")]),e._v("，到了"),t("strong",[e._v("實體化時再定義其型別規格")]),e._v(" "),t("ul",[t("li",[t("strong",[e._v("強型別")])]),e._v(" "),t("li",[t("strong",[e._v("不需做轉換")])])])])])},function(){var e=this.$createElement,n=this._self._c||e;return n("h2",{attrs:{id:"泛型方法介紹"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#泛型方法介紹","aria-hidden":"true"}},[this._v("#")]),this._v(" 泛型方法介紹")])},function(){var e=this.$createElement,n=this._self._c||e;return n("div",{staticClass:"language-C# extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[this._v("public T Generic<T>(T b) where T : new()\n{\n    return new T();\n}\n")])])])},function(){var e=this.$createElement,n=this._self._c||e;return n("li",[this._v("在方法名稱的後面以"),n("code",[this._v("<>")]),this._v("括住待定義的型別參數")])},function(){var e=this.$createElement,n=this._self._c||e;return n("li",[this._v("待定義的型別參數名稱習慣以"),n("code",[this._v("T")]),this._v("開頭(Ex: "),n("code",[this._v("TResult")]),this._v(")")])},function(){var e=this.$createElement,n=this._self._c||e;return n("li",[this._v("泛型可用在"),n("strong",[this._v("傳入參數")]),this._v("及"),n("strong",[this._v("回傳值")])])},function(){var e=this.$createElement,n=this._self._c||e;return n("h2",{attrs:{id:"結語"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#結語","aria-hidden":"true"}},[this._v("#")]),this._v(" 結語")])},function(){var e=this.$createElement,n=this._self._c||e;return n("h2",{attrs:{id:"範例程式"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#範例程式","aria-hidden":"true"}},[this._v("#")]),this._v(" 範例程式")])},function(){var e=this.$createElement,n=this._self._c||e;return n("h2",{attrs:{id:"參考"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#參考","aria-hidden":"true"}},[this._v("#")]),this._v(" 參考")])}],!1,null,null,null);n.default=s.exports}}]);