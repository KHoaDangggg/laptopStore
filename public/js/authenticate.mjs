const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/users/login',
            data: {
                email,
                password,
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 200);
        }
    } catch (err) {
        showAlert('error', 'Wrong username or password');
    }
};
const signup = async (name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm,
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Create successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 200);
        }
    } catch (err) {
        showAlert('error', 'Thông tin đăng kí không hợp lệ');
    }
};
const logout = async () => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/users/logout',
        });
        showAlert('success', 'Logged out');
        if (res.data.status === 'success') {
            location.assign('/');
        }
    } catch (error) {}
};
if (document.querySelector('.logout-btn')) {
    document.querySelector('.logout-btn').onclick = (e) => {
        e.preventDefault();
        logout();
    };
}
if (document.querySelector('.login-form')) {
    document.querySelector('.login-form').onsubmit = (e) => {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        login(email, password);
    };
}
if (document.querySelector('.form-signup')) {
    document.querySelector('.form-signup').onsubmit = (e) => {
        e.preventDefault();
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const passwordConfirm =
            document.querySelector('#passwordConfirm').value;
        signup(name, email, password, passwordConfirm);
    };
}
