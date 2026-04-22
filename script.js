// ১. আপনার প্রোডাক্ট লিস্ট (এখানে আপনি যত খুশি প্রোডাক্ট যোগ করতে পারবেন)
const products = [
    { id: 1, name: "Premium Drop Shoulder", price: 850, category: "drop-shoulder", img: "images/cat1.jpg" },
    { id: 2, name: "Basic Half Sleeve", price: 650, category: "half-sleeve", img: "images/cat2.jpg" }
];

let cart = [];

// ২. ক্যাটাগরি অনুযায়ী প্রোডাক্ট দেখানোর ফাংশন
function filterCategory(cat) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ""; // আগের প্রোডাক্ট মুছে ফেলা
    
    const filtered = products.filter(p => p.category === cat);
    
    filtered.forEach(p => {
        grid.innerHTML += `
            <div class="group bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition">
                <img src="${p.img}" class="w-full h-64 object-cover rounded-md">
                <h3 class="mt-4 font-semibold text-gray-800">${p.name}</h3>
                <p class="text-gray-500 font-bold">৳ ${p.price}</p>
                <button onclick="addToCart('${p.name}', ${p.price})" class="mt-3 w-full bg-black text-white py-2 rounded text-sm uppercase">Add to Cart</button>
            </div>
        `;
    });
    grid.scrollIntoView({ behavior: 'smooth' });
}

// ৩. কার্ট এবং হোয়াটসঅ্যাপ অর্ডার ফাংশন
function addToCart(name, price) {
    cart.push({ name, price });
    document.getElementById('cart-count').innerText = cart.length;
    alert(name + " কার্টে যোগ হয়েছে!");
}

function sendToWhatsApp() {
    // ফর্ম থেকে কাস্টমারের তথ্য নেওয়া
    const name = document.getElementById('cust-name').value; // আপনার ইনপুট ID চেক করুন
    const address = document.getElementById('cust-address').value;
    const phone = document.getElementById('cust-phone').value;

    // কার্ট থেকে সিলেক্ট করা প্রোডাক্টের নাম ও প্রাইস নেওয়া
    if (cart.length === 0) {
        alert("আপনার কার্ট খালি! আগে প্রোডাক্ট যোগ করুন।");
        return;
    }

    let productDetails = "";
    let totalPrice = 0;

    cart.forEach((item, index) => {
        productDetails += `${index + 1}. ${item.name} - ৳${item.price}%0A`;
        totalPrice += item.price;
    });

    // আপনার হোয়াটসঅ্যাপ নম্বর এখানে দিন (অবশ্যই ৮৮০ দিয়ে শুরু করবেন)
    const myNumber = "8801XXXXXXXXX"; 

    // মেসেজের ফরম্যাট তৈরি (এটি সুন্দরভাবে সাজানো থাকবে)
    const message = `*New Order - REDAMS*%0A%0A` +
                    `*Customer Info:*%0A` +
                    `Name: ${name}%0A` +
                    `Address: ${address}%0A` +
                    `WhatsApp: ${phone}%0A%0A` +
                    `*Order Items:*%0A${productDetails}%0A` +
                    `*Total Bill:* ৳${totalPrice}%0A` +
                    `*Payment:* Cash on Delivery`;

    // হোয়াটসঅ্যাপ লিংক জেনারেট করা
    const whatsappUrl = `https://wa.me/${myNumber}?text=${message}`;

    // নতুন ট্যাবে হোয়াটসঅ্যাপ ওপেন করা
    window.open(whatsappUrl, '_blank');
}
