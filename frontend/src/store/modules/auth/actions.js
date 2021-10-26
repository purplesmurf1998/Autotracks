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
            loggedIn: true
        }

        context.commit('setUser', data);
        return { success: true };
    },
    async register(context, payload) {
        // register new admin user
        const response = await fetch('http://localhost:5000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                first_name: payload.first_name,
                last_name: payload.last_name,
                email: payload.email,
                role: payload.role,
                permissions: payload.permissions,
                password: payload.password
            }
        });

        const responseData = await response.json();

        console.log(responseData);
    }
}