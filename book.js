// function loadXMLDoc(url) {
//     r = new XMLHttpRequest();
//     r.onreadystatechange = state_Change;
//     r.open("GET", url, true);
//     r.send(null);
// }

// function state_Change() {
//     if (r.readyState == 4) {
//         if (r.status == 200) {
//             var photos = r.responseXML.getElementsByTagName("img");
//             console.log(photos);
//             for (var i = 0; i < photos.length; i++) {
//                 var photo = photos[i]
//                 var src = "http://192.168.20.10:8888" + photo.getAttribute("src")
//                 console.log(src);
//                 var img = document.createElement("img");
//                 img.src = src;
//                 console.log(img.src);
//                 document.body.appendChild(img);
//             }
//         } else {
//             alert("Problem retrieving XML data");
//         }
//     }
// }


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
function compare(x, y) {
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
    r.sort(compare);
    return r;
}

//union two hash table
function unionHash(a, b) {
    for (var key in b) {
        a[key] = b[key];
    };
    return a;
}

//sync 
function sync(a) {
    // var s = [
    //     [1, 2, 3],
    //     [3, 2, 5],
    //     [5, 6, 1],
    //     [2, 4, 1],
    //     [2, 3, 2]
    // ];
    for (var i in a) {
        var id = i[0];
        var index = i[1];
        var parentId = i[2];
        var title = i[3];
        var url = i[4];
        var newNode = {
            "id": id,
            "index": index,
            "parentId": parentId,
            "title": title
        };
        if (typeof(url) != "number") {
            newNode["url"] = url;
        };
        chrome.bookmarks.create(newNode, function(id) {
            console.log("created : " + id);
            node = chrome.bookmarks.get(a[0], function(node) {
                if (node != undefined) {
                    if (node[0]["url" == undefined]) {
                        chrome.bookmarks.removetree(a[0], function(a[0]) {
                            console.log("tree removed: " + a[0]);
                        });
                    } else {
                        chrome.bookmarks.remove(a[0], function(a[0]) {
                            console.log("leaf removed: " + a[0]);
                        });
                    };
                };
            });
        });
    };
}

//get tree
function parseTree() {
    var tree = chrome.bookmarks.getTree(
        function(tree) {
            treeJson = tree;
            setStorage(boolTag, setStorageCallBack);
        });
};

//first run
function onload() {
    if (getStorage(UID) != null) {
        console.log("get localStorage..")
    } else {
        boolTag = true;
        parseTree();
    };
}

//set localStorage
function setStorage(boolTag, call) {
    //if true call setStorage
    if (!boolTag) {
        console.log("DO not need to set Storage...");
        return
    };
    console.log("start set Storage");
    localStorage.setItem(UID, JSON.stringify(treeJson));
    call();
}

function setStorageCallBack() {
    boolTag = false;
}

//set tag as false
function setFalse() {
    boolTag = false;
}

//get localStorage
function getStorage(UID) {
    return JSON.parse(localStorage.getItem(UID));
}

//clear local data
function onclear() {
    localStorage.clear();
}

//json to list
function getList() {
    var curTree = getStorage("cur");
    var bakTree = getStorage("bak");
    var newTree = getStorage("new");
    if (newTree != null) {
        console.log("start sync..");
        var newList = compareJson(newTree);
        console.log(newList, "new");
    };
};


//different set of the two list
function getDiff(a, b) {
    //
}

//get id from Array
function compareJson(a) {
    if (a.id != undefined) {
        if (a.url != undefined) {
            aList[a.dateAdded] = [a.id, a.index, a.parentId, a.title, a.url];
        };
        if (a.children != undefined) {
            for (var i = 0; i < a.children.length; i++) {
                //aList.push(a.children[i].id);
                if (a.children[i].url != undefined) {
                    compareJson(a.children[i]);
                } else {
                    aList[a.children[i].dateAdded] = [a.children[i].id, a.children[i].index,
                        a.children[i].parentId, a.children[i].title,
                        a.children[i].dateGroupModified
                    ];
                    compareJson(a.children[i]);
                };
            };
        };
    } else {
        compareJson(a[0]);
    };
    return aList
}

//start script
var treeJson = new Object;
var UID = "newH";
var boolTag = false;
var aList = {};
var count = 0;
document.addEventListener('DOMContentLoaded', function() {
    console.log("start..");
    //onload();

    getList();
    chrome.bookmarks.remove("10");

    // document.addEventListener("somethingAPI", function() {
    //     onload();
    // });
});
