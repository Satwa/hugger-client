const functions = require('firebase-functions')
const admin     = require('firebase-admin')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.linkHuggerToNewHuggy = functions.database.ref("/users/{userId}")
    .onCreate((snapshot, context) => {
        const original = snapshot.val()

        console.log(orignal)
    })