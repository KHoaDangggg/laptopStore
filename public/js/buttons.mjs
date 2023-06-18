const increaseBtns = document.querySelectorAll('.increaseBtn');
const decreaseBtns = document.querySelectorAll('.decreaseBtn');
const deleteBtns = document.querySelectorAll('.deleteBtn');
let cost = document.querySelectorAll('.cost');
let costTotal = document.querySelectorAll('.totalCost');
const calculateTotal = () => {
    const total = Array.from(cost).reduce((acc, cur) => {
        if (cur.closest('li').style.display !== 'none') {
            return acc + parseFloat(cur.innerText.replaceAll(',', ''));
        }
        return acc;
    }, 0);
    costTotal.forEach((el) => {
        el.innerText = total.toLocaleString('en-US');
    });
};
const costChange = (sign, btn) => () => {
    const productCost = parseFloat(
        btn
            .closest('li')
            .querySelector('.productCost')
            .innerText.replaceAll(',', '')
    );
    const cost = btn.closest('li').querySelector('.cost');
    const qtnBtn = btn
        .closest('.btn-group')
        .querySelector('button:nth-child(2)');
    let qtn = parseFloat(qtnBtn.innerText.replaceAll(',', ''));
    if (sign) {
        qtn++;
        cost.innerText = (productCost * qtn).toLocaleString('en-US');
        calculateTotal();
    } else {
        if (qtn === 0) return;
        qtn--;
        cost.innerText = (productCost * qtn).toLocaleString('en-US');
        calculateTotal();
    }
    qtnBtn.innerText = qtn;
};
increaseBtns.forEach((btn) => {
    btn.onclick = costChange(true, btn);
});

decreaseBtns.forEach((btn) => {
    btn.onclick = costChange(false, btn);
});

deleteBtns.forEach((btn) => {
    const itemId = btn.dataset.item;
    const userId = btn.dataset.user;
    btn.onclick = async () => {
        btn.closest('li').style.display = 'none';
        if (userId !== 'null') {
            await axios({
                method: 'PATCH',
                url: '/api/users/deletePurchase',
                data: {
                    itemId,
                    userId,
                },
            });
        } else {
            let items = JSON.parse(localStorage.getItem('cart'));
            items = items.filter((item) => item._id !== itemId);
            localStorage.setItem('cart', JSON.stringify(items));
        }
        calculateTotal();
    };
});
