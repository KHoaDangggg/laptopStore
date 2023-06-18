const purchaseBtns = document.querySelectorAll('.purchase-btn');

const purchaseUser = (itemId, userId) => async () => {
    const res = (
        await axios({
            method: 'PATCH',
            url: '/api/users/purchase',
            data: {
                itemId,
                userId,
            },
        })
    ).data;

    if (res.status === 'success') {
        showAlert('success', 'Thêm vào giỏ thành công');
    }
};

const purchaseLocal = (itemId) => async () => {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    const cart = JSON.parse(localStorage.getItem('cart'));
    let exist = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i]._id === itemId) {
            exist = true;
            break;
        }
    }
    if (exist) {
        showAlert('success', 'Thêm vào giỏ thành công');
        return;
    }
    const res = (
        await axios({
            method: 'GET',
            url: `/api/products/${itemId}`,
        })
    ).data;
    const { status, data: item } = res;
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    if (status === 'success') {
        showAlert('success', 'Thêm vào giỏ thành công');
    }
};

purchaseBtns.forEach((btn) => {
    const item = btn.dataset.item;
    const user = btn.dataset.user;
    if (user !== 'null') {
        btn.onclick = purchaseUser(item, user);
    } else {
        btn.onclick = purchaseLocal(item);
    }
});
