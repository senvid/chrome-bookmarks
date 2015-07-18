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
Array.prototype.unique = function() {
    var n = {},
        r = [],
        len = this.length,
        val, type;
    for (var i = 0; i < this.length; i++) {
        val = this[i];
        type = typeof val;
        if (!n[val]) {
            n[val] = [type];
            r.push(val);
        } else if (n[val].indexOf(type) < 0) {
            n[val].push(type);
            r.push(val);
        }
    }
    return r;
}

//different of the two list
function getDiff(a, b) {
    // body...
}


/*
function compareJson(a, b) {
 
    var aProp = Object.getOwnPropertyNames(a);
    var bProp = Object.getOwnPropertyNames(b);
    var arr = new Array([]);
    console.log(aProp);
    // if (aProp != bProp) {
    //     return a;
    // }
    for (var i = 0; i < aProp.length; i++) {
        var aList = aProp[i];
        var bList = bProp[i];
        if (aList == "children" || a[aList] == b[bList]) {
            continue;
        };
        // console.log(typeof(s));
        // console.log(typeof(a[s]));
    };
    if (a.children) {
        console.log(a.children.length);
        for (var i = 0; i < a.children.length; i++) {
            if (b.children) {
                compareJson(a.children[i], b.children[i]);
            };
            console.log(a.id, a.index, a.parentId, a.title, a.url)
        };
    };

    // if (a.id != b.id) {
    //     return a;
    // }
    // if (a.title != b.title) {
    //     return a;
    // }

    // if (typeof(a.index) != "undefined" && typeof(b.index) != "undefined") {
    //     if (a.index != b.index) {
    //         return a;
    //     }
    // }

    // if (typeof(a.url) != "undefined" && typeof(b.url) != "undefined") {
    //     if (a.url != b.url) {
    //         return a;
    //     }
    // } else {
    //     if (a.children.length != b.children.length) {
    //         return a;
    //     }
    //     for (var i = 0; i < a.children.length; i++) {
    //         compareJson(a.children[i], b.children[i]);
    //     }
    // }
}
*/

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

    getList();

    // document.addEventListener("somethingAPI", function() {
    //     onload();
    // });
});
