if (document.querySelector('form')) {
    document.querySelector('form').onsubmit = (e) => {
        e.preventDefault();
        const data = {
            passwordCurrent: document.querySelector('#curentPassword').value,
            password: document.querySelector('#newPassword').value,
            passwordConfirm: document.querySelector('#newPasswordConfirm')
                .value,
        };
        (async () => {
            const status = await axios({
                method: 'PATCH',
                url: '/api/users/updatePassword',
                data,
            });
            if (status.status === 'success') {
                showAlert('success', 'Cập nhật thành công');
            }
        })();
    };
}
