$(document).ready(function() {
    // 1. Hamburger Logic
    $('#hamburger').on('click', function() {
        $('#nav-links').toggleClass('active');
    });

    // 2. Fetch Data from API
    const apiURL = "https://fakestoreapi.com/products?limit=4";

    $.ajax({
        url: apiURL,
        type: "GET",
        success: function(products) {
            const grid = $('#product-grid');
            grid.empty();

            products.forEach(product => {
                const productHTML = `
                    <div class="product-card">
                        <div class="product-img-wrapper">
                            <img src="${product.image}" alt="${product.title}">
                        </div>
                        <div class="product-info">
                            <h3>${product.title.substring(0, 20)}...</h3>
                            <p class="price">Rs. ${(product.price * 280).toLocaleString()}</p> 
                            <button class="add-btn quick-view" data-id="${product.id}">Quick View</button>
                        </div>
                    </div>
                `;
                grid.append(productHTML);
            });

            // 3. Quick View Interaction
            $('.quick-view').on('click', function() {
                const id = $(this).data('id');
                const item = products.find(p => p.id === id);

                // Inject data into modal
                $('#modal-img').attr('src', item.image);
                $('#modal-title').text(item.title);
                $('#modal-price').text(`Rs. ${(item.price * 280).toLocaleString()}`);
                $('#modal-desc').text(item.description);
                $('#modal-rating').text(`Rating: ★ ${item.rating.rate} / 5`);

                $('#product-modal').fadeIn();
            });
        },
        error: function() {
            $('#product-grid').html('<p>Error loading footwear.</p>');
        }
    });

    // 4. Close Modal
    $('.close-modal, #product-modal').on('click', function(e) {
        if (e.target !== this && !$(e.target).hasClass('close-modal')) return;
        $('#product-modal').fadeOut();
    });
});