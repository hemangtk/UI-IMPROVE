const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const isSearchPage = window.location.pathname.includes('search-results.html');


const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        
        
        if (!response.meals) {
            recipeContainer.innerHTML = "<h2>No recipes found...</h2>";
            return;
        }
        
        recipeContainer.innerHTML = "";
        
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `;
            
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            
            button.addEventListener('click', () => {
                openRecipePopup(meal);
            });
            recipeDiv.appendChild(button);
            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error in fetching Recipes...</h2>";
    }
}

const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];  
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];   
            ingredientsList += `<li>${measure} ${ingredient}</li>`;     
        } else {
            break;
        }
    }
    return ingredientsList;
}
const recipeOverlay = document.querySelector('.recipe-overlay');

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    recipeDetailsContent.parentElement.style.display = "block";
    recipeOverlay.style.display = "block";
}

recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
    recipeOverlay.style.display = "none";
});

searchBtn.addEventListener('click', (e) => {  
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = "<h2>Type the meal in search box.</h2>";
        return;
    }

    if (!isSearchPage) {
        // If we're on the main page, redirect to search results page with query parameter
        window.location.href = `search-results.html?q=${encodeURIComponent(searchInput)}`;
    } else {
        // If we're already on the search page, just fetch results
        fetchRecipes(searchInput);
    }
});

if (isSearchPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
        searchBox.value = query;
        fetchRecipes(query);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const slide = document.querySelector('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const cards = document.querySelectorAll('.cuisine-card');
    
    let currentIndex = 0;
    const cardWidth = 320; // card width + gap
    
    // Clone first few cards and append to end for infinite scroll effect
    const firstCards = Array.from(cards).slice(0, 3);
    firstCards.forEach(card => {
        const clone = card.cloneNode(true);
        slide.appendChild(clone);
    });
    
    function updateSlidePosition() {
        slide.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
    }
    
    function moveToNext() {
        currentIndex++;
        updateSlidePosition();
        
        // Reset to start when reaching end
        if (currentIndex >= cards.length) {
            setTimeout(() => {
                slide.style.transition = 'none';
                currentIndex = 0;
                updateSlidePosition();
                setTimeout(() => {
                    slide.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            }, 500);
        }
    }
    
    function moveToPrev() {
        if (currentIndex <= 0) {
            slide.style.transition = 'none';
            currentIndex = cards.length;
            updateSlidePosition();
            setTimeout(() => {
                slide.style.transition = 'transform 0.5s ease-in-out';
                currentIndex--;
                updateSlidePosition();
            }, 50);
        } else {
            currentIndex--;
            updateSlidePosition();
        }
    }
    
    // Auto-slide every 3 seconds
    const autoSlide = setInterval(moveToNext, 3000);
    
    // Event listeners for manual navigation
    nextBtn.addEventListener('click', () => {
        clearInterval(autoSlide);
        moveToNext();
    });
    
    prevBtn.addEventListener('click', () => {
        clearInterval(autoSlide);
        moveToPrev();
    });
    
    // Pause auto-slide when hovering over carousel
    slide.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });
});
