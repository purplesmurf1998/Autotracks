export default {
    async login(context, payload) {
        // login user and set user in the store
        const response = await fetch('http://localhost:5000/api/v1/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: payload.email,
                password: payload.password
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.log(responseData);
            return {
                success: false,
                message: responseData.message || 'Failed to authenticate.'
            };
        }

        const data = {
            token: responseData.token,
            userId: responseData.payload._id,
            userPermissions: responseData.payload.permissions,
            promptPasswordChange: responseData.payload.promptPasswordChange
        }

        // set the token in the local storage
        localStorage.setItem('autotracksAuthToken', data.token);
        // set the data in the store's state
        context.commit('setUser', data);
        return { success: true };
    },
    logout(context) {
        // set the user data to null values and loggedIn to false
        const data = {
            token: null,
            userId: null,
            userPermissions: [],
            promptPasswordChange: false
        };
        // clear the token from the local storage
        localStorage.clear('autotracksAuthToken');

        context.commit('setUser', data);
    },
    async verify(context) {
        const token = localStorage.getItem('autotracksAuthToken');

        // if there is a token
        if (token) {
            // verify the token is valid
            const response = await fetch('http://localhost:5000/api/v1/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });

            const responseData = await response.json();
            // token not valid or user not found
            if (!response.ok) {
                localStorage.clear('autotracksAuthToken');
            } else {
                const data = {
                    token: responseData.token,
                    userId: responseData.payload._id,
                    userPermissions: responseData.payload.permissions,
                    promptPasswordChange: responseData.payload.promptPasswordChange,
                    createDealershipCompleted: responseData.payload.createDealershipCompleted,
                    createUserCompleted: responseData.payload.createUserCompleted
                }

                // set the token in the local storage
                localStorage.setItem('autotracksAuthToken', data.token);
                // set the data in the store's state
                context.commit('setUser', data);
            }
        }
    }
}