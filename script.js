document.addEventListener('DOMContentLoaded', () => {
    const navBtn = document.getElementById('navBtn');
    const navElement = document.getElementById('nav');
    let navElementContOpen = navElement.classList.contains('open');
    let navElementContClose = navElement.classList.contains('close');

    document.getElementById('navBtn').addEventListener('click', function () {
        var navMenu = document.getElementById('nav');
        var line_1 = document.getElementById("line-1");
        var line_2 = document.getElementById("line-2");
        if (navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            navMenu.classList.add('close');
            setTimeout(function () {
                line_1.style.transform = "rotate(0deg) translateY(0px)";
                line_2.style.transform = "rotate(0deg) translateY(0px)";
            }, 10);
        } else {
            navMenu.classList.remove('closed');
            navMenu.classList.add('open');
            setTimeout(function () {
                line_1.style.transform = "rotate(45deg) translateY(10px)";
                line_2.style.transform = "rotate(-45deg) translateY(-10px)";
            }, 10);
        }
    });

    // For Scroll Animation
    const aboutBoxes = document.querySelectorAll("#about-sec");
    const observerAbout = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    aboutBoxes.forEach((box) => {
                        box.classList.remove("visible");
                        void box.offsetWidth;
                        box.classList.add("visible");
                    });
                }
            });
        },
        {
            threshold: 0.2,
        }
    );
    const aboutSection = document.querySelector("#about-sec");
    observerAbout.observe(aboutSection);

    const serviceBoxes = document.querySelectorAll("#service-sec");
    const observerService = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    serviceBoxes.forEach((box) => {
                        box.classList.remove("visible");
                        void box.offsetWidth;
                        box.classList.add("visible");
                    });
                }
            });
        },
        {
            threshold: 0.2,
        }
    );
    const serviceSection = document.querySelector("#service-sec");
    observerService.observe(serviceSection);
    const jsonUrl = 'cars.json';
    let displayedCarsCount = 0; // Track the number of cars currently displayed

    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && Array.isArray(data.highPerformanceCars)) {
                const carsToDisplay = data.highPerformanceCars.slice(0, 4);
                displayCars(carsToDisplay);
                displayedCarsCount = 4; // Initialize count of displayed cars
            } else {
                console.error('highPerformanceCars array not found in the JSON data.');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    function displayCars(cars) {
        const container = document.getElementById('cars');
        if (!container) {
            console.error('Element with ID "cars" not found.');
            return;
        }

        cars.forEach(car => {
            const carElement = document.createElement('div');
            carElement.className = 'car-item';

            carElement.innerHTML = `
                <img src="${car.image}" alt="${car.make} ${car.model}">
            `;

            carElement.addEventListener('click', () => {
                showCarDetails(car);
            });

            container.appendChild(carElement);
        });
    }

    const showMoreBtn = document.getElementById('showMoreCarsBtn');
    const overlay = document.getElementById('overlay');
    const carImgDiv = document.getElementById('carImg');
    const closeBtn = document.getElementById('close-btn');
    const carDetails = document.getElementById('car-details');

    showMoreBtn.addEventListener('click', () => {
        fetch(jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && Array.isArray(data.highPerformanceCars)) {
                    const carsToDisplay = data.highPerformanceCars.slice(displayedCarsCount, displayedCarsCount + 4);
                    displayCars(carsToDisplay);
                    displayedCarsCount += carsToDisplay.length; // Update count of displayed cars
                    showMoreBtn.style.display = 'none';
                } else {
                    console.error('highPerformanceCars array not found in the JSON data.');
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    function showCarDetails(car) {
        if (!carDetails || !overlay) {
            console.error('Missing element(s) for displaying car details.');
            return;
        }

        carImgDiv.innerHTML = `
        <img src="${car.image}" alt="${car.make, car.model}">
                <div class="all-div">
                    <h3>All you'll need to know about</h3>
                    <h2>${car.make} ${car.model} (${car.year})</h2>
                </div>`

        carDetails.innerHTML = `
        <p><strong>Performance:</strong> This car boasts an impressive <a>${car.horsepower} horsepower</a> , reaching
                    top speeds of <a>${car.topSpeed}</a>. Tuned by ${car.tuner}, it's built for ultimate driving pleasure.</p>

                <div class="technical-specs">
                    <p><strong>Engine:</strong> Equipped with an advanced <a>${car.upgrades.engine.type}</a> engine featuring:
                    <ul>
                    ${car.upgrades.engine.modifications.map(mod => `<li>${mod}</li>`).join('')}
                    </ul>
                    </p>
                </div>

                <div class="exterior-specs">
                    <p><strong>Exterior:</strong> Enhanced with a <a>${car.upgrades.exterior.bodyKit}</a>,
                        <a>${car.upgrades.exterior.paint}</a>, and <a>${car.upgrades.exterior.wheels}</a>.
                        Aerodynamic
                        features include:
                    <ul>
                    ${car.upgrades.exterior.aerodynamics.map(aero => `<li>${aero}</li>`).join('')}
                    </ul>
                    </p>
                </div>

                <div class="interior-specs">
                    <p><strong>Interior:</strong> The luxurious <a>${car.upgrades.interior.upholstery}</a>,
                         <a>${car.upgrades.interior.infotainment}</a>, and:
                    <ul>
                    ${car.upgrades.interior.additionalFeatures.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    </p>
                </div>
                <p>"Experience unmatched power and luxury with the ${car.make} ${car.model} (${car.year}), a masterpiece of performance and design."</p>
        `;

        overlay.style.display = 'flex';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none'; // Hide the overlay
        });
    } else {
        console.error('Close button not found.');
    }
});