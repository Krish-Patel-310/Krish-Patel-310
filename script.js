// script.js
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GLOBAL CART LOGIC (Persistent Storage) ---
    // Retrieves cart count from local storage to keep it across different HTML pages
    let cartCount = parseInt(localStorage.getItem('brewCartCount')) || 0;
    const cartBadges = document.querySelectorAll('.cart-badge');

    const updateCartUI = () => {
        cartBadges.forEach(badge => {
            badge.textContent = cartCount;
            // Hide badge if 0
            badge.style.display = cartCount > 0 ? 'flex' : 'none';
        });
        localStorage.setItem('brewCartCount', cartCount);
    };
    
    // Initialize cart on page load
    updateCartUI();

    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            cartCount++;
            updateCartUI();
            
            // Visual feedback on the button
            const originalText = e.target.textContent;
            e.target.textContent = 'Added \u2713'; // Unicode checkmark
            e.target.classList.remove('text-primary');
            e.target.classList.add('bg-green-600', 'text-white', 'border-green-600');
            
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.classList.add('text-primary');
                e.target.classList.remove('bg-green-600', 'text-white', 'border-green-600');
            }, 1200);
        });
    });

    // --- 2. MENU CATEGORY FILTERING ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    if (filterBtns.length > 0 && menuItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Reset all buttons to inactive state
                filterBtns.forEach(b => {
                    b.classList.remove('text-primary', 'border-primary', 'border-b-2');
                    b.classList.add('text-slate-400');
                });
                
                // Set clicked button to active state
                btn.classList.add('text-primary', 'border-primary', 'border-b-2');
                btn.classList.remove('text-slate-400');

                // Filter logic based on data-category attribute
                const filterValue = btn.getAttribute('data-filter');
                
                menuItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'flex'; // Use flex to maintain internal card layout
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- 3. SECURE FORM SUBMISSION (Client-Side) ---
    const bookingForm = document.getElementById('reservation-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            
            // Basic sanitization check logic before sending to a backend
            const inputs = bookingForm.querySelectorAll('input, select');
            let isValid = true;
            inputs.forEach(input => {
                // Strip tags conceptually
                if(input.value.includes('<') || input.value.includes('>')) {
                    isValid = false;
                    input.style.borderColor = 'red';
                }
            });

            if(!isValid) {
                alert("Invalid characters detected. Please try again.");
                return;
            }

            // Simulate Network Request
            submitBtn.textContent = 'Securing Table...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Replace form with success state
                bookingForm.innerHTML = `
                    <div class="text-center py-8 animate-fade-in">
                        <span class="material-symbols-outlined text-green-500 text-6xl mb-4">check_circle</span>
                        <h3 class="text-2xl font-bold text-white mb-2">Reservation Confirmed</h3>
                        <p class="text-slate-400">Your table is secured. We've sent a pass to your email.</p>
                    </div>
                `;
            }, 1500);
        });
    }
});