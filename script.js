let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    document.getElementById('cart-count').innerText = cart.length;
    alert(name + " has been added to cart!");
}

function toggleModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.toggle('hidden');
}

function sendToWhatsApp() {
    const name = document.getElementById('cust-name').value;
    const address = document.getElementById('cust-address').value;
    const phone = document.getElementById('cust-phone').value;

    if (!name || !address || !phone) {
        alert("Please fill all details!");
        return;
    }

    let productDetails = "";
    let totalPrice = 0;
    cart.forEach((item, index) => {
        productDetails += `${index + 1}. ${item.name} - ৳${item.price}%0A`;
        totalPrice += item.price;
    });

    // এখানে আপনার নিজের হোয়াটসঅ্যাপ নম্বর দিন (Country Code সহ)
    const myNumber = "8801XXXXXXXXX"; 

    const message = `*New Order - REDAMS*%0A%0A` +
                    `*Customer Details:*%0A` +
                    `Name: ${name}%0A` +
                    `Address: ${address}%0A` +
                    `Phone: ${phone}%0A%0A` +
                    `*Ordered Products:*%0A${productDetails}%0A` +
                    `*Total Bill:* ৳${totalPrice}%0A` +
                    `*Payment Method:* Cash on Delivery`;

    const whatsappUrl = `https://wa.me/${myNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}
