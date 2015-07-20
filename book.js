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
            "id": id,
            "index": index,
            "parentId": parentId,
            "title": title
        };
        if (typeof(url) != "number") {
            newNode["url"] = url;
        };
        chrome.bookmarks.create(newNode, function() {
            console.log(id);
            node = chrome.bookmarks.get(a[i][0], function(node) {
                if (node != undefined) {
                    if (node[0]["url" == undefined]) {
                        chrome.bookmarks.removetree(a[i][0], function() {
                            console.log("tree removed: " + a[i][0]);
                        });
                    } else {
                        chrome.bookmarks.remove(a[i][0], function() {
                            console.log("leaf removed: " + a[i][0]);
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
            console.log(tree);

            treeJson = compareJson(tree);
            setStorage(boolTag, setStorageCallBack);
        });
};

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

//json to hash table
function startSync() {
    var bakTree = getStorage("newH");
    var newTree = getStorage("newN");
    if (newTree != null) {
        console.log("start sync..");
        unionHash(newTree, bakTree);
        var res = sortHash(newTree);
        sync(res);
    };
};


//start script
var treeJson = new Object;
var UID = "newN";
var boolTag = false;
var aList = {};
var count = 0;
document.addEventListener('DOMContentLoaded', function() {
    console.log("start..");
    //onload();
    startSync();


    // document.addEventListener("somethingAPI", function() {
    //     onload();
    // });
});
