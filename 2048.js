/**
 * Created by Administrator on 2016/12/29 0029.
 */

$(function () {
    console.log("JQ");
    //var 值声明
    var arrMain = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//对应的2048主体。

    //初始化
    $("#start").on("click", function () {
        init(arrMain)
    });

    $("#div2048").on("click",".end",function () {
        console.log("end click");
        arrMain = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        init(arrMain);
    });
    /*
     *操作 按键上下左右事件
     * */
    var win=getWin();
    $(window).keyup(function (event) {
        console.log(event.keyCode);

       if($("#div2048").find("div").length==16){
           switch (event.keyCode) {

               // 常用keyCode： 左37   上 38   右 39   下40
               case 38:
                   up(arrMain);
                   // console.log(arrMain);
                   win.wins();
                   break;
               case 40:
                   down(arrMain);
                   win.wins();
                   break;
               case 37:
                   left(arrMain);
                   win.wins();
                   break;
               case 39:
                   right(arrMain);
                   win.wins();
                   break;
           }
       }
        console.log(new Win());
    });
});

/*
 * 抽取出来的函数
 * */
function init(arrMain) {
    /*
     * 初始化
     * */
    //在#div2048中生成16个div
    var $div2048 = $("#div2048"); //提取，JQ复用。
    $div2048.empty();
    for (var i = 0; i < 16; i++) {
        var divIn = $("<div></div>");
        $div2048.append(divIn);
    }
    //生成两个随机的2或4；
    //赋值到数组中，
    arrMain[createRanNum(arrMain)] = Math.random() < 0.5 ? 2 : 4;
    arrMain[createRanNum(arrMain)] = Math.random() < 0.5 ? 2 : 4;
    //刷新主题
    refreshTheme(arrMain);

}


function refreshTheme(arrary) {
    //函数的主要作用在于根据数组的变化，更新对应的界面主题；
    var $div2048 = $("#div2048");
    $div2048.find("div").each(function (index) {
        $(this).text(arrary[index]);
        $(this).removeClass().addClass("tile").addClass("tile" + $(this).text());
    })
}
/*
 * createRanNum(arrMain) 函数作用
 * 选定数组中为0的区域中随机位置
 *
 * */
function createRanNum(arrMain) {
    // 在空位置中随机生成
    var num = Math.floor(Math.random() * 16);
    // 如果该位置有值,就返回重新生成
    while (arrMain[num] != 0) {
        num = Math.floor(Math.random() * 16);
    }
    return num;
}

/*
 * 数组处理，主要分成两个部分，
 * 1.将数组中的0排在数组的后面
 * 2.从数组开头开始比较；如果有相等的数字的话，相加两项，并且将后面的数字向前移动一位，最后一个数字置为0
 * */
function arrayCR(row) {
    var cflag = false;
    //先把数组里面的零放在末尾
    if (!(row[0] == 0 && row[1] == 0 && row[2] == 0 && row[3] == 0)) {
        // 把数组中是0往后移动
        for (var m = 0; m < 4; m++) {
            for (var n = 0; n < 3; n++) {
                if (row[n + 1] == 0) {

                } else if (row[n] == 0) {
                    row[n] = row[n + 1];
                    row[n + 1] = 0;
                    cflag = true; //有效移动 可以增加数组
                }
            }
        }
    }
    //如果相等的
    for (var j = 0; j < 3; j++) {
        if (row[j] != 0 && row[j] == row[j + 1]) {
            cflag = true;
            var l = j;
            row[l] += row[l + 1];
            //进行判断
            //如果为2048就赢了 分数通过函数进行值传递
            new Win().max(row[l]);

            while (++l < 3) {  //后面的数字进行位移；如 1和2相加 将3向前移动，4直接变为0（因为减少了一位数字，末尾必然为0）
                row[l] = row[l + 1];
            }
            row[3] = 0; //4直接变为0（因为减少了一位数字，末尾必然为0）

        }
    }
    return cflag;
}

/*
 * 向上操作，
 * 1.构建相同特性数组：竖排标号为一组
 *  ↓
 *  0 | 1 | 2 | 3
 *  4 | 5 | 6 | 7
 *  8 | 9 | 10| 11
 *  12| 13| 14| 15
 *
 *  分析发现数组特性为[4 * j + i]
 *  构建基础数组进行操作，for循环进行批量操作
 *
 *  2.调用arrayCR（row）函数进行数组操作
 *
 *  3.根据返回值（有效操作）判断是否需要添加新的内容加入数组中（数组中为0的区域中随机产生）
 *  4.刷新界面主题
 *
 * */
function up(arrMain) {
    var row = [];
    var cflag = [false, false, false, false];
    //对于每列进行操作，
    for (var i = 0; i < 4; i++) {
        row = [arrMain[i + 0], arrMain[i + 4], arrMain[i + 8], arrMain[i + 12]];
        cflag[i] = arrayCR(row);
        //赋值
        for (var k = 0; k < 4; k++) {
            arrMain[4 * k + i] = row[k];
        }
    }
    if (cflag[0] || cflag[1] || cflag[2] || cflag[3]) { //只要有一次有效移动便可以在空位增加一项
        arrMain[createRanNum(arrMain)] = Math.random() < 0.5 ? 2 : 4;
    }
    refreshTheme(arrMain);//刷新主题
    isEnd(arrMain);
}
/*
 * 向下操作，
 * 1.构建相同特性数组：竖排标号为一组
 *
 *  — | — | — | —
 *  0 | 1 | 2 | 3
 *  4 | 5 | 6 | 7
 *  8 | 9 | 10| 11
 *  12| 13| 14| 15
 *  ↑
 *  思考：向下操作和向上操作的不同点是，
 *      1.向上 数组的0放在末尾。向下操作将0放在头部
 *      2.对数字的处理，向上是从0开始，而向下是从下面开始
 *  利用数据结构进行处理
 *      颠倒数组结构便可以利用一样的函数进行操作，但是需要注意赋值操作
 *
 * */
function down(arrMain) {
    var row = [];
    var cflag = [false, false, false, false];
    //对于每列进行操作，
    for (var i = 0; i < 4; i++) {
        row = [arrMain[i + 12], arrMain[i + 8], arrMain[i + 4], arrMain[i]];

        cflag[i] = arrayCR(row);

        //赋值
        for (var k = 0; k < 4; k++) {
            arrMain[4 * (3 - k) + i] = row[k];
        }
    }

    if (cflag[0] || cflag[1] || cflag[2] || cflag[3]) {
        arrMain[createRanNum(arrMain)] = Math.random() < 0.5 ? 2 : 4;
    }
    refreshTheme(arrMain);//刷新主题
    isEnd(arrMain);

}

/*
 * 向左
 * 1.构建基本数组模型
 *   0  1  2  3
 *   ——————————
 *   4  5  6  7
 *   ——————————
 *   8  9  10 11
 *   ——————————
 *   12 13 14 15
 *   ——————————
 *   规则为[4*i+j]
 * */
function left(arrMain) {
    var row = [];
    var cflag = [false, false, false, false];
    //对于每列进行操作，
    for (var i = 0; i < 4; i++) {
        row = [arrMain[i * 4], arrMain[i * 4 + 1],
            arrMain[i * 4 + 2], arrMain[i * 4 + 3]];
        cflag[i] = arrayCR(row);

        //赋值
        for (var k = 0; k < 4; k++) {
            arrMain[4 * i + k] = row[k];
        }
    }
    if (cflag[0] || cflag[1] || cflag[2] || cflag[3]) {
        arrMain[createRanNum(arrMain)] = Math.random() < 0.5 ? 2 : 4;
    }
    refreshTheme(arrMain);//刷新主题
    isEnd(arrMain);

}
/*
 * 向左
 * 1.构建基本数组模型
 *  →0  1  2  3
 *   ——————————
 *   4  5  6  7
 *   ——————————
 *   8  9  10 11
 *   ——————————
 *   12 13 14 15
 *   ——————————
 *   规则为[4*i+j]
 * */
function right(arrMain) {
    var row = [];
    var cflag = [false, false, false, false];
    //对于每列进行操作，
    for (var i = 0; i < 4; i++) {
        row = [arrMain[i * 4 + 3], arrMain[i * 4 + 2], arrMain[i * 4 + 1], arrMain[i * 4]];
        cflag[i] = arrayCR(row);

        //赋值
        for (var k = 0; k < 4; k++) {
            // locations[4 * i + k] = row[j];
            arrMain[3 + 4 * i - k] = row[k];
        }
    }

    if (cflag[0] || cflag[1] || cflag[2] || cflag[3]) {
        arrMain[createRanNum(arrMain)] = Math.random() < 0.5 ? 2 : 4;
    }
    refreshTheme(arrMain);//刷新主题
    isEnd(arrMain);
}
/*
* 建立一个类，
* 作用：
* 1.判断胜利条件，展示游戏胜利div
* 2.利用原型维护一个保存最大值的数组，通过新建类可以在不同作用域 增删改（cookie也可以）
* */
function getWin() {
    // var Win;
    // if(!Win){
    //     Win=new Win();
    // }
    return new Win();
}
function Win() {
}
Win.prototype = {
    maxNum: [0],
    max: function (num) {
        if (this.maxNum < num) {
            this.maxNum[0] = num;
        }
    },
    wins:function () {
        if (this.maxNum[0] == 1024) {
            this.maxNum[0]=0;
            // alert("你赢了");
            $("#div2048").empty().append($("<div></div>").addClass("end").text("你赢了，点击重新开始"));
        }
    }
};
Win.prototype.constructor=Win;


/*
 * 结束
 * */
function isEnd(arrMain) {
    // 判断是否结束
    if (arrMain.indexOf(0) == -1) {// 如果数组中不包含0
        if (isEndX(arrMain) && isEndY(arrMain)) {
           $("#div2048").empty().append($("<div></div>").addClass("end").text("游戏结束了，点击重新开始"));
        }
    }
}

function isEndX(arrMain) {
    // 判断横向的数组
    // 如果相邻位置的数不相同,就结束
    var f = [false, false, false, false];
    var w = [];
    for (var j = 0; j < 4; j++) {
        for (var i = 0; i < 4; i++) {
            w[i] = arrMain[4 * j + i];
        }
        // alert(w);
        f[j] = (w[0] != w[1] && w[1] != w[2] && w[2] != w[3]);// 如果为真,表示相邻的两个数不相等
        if (!f[j]) {
            break;
        }
    }

    return f[0] && f[1] && f[2] && f[3];
}

function isEndY(arrMain) {
    // 判断纵向的数组
    // 如果相邻位置的数不相同,就结束
    var f = [false, false, false, false];
    var w = [];
    for (var j = 0; j < 4; j++) {
        for (var i = 0; i < 4; i++) {
            w[i] = arrMain[4 * i + j];
        }
        // alert(w);
        f[j] = (w[0] != w[1] && w[1] != w[2] && w[2] != w[3]);// 如果为真,表示相邻的两个数不相等
        if (!f[j]) {
            break;
        }
    }
    return f[0] && f[1] && f[2] && f[3];
}





