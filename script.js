let cart = [];

// কার্টে প্রোডাক্ট যোগ করার ফাংশন
function addToCart(name, price) {
    cart.push({ name, price });
    document.getElementById('cart-count').innerText = cart.length;
    alert(name + " কার্টে যোগ হয়েছে!");
}

// চেকআউট মডেল ওপেন/ক্লোজ করার ফাংশন
function toggleModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.toggle('hidden');
}

// হোয়াটসঅ্যাপে অর্ডার পাঠানোর মেইন ফাংশন
function sendToWhatsApp() {
    // ফর্ম থেকে তথ্য নেওয়া
    const name = document.getElementById('cust-name').value;
    const address = document.getElementById('cust-address').value;
    const phone = document.getElementById('cust-phone').value;

    // ভ্যালিডেশন
    if (cart.length === 0) {
        alert("আপনার কার্ট খালি! আগে প্রোডাক্ট যোগ করুন।");
        return;
    }

    if (!name || !address || !phone) {
        alert("দয়া করে নাম, ঠিকানা এবং ফোন নম্বর সবগুলো লিখুন।");
        return;
    }

    let productDetails = "";
    let totalPrice = 0;

    // কার্টের প্রোডাক্টগুলো সাজানো
    cart.forEach((item, index) => {
        productDetails += `${index + 1}. ${item.name} - ৳${item.price}%0A`;
        totalPrice += item.price;
    });

    // আপনার দেওয়া হোয়াটসঅ্যাপ নম্বর (৮৮ যোগ করা হয়েছে)
    const myNumber = "8801894357549"; 

    // মেসেজ ফরম্যাট
    const message = `*New Order - REDAMS*%0A%0A` +
                    `*Customer Details:*%0A` +
                    `Name: ${name}%0A` +
                    `Address: ${address}%0A` +
                    `Phone: ${phone}%0A%0A` +
                    `*Order Items:*%0A${productDetails}%0A` +
                    `*Total Bill:* ৳${totalPrice}%0A` +
                    `*Method:* Cash on Delivery`;

    // হোয়াটসঅ্যাপ ইউআরএল
    const whatsappUrl = `https://wa.me/${myNumber}?text=${message}`;

    // লিঙ্ক ওপেন করা
    window.open(whatsappUrl, '_blank');
}
