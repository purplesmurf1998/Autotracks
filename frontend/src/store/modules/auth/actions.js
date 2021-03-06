import Store from '../../index'
export default {
    async login(context, payload) {
        // login user and set user in the store
        const response = await fetch(`${Store.state.api}/auth/signin`, {
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
            firstName: responseData.payload.first_name,
            lastName: responseData.payload.last_name,
            role: responseData.payload.role,
            dealership: responseData.payload.dealership,
            createDealershipCompleted: responseData.payload.createDealershipCompleted,
            createUserCompleted: responseData.payload.createUserCompleted,
            promptPasswordChange: responseData.payload.promptPasswordChange,
            userEventsSubscriptions: responseData.payload.subscribed_events
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
            const response = await fetch(`${Store.state.api}/auth/verify`, {
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
                    firstName: responseData.payload.first_name,
                    lastName: responseData.payload.last_name,
                    role: responseData.payload.role,
                    dealership: responseData.payload.dealership,
                    promptPasswordChange: responseData.payload.promptPasswordChange,
                    createDealershipCompleted: responseData.payload.createDealershipCompleted,
                    createUserCompleted: responseData.payload.createUserCompleted,
                    userEventsSubscriptions: responseData.payload.subscribed_events,
                }

                // set the token in the local storage
                localStorage.setItem('autotracksAuthToken', data.token);
                // set the data in the store's state
                context.commit('setUser', data);
            }
        }
    }
}