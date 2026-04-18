let cart = [];
function login(){
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const errorDisplay = document.getElementById("loginError");
    if(user.trim() === "" || pass.trim() === "") {
        errorDisplay.innerText = "Enter correct details";
    } else {
        errorDisplay.innerText = "";
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("mainPage").classList.remove("hidden");
    }
}
function goHome() {
    hideAll();
    document.getElementById("mainPage").classList.remove("hidden");
}

function showProfile(){
    hideAll();
    document.getElementById("profilePage").classList.remove("hidden");
}
function createBubble(e) {
    const bubble = document.createElement("div");
    bubble.className = "floating-bubble";
    bubble.innerText = "Added..🍗";
    bubble.style.left = e.clientX + "px";
    bubble.style.top = e.clientY + "px";
    document.body.appendChild(bubble);
    setTimeout(() => bubble.remove(), 900);
}

function addToCart(item, price, event) {
    if(event) createBubble(event);
    cart.push({item, price});
    updateUI(item);
}

function removeFromCart(itemName) {
    const index = cart.findIndex(c => c.item === itemName);
    if (index !== -1) {
        cart.splice(index, 1); // Removes only one instance of the item
    }
    updateUI(itemName);
    showCart(); // Refresh the cart view
}

function updateUI(item) {
    const cartCount = document.getElementById("cartCount");
    cartCount.innerText = cart.length;
    
    cartCount.style.transform = "scale(1.5)";
    cartCount.style.display = "inline-block";
    cartCount.style.transition = "0.2s";
    setTimeout(() => { cartCount.style.transform = "scale(1)"; }, 200);

    const badgeId = "qty-" + item.trim().replace(/\s+/g, '-');
    const badge = document.getElementById(badgeId);
    if(badge) {
        const currentQty = cart.filter(x => x.item === item).length;
        badge.innerText = currentQty;
        badge.style.display = currentQty > 0 ? "flex" : "none";
    }
}

function showCart() {
    hideAll();
    document.getElementById("cartPage").classList.remove("hidden");
    let output = "";
    let total = 0;
    let counts = {};
    
    cart.forEach(x => { counts[x.item] = (counts[x.item] || 0) + 1; });
    let uniqueItems = [...new Set(cart.map(c => c.item))];
    
    uniqueItems.forEach(itemName => {
        let itemData = cart.find(c => c.item === itemName);
        let count = counts[itemName];
        // Added a red Remove button for each item
        output += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; background: #eee; padding: 10px; border-radius: 10px;">
                <span>${itemName} x ${count} - ₹${itemData.price * count}</span>
                <button onclick="removeFromCart('${itemName}')" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button>
            </div>`;
    });
    
    cart.forEach(c => total += c.price);
    document.getElementById("cartItems").innerHTML = output || "<p>Cart is Empty</p>";
    document.getElementById("totalAmount").innerText = total;
}

function showPayment() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    hideAll();
    document.getElementById("paymentPage").classList.remove("hidden");
}

function getLocation() {
    const status = document.getElementById("locationStatus");
    const addressBox = document.getElementById("manualAddress");

    if (!navigator.geolocation) {
        status.innerText = "Geolocation is not supported";
    } else {
        status.innerText = "Locating...";
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                addressBox.value = `My Location: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}`;
                status.innerText = "Location fetched! ✅";
            },
            () => {
                status.innerText = "Permission denied / timed out";
            }
        );
    }
}

function pay(method) {
    const address = document.getElementById("manualAddress").value;

    if (address.trim() === "") {
        alert("Please enter a delivery address first!");
        return;
    }

    alert("Address: " + address +"\nRedirecting to " + method + "... 💳");
    
    setTimeout(() => {
        alert("Order Successful! Your food is on the way. ✅");
        cart = [];
        document.getElementById("cartCount").innerText = "0";
        document.getElementById("manualAddress").value = "";
        document.getElementById("locationStatus").innerText = "";
        
        const badges = document.querySelectorAll('.qty-badge');
        badges.forEach(b => {
            b.innerText = "0";
            b.style.display = "none";
        });
    }, 800);
}

function hideAll(){
    document.getElementById("mainPage").classList.add("hidden");
    document.getElementById("profilePage").classList.add("hidden");
    document.getElementById("cartPage").classList.add("hidden");
    document.getElementById("paymentPage").classList.add("hidden");
}