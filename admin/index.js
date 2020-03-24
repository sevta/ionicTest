const admin = require("firebase-admin");
const serviceAccount = require("./ionictest-8fd6f-17303661c4bc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ionictest-8fd6f.firebaseio.com"
});

function deleteUser(uid) {
  admin
    .auth()
    .deleteUser(uid)
    .then(() => console.log("success delete user", uid))
    .catch(err => console.log(err));
}

admin
  .auth()
  .listUsers(100)
  .then(result => {
    result.users.forEach(user => {
      let uid = user.toJSON().uid;
      deleteUser(uid);
    });
  })
  .catch(err => console.log(err));
