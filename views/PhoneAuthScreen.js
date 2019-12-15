import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image } from 'react-native';

import firebase from 'react-native-firebase';

// Copied from https://rnfirebase.io/docs/v5.x.x/auth/phone-auth
export default class PhoneAuthScreen extends Component {
    constructor(props) {
        super(props)
        
        this.unsubscribe = null

        this.state = {
            user: null,
            message: '',
            codeInput: '',
            phoneNumber: '+33',
            confirmResult: null,
        }
    }

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user.toJSON() })
            } else {
                // User has been signed out, reset the state
                this.setState({
                    user: null,
                    message: '',
                    codeInput: '',
                    phoneNumber: '+33',
                    confirmResult: null,
                })
            }
        })
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe()
    }

    signIn = () => {
        const { phoneNumber } = this.state;
        this.setState({ message: 'Envoi du code en cours ...' });

        firebase.auth().signInWithPhoneNumber(phoneNumber)
            .then(confirmResult => this.setState({ confirmResult, message: 'Le code a été envoyé' }))
            .catch(error => this.setState({ message: `Erreur de connexion : ${error.message}` }));
    };

    confirmCode = () => {
        const { codeInput, confirmResult } = this.state;

        if (confirmResult && codeInput.length) {
            confirmResult.confirm(codeInput)
                .then((user) => {
                    this.setState({ message: 'Code confirmé !' });
                })
                .catch(error => this.setState({ message: `Erreur de vérification : ${error.message}` }));
        }
    };

    signOut = () => {
        firebase.auth().signOut();
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
                />
                <Button title="Connexion" color="green" onPress={this.signIn} />
            </View>
        );
    }

    renderMessage() {
        const { message } = this.state;

        if (!message.length) return null;

        return (
            <Text style={{ padding: 5, color: '#ccc' }}>{message}</Text>
        );
    }

    renderVerificationCodeInput() {
        const { codeInput } = this.state;

        return (
            <View style={{ marginTop: 25, padding: 25 }}>
                <Text>Enter verification code below:</Text>
                <TextInput
                    autoFocus
                    style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                    onChangeText={value => this.setState({ codeInput: value })}
                    placeholder={'Code ... '}
                    value={codeInput}
                />
                <Button title="Valider le code" color="#841584" onPress={this.confirmCode} />
            </View>
        );
    }

    render() {
        const { user, confirmResult } = this.state;
        return (
            <View style={{ flex: 1 }}>

                {!user && !confirmResult && this.renderPhoneNumberInput()}

                {this.renderMessage()}

                {!user && confirmResult && this.renderVerificationCodeInput()}

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