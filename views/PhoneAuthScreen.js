import React from 'react'
import { View, Button, Text, TextInput, Alert } from 'react-native'
import firebase from 'react-native-firebase'
import AsyncStorage from '@react-native-community/async-storage'

// Copied from https://rnfirebase.io/docs/v5.x.x/auth/phone-auth
export default class PhoneAuthScreen extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            user: null,
            message: '',
            codeInput: '',
            phoneNumber: '+33',
            confirmResult: null,
        }
    }
    // TODO: remplacer les setState message par une Alert

    /*
        * Entrer numéro de téléphone
        * Entrer code
            * Numéro existe ?
                * Connecter et amener à AppStack
            * Numéro inexistant et vient du process de connexion ?
                * Récupérer l'id
                * Créer une nouvelle entrée en db (avec toutes les infos ++++ le token de l'appareil pour les notifications +++ si parrain: "verified": false)
                * Upload les infos + les fichiers si parrain
                * Si élève : rediriger vers l'app et annoncer "Nous recherchons actuellement un parrain pour toi" (+ soit alerter l'équipe manuellement soit écrire une Cloud Function qui s'éxecute à chaque nouvel inscrit)
                * Si parrain : rediriger vers profil et timeline, sur Discussion afficher un message "En cours de validation par l'équipe Hugger"
            * Numéro inexistant et vient du "Déjà inscrit ?"
                * Alert + rediriger au process de connexion      
    */

    
    signIn = () => {
        const { phoneNumber } = this.state;
        this.setState({ message: 'Envoi du code en cours ...' });

        firebase.auth().signInWithPhoneNumber(phoneNumber)
            .then(confirmResult => this.setState({ confirmResult, message: 'Le code a été envoyé' }))
            .catch(error => this.setState({ message: `Erreur de connexion : ${error.message}` }));
    }

    confirmCode = async () => {
        const { codeInput, confirmResult } = this.state

        if (confirmResult && codeInput.length) {
            try{
                const user = await confirmResult.confirm(codeInput)
                this.setState({ message: 'Code confirmé !', user: user })
                // TODO: Activity Indicator


                const userExists = await global.SolidAPI.userExists(user.uid)
                const userVariables = this.props.navigation.getParam("data")

                if (!userExists && !this.props.navigation.getParam("shouldAccountExist")){
                    // no user found and account shouldn't exist (= create user, import pictures if hugger)
                    console.log("if l67")

                    global.SolidAPI.userSignUp({
                        authID: user.uid,
                        name: userVariables.lastname ? userVariables.name + " " + userVariables.lastname : userVariables.name,
                        type: userVariables.userType,
                        picture: "",
                        sex: userVariables.sex,
                        birthdate: userVariables.birthdate,
                        story: userVariables.story ? userVariables.story : userVariables.eventType.map($0 => $0.slug).join(", "),
                        authorized: userVariables.userType == "hugger" ? false : true
                    })
                    
                    let idCardRectoPromise  = true,
                        idCardVersoPromise  = true,
                        idCardSelfiePromise = true

                    if(userVariables.userType == "hugger"){
                        if(userVariables.idCardRecto){
                            idCardRectoPromise = firebase
                                .storage()
                                .ref(`identities/${user.uid}/idCardRecto`)
                                .putFile(userVariables.idCardRecto)
                        }
                        if (userVariables.idCardVerso){
                            idCardVersoPromise = firebase
                                .storage()
                                .ref(`identities/${user.uid}/idCardVerso`)
                                .putFile(userVariables.idCardVerso)
                        }
                        
                        if(userVariables.idCardSelfie){
                            idCardSelfiePromise = firebase
                                .storage()
                                .ref(`identities/${user.uid}/idCardSelfie`)
                                .putFile(userVariables.idCardSelfie)
                        }
                    }

                    // AsyncStorage: save token
                    const userData = {
                        uid: user.uid,
                        name: userVariables.lastname ? userVariables.name + " " + userVariables.lastname : userVariables.name,
                        type: userVariables.userType,
                        sex: userVariables.sex,
                        birthdate: userVariables.birthdate,
                        story: userVariables.story ? userVariables.story : userVariables.eventType.map($0 => $0.slug).join(", ")
                    }

                    AsyncStorage.setItem("user", JSON.stringify(userData))

                    // Navigate to app
                    Promise.all([idCardRectoPromise, idCardVersoPromise, idCardSelfiePromise]) // TODO: Loading
                        .then((done) => {
                            this.props.navigation.navigate('App')
                        })
                }else if(!userExists && this.props.navigation.getParam("shouldAccountExist")){
                    // user doesn't exist but should (= missclick and should follow sign up process first)
                    Alert.alert(
                        'Erreur',
                        "Ton compte n'existe pas ! Essaie de passer par l'inscription avant.",
                        [
                            { text: 'OK', onPress: () => { this.props.navigation.navigate('PickProfile') } },
                        ],
                        { cancelable: false },
                    )
                }else{
                    // user exists and should so we just download their data and save in AsyncStorage
                        // OR
                    // user in database but shouldn't exist (= don't update user)

                    const fetchedUser = await global.SolidAPI.user()

                    // AsyncStorage: save token
                    const userData = {
                        uid: user.uid,
                        name: fetchedUser.name,
                        type: fetchedUser.type,
                        sex: fetchedUser.sex,
                        birthdate: fetchedUser.birthdate,
                        story: fetchedUser.story
                    }
                    console.log(userData)

                    AsyncStorage.setItem("user", JSON.stringify(userData))

                    // Navigate to app
                    this.props.navigation.navigate('App')
                }
            }catch(error) {
                this.setState({ message: `Erreur de vérification : ${error.message}` })
                console.log(error)
            }
        }
    }

    renderPhoneNumberInput() {
        const { phoneNumber } = this.state;

        return (
            <View style={{ padding: 25 }}>
                <Text>Numéro de téléphone</Text>
                <TextInput
                    autoFocus
                    style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                    onChangeText={value => this.setState({ phoneNumber: value })}
                    placeholder={'Numéro de téléphone '}
                    value={phoneNumber}
                    color="#000"
                />
                <Button title="Connexion" onPress={this.signIn} />
            </View>
        );
    }

    renderVerificationCodeInput() {
        const { codeInput } = this.state;

        return (
            <View style={{ marginTop: 25, padding: 25 }}>
                <Text>Entre ton code de vérification :</Text>
                <TextInput
                    autoFocus
                    style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                    onChangeText={value => this.setState({ codeInput: value })}
                    placeholder={'Code ... '}
                    value={codeInput}
                    color="#000"
                />
                <Button title="Valider le code" onPress={this.confirmCode} />
            </View>
        );
    }

    render() {
        const { user, confirmResult } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {!confirmResult && this.renderPhoneNumberInput()}

                {confirmResult && this.renderVerificationCodeInput()}

                {user && (
                    <View
                        style={{
                            padding: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <Text style={{ fontSize: 25 }}>Signed In!</Text>
                        <Text>{JSON.stringify(user)}</Text>
                        <Button title="Déconnexion" color="red" onPress={this.signOut} />
                    </View>
                )}
            </View>
        );
    }
}