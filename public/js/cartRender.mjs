const list = document.querySelector('ul');
const totalCost = document.querySelectorAll('.totalCost');
let products;
products = JSON.parse(list.dataset.products);
user = JSON.parse(list.dataset.user);
const render = () => {
    let html = products.reduce((accumulate, product) => {
        return (
            accumulate +
            `<li class="row border-bottom border-secondary pb-4">
                <div class="col-12 col-md-3 col-lg-3 d-flex justify-content-center mb-3">
                    <img src="/laptop/${
                        product.image[0]
                    }" style="max-width: 150px; max-height: 150px">
                </div>
                <div class="col-12 col-md-9 col-lg-6">
                    <p class="h5 font-weight-bold mt-0 mb-1">
                        ${product.name_model} (${product.cpu} | ${
                product.ram
            } | ${product.ssd} | ${product.display.size} | ${
                product.operating_system
            } | ${product.color}) 
                    </p>
                    <span class="small">Bảo hành 24 tháng chính hãng, Pin và sạc bảo hành 12 tháng, Đổi mới trong 15 ngày nếu có lỗi do nhà sản xuất</span>
                    <br>
                    <span class="text-danger">Khuyến mại:</span>
                    <br>
                    <i class="fa-solid fa-gift text-warning"></i>
                    <span class="text-danger font-weight-bold">&nbsp;&nbsp;Gói quà tặng giá trị bao gồm:</span>
                    <br>
                    <span class="small">✦ Hỗ trợ mua Ram laptop 8GB bus 3200(RAGK0092) chỉ với giá</span>
                    <span class="text-danger font-weight-bold">529.000vnđ </span>
                    <span class="small">bảo hành 3 năm chính hãng</span>
                    <br>
                    <span class="small">✦ Balo Laptop AnPhatpc (TUNB0097)</span>
                    <br>
                    <span class="small">✦ Giảm giá màn hình lên tới </span>
                    <span class="text-danger font-weight-bold">1.000.000đ </span>
                    <span class="small">khi mua cùng màn hình</span>
                    <br>
                    <span class="small">✦ Ưu đãi giảm giá 10% khi mua đế tản nhiệt laptop</span>
                    <br>
                    <span class="small">✦ Ưu đãi giảm giá 50% khi mua túi chống sốc HP 14-15,6" cao cấp</span>
                    <br>
                    <span class="small text-primary font-weight-bold">✦ Giảm 20% khi mua cùng Đế Tản Nhiệt máy tính HIDEKI H36</span>
                </div>
                <div class="col-12 col-lg-3 text-right">
                    <span class="line-through text-secondary">
                        ${product.price.toLocaleString('en-US')}
                    </span>
                    <span>đ</span>
                    <br>
                    <span class="productCost text-secondary">
                        ${product.new_price.toLocaleString('en-US')}
                    </span>
                    <span>đ</span>
                    <br>
                    <span class="text-danger font-weight-bold">Tổng: </span>
                    <span class="cost">${product.new_price.toLocaleString(
                        'en-US'
                    )}</span>
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group mr-2" role="group" aria-label="First group">
                        <button class="border border-secondary btn btn-light decreaseBtn" type="button">-</button>
                        <button class="border border-secondary btn btn-white" type="button">1</button>
                        <button class="border border-secondary btn btn-light increaseBtn" type="button">+</button>
                        </div>
                    </div>
                    <button class="deleteBtn btn btn-danger btn-sm mt-3" type="button" data-user = "${
                        user === null ? null : user._id
                    }" data-item = "${product._id}">Xóa</button>
                </div>
            </li>`
        );
    }, '');
    list.innerHTML = html;
    let cost = products.reduce((acc, cur) => acc + cur.new_price, 0);
    totalCost.forEach((el) => {
        el.innerText = cost.toLocaleString('en-US');
    });
};
if (products === null) {
    products = JSON.parse(localStorage.getItem('cart')) || [];
}
products = products.filter((el) => el !== null);
render();
