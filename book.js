//prototype method unique
//use: myArray.unique()
Array.prototype.unique = function() {
    var hash = {};
    var r = [];
    var val;
    var type;
    for (var i = 0; i < this.length; i++) {
        val = this[i];
        type = typeof val;
        if (!hash[val]) {
            hash[val] = [type];
            r.push(val);
        } else if (hash[val].indexOf(type) < 0) {
            hash[val].push(type);
            r.push(val);
        }
    }
    return r;
}

//union no repeat
//use: l = myArray.union(a)
Array.prototype.union = function(a) {
    return this.concat(a).unique();
}

//get intersect
//use: l = a.intersect(b)
Array.prototype.intersect = function(a) {
    //hash:{val:{num:1,str:2},...}
    var hash = {};
    var r = [];
    var type;
    var val;
    for (var i = 0; i < a.length; i++) {
        //h:{number:1,string:2,...}
        var h = {};
        val = a[i];
        type = typeof val;
        if (!hash[val]) {
            h[type] = 1;
            hash[val] = h;
        } else {
            if (!hash[val][type]) {
                hash[val][type] = 1;
            } else {
                hash[val][type]++;
            };
        };
    };
    for (var i = 0; i < this.length; i++) {
        type = typeof this[i];
        if (hash[this[i]] && hash[this[i]][type] > 0) {
            hash[this[i]][type]--;
            r.push(this[i]);
        };
    };
    return r;
}

// get complement
//use: l=a.complement(b)
Array.prototype.complement = function(a) {
    for (var i = 0; i < this.length; i++) {
        var n = a.indexOf(this[i]);
        if (n != -1) {
            a.splice(n, 1);
        };
    };
    return a;
}

//array sort method
function sortBy(x, y) {
    if (x[2] == y[2]) {
        return x[1] - y[1];
    } else {
        return x[2] - y[2];
    };
}

//hash table sort function
function sortHash(a) {
    var r = [];
    var i = 0;
    for (var item in a) {
        r[i] = a[item];
        i++;
    };
    r.sort(sortBy);
    console.log(r + "sortHash");
    return r;
}

//union two hash table
function unionHash(a, b) {
    for (var key in b) {
        a[key] = b[key];
    };
    return a;
}

//sync method
function sync(a) {
    for (var i in a) {
        var id = a[i][0];
        if (id == "1" || id == "2") continue;
        var index = a[i][1];
        var parentId = a[i][2];
        var title = a[i][3];
        var url = a[i][4];
        var newNode = {
            "index": index,
            "parentId": parentId,
            "title": title
        };
        if (typeof(url) != "number") {
            newNode["url"] = url;
        };
        //1.get id----get(id callback)
        //A no id exist---create(node,callback)
        //B.id exist---update(id,change obj)
        node = chrome.bookmarks.get(id, function(node) {
            if (node != undefined) {
                //folder
                if (node[0]["url"] == undefined) {
                    chrome.bookmarks.removeTree(id, function() {
                        console.log("removeTree : " + id);
                    });
                } else {
                    //url
                    chrome.bookmarks.remove(id, function() {
                        console.log("remove : " + id);
                    });
                };
            };
            chrome.bookmarks.create(newNode, function() {
                console.log("created : " + id);
            });
        });
    };
}



// //get id from Array
// function compareJson(a) {
//     if (a.id != undefined) {
//         if (a.url != undefined) {
//             aList[a.dateAdded] = [a.id, a.index, a.parentId, a.title, a.url];
//         };
//         if (a.children != undefined) {
//             for (var i = 0; i < a.children.length; i++) {
//                 if (a.children[i].url != undefined) {
//                     compareJson(a.children[i]);
//                 } else {
//                     if (a.children[i].id != "1" || a.children[i].id != "2") {
//                         aList[a.children[i].dateAdded] = [a.children[i].id, a.children[i].index,
//                             a.children[i].parentId, a.children[i].title,
//                             a.children[i].dateGroupModified
//                         ];
//                     };
//                     compareJson(a.children[i]);
//                 };
//             };
//         };
//     } else {
//         compareJson(a[0]);
//     };
//     return aList
// }


//set localStorage
function setStorage(UID, data, call) {
    console.log("start set Storage : " + UID);
    localStorage.setItem(UID, JSON.stringify(data));
    if (call) {
        console.log("data saved..start callback..");
        call(UID);
        console.log("callback end ..");
    };
}

//get localStorage
function getStorage(UID) {
    return JSON.parse(localStorage.getItem(UID));
}

//remove Item
function removeItem(item) {
    localStorage.removeItem(item);
}

//clear local data
function onclear() {
    localStorage.clear();
}

//json to hash table
function mergerSync(UID) {
    var rtm = getStorage("old");
    var local = getStorage(UID);

    console.log("start merger ..");
    var localList = local[0]["children"][0]["children"];
    localList = localList.concat(local[0]["children"][1]["children"]);
    var rtmList = rtm[0]["children"][0]["children"];
    rtmList = rtmList.concat(rtm[0]["children"][1]["children"]);
    var tag = getList(localList);
    mergerBookMarks(tag, localList, rtmList);
}

//
function getList(a) {
    var tag = [];
    var t;
    for (var i = 0; i < a.length; i++) {
        if (a[i].url) {
            t = a[i].url;
        } else {
            t = a[i].title;
        };
        tag[tag.length] = t;
    };
    return tag;
}

//merger logic
function mergerBookMarks(curList, cur, bak) {
    var titleUrl;
    for (var i = 0; i < bak.length; i++) {
        var b = bak[i];
        if (b.url) {
            titleUrl = b.url;
        } else {
            titleUrl = b.title;
        };
        var indexCur = curList.indexOf(titleUrl);
        if (indexCur == -1) {
            processBookMarks(b);
            //folder existed--megre folder
        } else if (indexCur != -1 && b.url == undefined) {
            var pId = cur[indexCur].id;
            var tag = getList(cur[indexCur].children);

            for (var j = 0; j < b.children.length; j++) {
                b.children[j].parentId = pId;
            };
            mergerBookMarks(tag, cur[indexCur].children, b.children);
        };
    };
}

//process ..create
function processBookMarks(node) {
    if (node["url"]) {
        //delete ingron attribute
        delete node["dateAdded"];
        delete node["id"];
        //delete node["index"];
        chrome.bookmarks.create(node, function() {
            console.log("create url: " + node["url"]);
        });
    } else {
        delete node["dateAdded"];
        delete node["id"];
        //delete node["index"];
        var saveNode = node["children"];
        console.log(saveNode);
        delete node["children"];
        delete node["dateGroupModified"];
        var folder = chrome.bookmarks.create(node,
            function(folder) {
                console.log("create folder: " + node["title"]);
                //change sub node parentId
                var pId = folder.id;
                for (var j = 0; j < saveNode.length; j++) {
                    saveNode[j].parentId = pId;
                    processBookMarks(saveNode[j]);
                };
            });
    };
}

//cover sync
function coverSync(UID) {
    var rtm = getStorage("old");
    var local = getStorage(UID);

    console.log(local);
    console.log("start cover ..");

    var cur = local[0]["children"][0]["children"];
    cur = cur.concat(local[0]["children"][1]["children"]);
    var bak = rtm[0]["children"][0]["children"];
    bak = bak.concat(rtm[0]["children"][1]["children"]);

    var curList = getList(cur);
    var bakList = getList(bak);

    coverBookMarks(bakList, bak, cur);
    mergerBookMarks(curList, cur, bak);

}

//cover logic
function coverBookMarks(bakList, bak, cur) {
    var titleUrl;
    for (var i = 0; i < cur.length; i++) {
        var c = cur[i];
        if (c.url) {
            titleUrl = c.url;
        } else {
            titleUrl = c.title;
        };
        var indexBak = bakList.indexOf(titleUrl);
        if (indexBak == -1) {
            if (c.url) {
                try {
                    chrome.bookmarks.remove(String(c.id),
                        function() {
                            console.log("node removed " + c.id);
                        });
                } catch (err) {
                    console.log(err.message);
                };
            } else if (c.children) {
                try {
                    chrome.bookmarks.removeTree(String(c.id),
                        function() {
                            console.log("tree removed " + c.id);
                        });
                } catch (err) {
                    console.log(err.message);
                };
            };
        } else if (indexBak != -1 && c.url == undefined) {
            var childTag = getList(bak[indexBak].children);
            coverBookMarks(childTag, bak[indexBak].children, c.children);
        };
    };
}

function test() {
    console.log("running..");
}


// document.addEventListener('DOMContentLoaded', function() {
//     console.log("start..");
//     //onload();
//     //coverSync();
// });
console.log("start..");

$(document).ready(function() {

    $("#CoverStart").click(function() {
        var d = new Date();
        var UID = d.getTime();
        console.log(UID);
        console.log("coverSync start..")
        var tree = chrome.bookmarks.getTree(function(tree) {
            setStorage(UID, tree, coverSync);
        });
        console.log("coverSync end.");
    })

    $("#MergerStart").click(function() {
        var d = new Date();
        var UID = d.getTime();
        console.log(UID);
        console.log("mergerSync start.");
        UID = d.getTime();
        var tree = chrome.bookmarks.getTree(function(tree) {
            setStorage(UID, tree, mergerSync);
        });
        console.log("mergerSync end.");
    })

    $("#upload").click(function() {
        function msg(UID) {
            console.log(UID + " data saved..");
        }
        var UID = "old";
        console.log("start upload..");
        var tree = chrome.bookmarks.getTree(function(tree) {
            setStorage(UID, tree, msg);
        });
    })
})
