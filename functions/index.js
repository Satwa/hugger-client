const functions = require('firebase-functions')
const admin     = require('firebase-admin')

// admin.initializeApp()
// var serviceAccount = require("./project-hifive-firebase-adminsdk.json");

admin.initializeApp(/*{
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://project-hifive.firebaseio.com"
}*/)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.linkHuggerToNewHuggy = functions.firestore.document("/users/{userId}")
    .onCreate((snapshot, context) => {
        const newUser = snapshot.data()

        if(newUser.type == "hugger"){
            return
        }

        console.log(original)

        const maxchild = 3 // maximum huggy per hugger

        firestore
            .collection("users")
            .where("type", "=", "hugger") // pick huggers
            .where("authorized", "=", true) // pick huggers
            .get()
            .then((users) => {
                
                firestore
                .collection("chats")
                .get()
                .then((chats) => {
                    let huggers = [] // list of huggers' id with maxchild
                    let chat_ids = []

                    for(let chat of chats){ // list all chat ids
                        chat_ids.push(chat.id)
                    }

                    for (const user of users) { // list ids of all huggers
                        huggers.push({
                            uid: user.id,
                            appearance: chat_ids.filter($0 => $0.includes(user.id)).length
                        })
                        console.log(user.data())
                    }

                    huggers.sort((a, b) => a.appearance > b.appearance) // sort huggers to have the least handling one first

                    firestore
                        .collection("chats")
                        .doc([snapshot.id, hugger[0].uid].sort().join("_"))
                        .set({
                            created: Date.now(),
                            users: [snapshot.id, hugger[0].uid]
                        })
                })
                .catch(err => console.error(new Error(err)))
            })
            .catch(err => console.error(new Error(err)))

        // TODO: Also don't reach maxchild
    })