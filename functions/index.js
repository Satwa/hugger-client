const functions = require('firebase-functions')
const admin     = require('firebase-admin')

admin.initializeApp()

exports.linkHuggerToNewHuggy = functions.firestore.document("/users/{userId}")
    .onCreate((snapshot, context) => {
        const firestore = admin.firestore()
        const newUser = snapshot.data()

        if(newUser.type == "hugger"){
            return
        }

        const maxchild = 3 // maximum huggy per hugger

        firestore
            .collection("users")
            .where("type", "==", "hugger") // pick huggers
            .where("authorized", "==", true) // pick huggers
            .get()
            .then((users) => {
                firestore
                    .collection("chats")
                    .where("created", ">", 0)
                    .get()
                    .then((chats) => {
                        let huggers = [] // list of huggers' id with maxchild
                        let chat_ids = []

                        for(const chat of chats.docs){ // list all chat ids
                            chat_ids.push(chat.id)
                        }

                        for (const user of users.docs) { // list ids of all huggers
                            huggers.push({
                                uid: user.id,
                                appearance: chat_ids.filter($0 => $0.includes(user.id)).length
                            })
                        }

                        huggers.sort((a, b) => a.appearance > b.appearance) // sort huggers to have the least handling one first

                        firestore
                            .collection("chats")
                            .doc([context.params.userId, huggers[0].uid].sort().join("_"))
                            .set({
                                created: Date.now(),
                                users: [context.params.userId, huggers[0].uid]
                            })
                    })
                    .catch(err => console.error(new Error(err)))
            })
            .catch(err => console.error(new Error(err)))

        // TODO: Also don't reach maxchild
    })