const friendsData = require("../data/friendsdata.js");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  app.get("/api/friends", function (req, res) {
    res.json(friendsData);
  });

  app.get("/api/friends/:friendName", function (req, res) {
    let chosen = req.params.friendName;

    console.log(chosen);

    for (let i = 0; i < friendsData.length; i++) {
      if (chosen === friendsData[i].name) {
        return res.json(friendsData[i]);
      }
    }
    return res.json(false);
  });

  app.post("/api/friends", function (req, res) {
    newFriend = req.body;
    newFriendScore = newFriend.scores;
    friendsData.push(newFriend)
    res.json(newFriend);
  });


  app.get("/api/friends/match/:friendName", function (req, res) {
    let chosen = req.params.friendName;
    let difference;
    let endResultList = [];

    const result = friendsData.map(item => item.name)
      .filter((value, index, self) => self.indexOf(chosen) !== index)

    result.forEach(item => {
      friendsData.forEach(existingItem => {
        if (existingItem.name === item) {
          difference = newFriend.scores.map(function (itemNew, index) {
            return Math.abs(itemNew - existingItem.scores[index]);
          });
          let totalDiff = difference.reduce((total, num) => total + parseInt(num))
          endResultList.push({
            name: existingItem.name,
            photo: existingItem.photo,
            diffScore: totalDiff
          });
        }
      });
    })

    const value = Math.min(...endResultList.map(item => item.diffScore))
    const indexedValue = endResultList.findIndex(element => element.diffScore === value)
    const newResults = {
      name: endResultList[indexedValue].name,
      photo: endResultList[indexedValue].photo,
      diff: endResultList[indexedValue].diffScore,
    }
    res.json(newResults);
  });




  app.post("/api/clear", function (req, res) {
    friendsData.length = 0;
    res.json({ ok: true });
  });
};
