const filters = document.querySelectorAll(".filter");

    filters.forEach((filter) => {
        filter.addEventListener("click", function () {
            const category = this.getAttribute("data-value"); // Get category from data-value
            window.location.href = `/listings?category=${category}`; // Redirect with category filter
        });
    });
