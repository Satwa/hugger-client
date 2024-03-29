export default class SolidAPIService {
    constructor(userToken){
        this.token = userToken
        this.ROOT = global.SERVER_URL
    }

    // USER RELATED
    userExists = async (id) => {
        try {
            const req = await fetch(`${this.ROOT}/user/exists/${id}`, {
                // method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                // body: JSON.stringify({
                //     uid: id
                // })
            })
            
            const res = await req.json()

            return !res.error ? res[id] : false
        }catch(err) {
            console.error(err)
            return false
        }
    }

    userSignUp = async (data) => {
        try {
            const req = await fetch(`${this.ROOT}/user`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(data)
            })

            const res = await req.json()

            return !!res.error // TODO: Return saved data instead of true/false || return error
        }catch(err) {
            console.error(err)
            return false
        }
    }

    user = async (id = null) => {
        try{
            const req = await fetch(`${this.ROOT}/user/` + (id ? id : `me`), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }  
            })
            const res = await req.json()

            return res
        } catch (err) {
            console.error(err)
            return false
        }
    }

}