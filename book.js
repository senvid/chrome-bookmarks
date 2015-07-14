
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
            console.log(tree);
            treeNodes(tree);
        });
};

function treeNodes(tree) {
    for (var i = 0; i < tree.length; i++) {
        subNodes(tree[i]);
    };
}


function subNodes(treeObj) {
    treeJson = {
        children: treeObj.children,
        dateAdded: treeObj.dateAdded,
        dateGroupModified: treeObj.dateGroupModified,
        id: treeObj.id,
        index: treeObj.index,
        parentId: treeObj.parentId,
        title: treeObj.title,
        url: treeObj.url
    };
    return treeJson
}

//first run
function onload() {
    if (getStorage() != null) {
        console.log(JSON.parse(getStorage()));
    } else {
        console.log("start parseTree...");
        parseTree();
        setStorage();

        //console.log(JSON.parse(localStorage.getItem(UID)));
    };
}

//set localStorage
function setStorage() {
    localStorage.setItem(UID, JSON.stringify(treeJson));
}

//get localStorage
function getStorage() {
    return localStorage.getItem(UID);
}

//clear local data
function onclear() {
    localStorage.clear();
}

// function getDiff() {
//     var onTree = parseTree();
//     var bakTree =
// }

//start script
var treeJson = new Object;
var UID = "sun";
document.addEventListener('DOMContentLoaded', function() {
    console.log("start..");

    onload();
    // document.addEventListener("somethingAPI", function() {
    //     onload();
    // });
    console.log("---------------");
});
