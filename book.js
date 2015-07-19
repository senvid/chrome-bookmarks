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
    if (bakTree != null && curTree != null) {
        console.log("start sync..");
        var newList = compareJson(newTree);
        aList = [];
        var bakList = compareJson(bakTree);
        console.log(newList, "new");
        console.log(bakList, "bak");
    };
};

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
//use: l = Array.union(a,b)
Array.union = function(a, b) {
    return a.concat(b).unique();
}

//get intersect
//use l = a.intersect(b)
Array.prototype.intersect = function(a) {
    //{val:{num:1,str:2},...}
    var hash = {};
    var r = [];
    var type;
    var val;

    for (var i = 0; i < a.length; i++) {
        //{num:1,str:2}
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

//different set of the two list
function getDiff(a, b) {
    // body...
}

//get id from Array
function compareJson(a) {
    if (a.id != undefined) {
        if (a.url != undefined) {
            aList.push([a.id, a.index, a.parentId, a.title, a.url]);
        };
        if (a.children != undefined) {
            for (var i = 0; i < a.children.length; i++) {
                //aList.push(a.children[i].id);
                if (a.children[i].url != undefined) {
                    compareJson(a.children[i]);
                } else {
                    aList.push([a.children[i].id, a.children[i].index, a.children[i].parentId, a.children[i].title]);
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
var UID = "new";
var boolTag = false;
var aList = new Array();
var count = 0;
document.addEventListener('DOMContentLoaded', function() {
    console.log("start..");
    //onload();

    //getList();
    var c1 = [1, 5, 5, 5, 9, "5", "5", "", "1", "7"];
    var c2 = [1, 5, 5, 30, "5", ""];
    var c3 = [1, 5, ""];
    var c4 = [1, "5", ""];
    //console.log(c1.unique());
    //console.log(c2.unique());
    //console.log(c1.unique().intersect(c2.unique()));
    console.log(c4.intersect(c3));
    // document.addEventListener("somethingAPI", function() {
    //     onload();
    // });
});
