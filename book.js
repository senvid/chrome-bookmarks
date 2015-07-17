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

function getDiff() {
    var curTree = getStorage("cur");
    var bakTree = getStorage("old");
    var newTree = getStorage("new");
    if (bakTree != null && curTree != null) {
        console.log("start sync..");
        //compareJson(bakTree);
        //compareJson(curTree);
        compareJson(newTree);
    };
};

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
    // for (var item in a) {
    //     console.log(item);
    // };
    // console.log(count);
    // count++;
    // //console.log(a);
    // compareJson(a[0]);
    //a = [{x:[{v:[],b,b},{}],a,b}] array
    //a[0] outside {} obj    //id =0 root
    //a[0].attr    arrt      //id=1  bookmark bar  id=2 other bar
    //children  array
    //a[0].children   obj [bookmark othr bar]
    //a[0].children.children[0] [bookmark .. ] obj
    //a[0].children[0].children[0] [bookmark .. ] sub obj
    //a[0].children.children[1] [other bar.. ]
    //a[0].children.children[0][0]   bookmark sub obj
    //a[0].children.children[0][0].children   bookmark sub sub array
    //a[0].children.children[0][0].children[0]   bookmark sub sub abj
    // console.log(a);
    // console.log(a[0]);
    // console.log(a[0].children[1].id);
    // console.log(a[0].children[4]);
    // console.log(a[0].children[4].children);
    // console.log(a[0].children[4].children[0]);
    if (a.id != undefined) {
        aList.push(a.id);
        //console.log(Object.getOwnPropertyNames(a));
        //console.log(a.children);
        if (a.children) {
            for (var i = 0; i < a.children.length; i++) {
                aList.push(a.children[i].id);
                compareJson(a.children[i]);
            };
        } else {};

    } else {
        compareJson(a[0]);
    };

    // if (length in a) {
    //     console.log("yes : " + a.length);
    //     for (var i = 0; i < a.length; i++) {
    //         var id = a.id;
    //         if (id != "0" && id != undefined) {
    //             aList.push(id)
    //         };
    //     };
    // };
    // console.log(aList);

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

    getDiff();
    console.log(aList);
    // document.addEventListener("somethingAPI", function() {
    //     onload();
    // });
});
