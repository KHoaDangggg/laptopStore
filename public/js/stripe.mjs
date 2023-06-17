const stripe = Stripe(
    'pk_test_51MpCA0DfcEM9cIAmWGiqdhqfCoGX8bIXqDW2miaXFhARb39RzUhokPTAZ6KNPkNfzmY6OiBjN7xzpcXolzo1KclG00YIVSUyC6'
);

const purchaseItems = async (user) => {
    try {
        //1. Get checkout session from API
        const session = await axios(`/api/purchase/checkout-session/${user}`);
        //2. Create checkout form + charge credit card
        stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (error) {
        showAlert('error', error);
    }
};

const purchaseBtn = document.querySelector('.purchase-btn');
if (purchaseBtn) {
    purchaseBtn.onclick = (e) => {
        let currentCost = parseInt(
            document.querySelector('.totalCost').innerText.replace(/,/g, ''),
            10
        );
        if (currentCost >= 100000000) {
            showAlert(
                'warning',
                'Không thể giao dịch với đơn hàng có giá trị lớn hơn 99,999,999 vnđ'
            );
            return;
        }
        purchaseBtn.textContent = 'Processing ...';
        const user = JSON.parse(purchaseBtn.dataset.user);
        purchaseItems(user);
    };
}
