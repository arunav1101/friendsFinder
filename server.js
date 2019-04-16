// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
const PORT = process.env.PORT || 3000;

let newFriend;

// Sets up the Express app to handle data parsing
// app.use(express.urlencoded({
//   extended: true
// }));
app.use(express.json());

let newFriendScore = [];
let friend = [{
        name: "Ahmed",
        photo: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/6/005/064/1bd/3435aa3.jpg",
        scores: [
            5,
            1,
            4,
            4,
            5,
            1,
            2,
            5,
            4,
            1
        ]
    },
    {
        name: "zoya",
        photo: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/6/005/064/1bd/3435aa3.jpg",
        scores: [
            2,
            3,
            4,
            2,
            1,
            4,
            5,
            3,
            2,
            3
        ]
    }
];


// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/survey", function (req, res) {
    res.sendFile(path.join(__dirname, "survey.html"));
});

app.get("/api/friends/:friendName", function (req, res) {
    var chosen = req.params.friendName;

    console.log(chosen);

    for (var i = 0; i < friend.length; i++) {
        if (chosen === friend[i].name) {
            return res.json(friend[i]);
        }
    }

    return res.json(false);
});

app.post("/api/friends", function (req, res) {

    console.log("Post Called")
    console.log('request', req.body);
    newFriend = req.body;
    newFriendScore = newFriend.scores;
    friend.push(newFriend)
    res.json(newFriend);
});

app.get("/api/friends", function (req, res) {

    res.json(friend);
});


app.get("/api/friends/match/:friendName", function (req, res) {
    var chosen = req.params.friendName;
    let difference;
    let endResultList = [];

    const result = friend.map(item => item.name)
        .filter((value, index, self) => self.indexOf(chosen) !== index)

    result.forEach(item => {
        friend.forEach(existingItem => {
            if (existingItem.name.includes(item)) {
                // console.log(existingItem)

                difference = newFriend.scores.map(function (itemNew, index) {
                    return Math.abs(itemNew - existingItem.scores[index]);
                });
                let totalDiff = difference.reduce((total, num) => total + parseInt(num))

                endResultList.push({
                    name: existingItem.name,
                    photo: existingItem.photo,
                    diffScore: totalDiff
                })

            }
        })
    })


    const value = Math.min(...endResultList.map(item => item.diffScore))

    console.log(endResultList[endResultList.findIndex(element => element.diffScore === value)].name, endResultList[endResultList.findIndex(element => element.diffScore === value)].photo)

    const indexedValue = endResultList.findIndex(element => element.diffScore === value)

    console.log(endResultList[indexedValue].photo)
    const newResults = {
        name: endResultList[indexedValue].name,
        photo: endResultList[indexedValue].photo
    }
    console.log(newResults)
    res.json(newResults);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});