// Select necessary DOM elements
const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs = document.querySelectorAll(".step-1 form input");
const plans = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch input");  // Corrected switch querySelector to target input
const addons = document.querySelectorAll(".box");
const totalElement = document.querySelector(".total b");
const planPrices = document.querySelectorAll(".plan-priced");  // Changed to plan-priced

let time;  // Variable to store time (yearly or monthly)
let currentStep = 1;
let currentCircle = 0;

const obj = {
    plan: null,
    kind: null,
    price: null,
};

// Navigation logic for steps
steps.forEach((step) => {
    const nextBtn = step.querySelector(".next-stp");
    const prevBtn = step.querySelector(".prev-stp");

    // Previous step button functionality
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            document.querySelector(`.step-${currentStep}`).style.display = "none";
            currentStep--;
            document.querySelector(`.step-${currentStep}`).style.display = "flex";
            circleSteps[currentCircle].classList.remove("active");
            currentCircle--;
        });
    }

    // Next step button functionality
    nextBtn.addEventListener("click", () => {
        if (validateForm()) {
            document.querySelector(`.step-${currentStep}`).style.display = "none";
            currentStep++;
            currentCircle++;
            document.querySelector(`.step-${currentStep}`).style.display = "flex";
            circleSteps[currentCircle].classList.add("active");
            setTotal();
            summary(obj);
        }
    });
});

// Summary display logic
function summary(obj) {
    const planName = document.querySelector(".plan-name");
    const planPrice = document.querySelector(".plan-price");
    planPrice.innerHTML = `${obj.price.innerText}`;
    planName.innerHTML = `${obj.plan.innerText} (${obj.kind ? "yearly" : "monthly"})`;
}

// Form validation logic
function validateForm() {
    let valid = true;
    formInputs.forEach((input) => {
        if (!input.value.trim()) {  // Check for empty input
            valid = false;
            input.classList.add('err');
            findLabel(input).nextElementSibling.style.display = "flex";  // Show error message
        } else {
            input.classList.remove('err');
            findLabel(input).nextElementSibling.style.display = "none";  // Hide error message
        }
    });
    return valid;
}

// Find label for input
function findLabel(el) {
    const idVal = el.id;
    const labels = document.getElementsByTagName('label');
    for (let i = 0; i < labels.length; i++) {
        if (labels[i].htmlFor === idVal) return labels[i];
    }
}

// Plan selection logic
plans.forEach((plan) => {
    plan.addEventListener("click", () => {
        document.querySelector(".selected").classList.remove("selected");
        plan.classList.add("selected");
        const planName = plan.querySelector("b");
        const planPrice = plan.querySelector(".plan-priced");
        obj.plan = planName;
        obj.price = planPrice;
    });
});

// Switch between yearly and monthly pricing
switcher.addEventListener("change", () => {  // Changed from "click" to "change" for input checkbox
    const isChecked = switcher.checked;
    if (isChecked) {
        document.querySelector(".monthly").classList.remove("sw-active");
        document.querySelector(".yearly").classList.add("sw-active");
    } else {
        document.querySelector(".monthly").classList.add("sw-active");
        document.querySelector(".yearly").classList.remove("sw-active");
    }
    switchPrice(isChecked);
    obj.kind = isChecked;
});

// Add-on selection logic
addons.forEach((addon) => {
    addon.addEventListener("click", (e) => {
        const addonSelect = addon.querySelector("input");
        const ID = addon.getAttribute("data-id");
        if (addonSelect.checked) {
            addonSelect.checked = false;
            addon.classList.remove("ad-selected");  // Deselect addon
            showAddon(ID, false);
        } else {
            addonSelect.checked = true;
            addon.classList.add("ad-selected");  // Select addon
            showAddon(addon, true);
            e.preventDefault();
        }
    });
});

// Price switcher logic (yearly/monthly)
function switchPrice(checked) {
    const yearlyPrice = [90, 120, 150];
    const monthlyPrice = [9, 12, 15];
    const prices = document.querySelectorAll('.plan-priced');
    if (checked) {
        prices[0].innerHTML = `$${yearlyPrice[0]}/yr`;
        prices[1].innerHTML = `$${yearlyPrice[1]}/yr`;
        prices[2].innerHTML = `$${yearlyPrice[2]}/yr`;
        setTime(true);
    } else {
        prices[0].innerHTML = `$${monthlyPrice[0]}/mo`;
        prices[1].innerHTML = `$${monthlyPrice[1]}/mo`;
        prices[2].innerHTML = `$${monthlyPrice[2]}/mo`;
        setTime(false);
    }
}

// Add-on handling logic
function showAddon(ad, val) {
    const temp = document.getElementsByTagName("template")[0];
    const clone = temp.content.cloneNode(true);
    const serviceName = clone.querySelector(".service-name");
    const servicePrice = clone.querySelector(".service-price");
    const serviceID = clone.querySelector(".selected-addon");

    if (ad && val) {
        serviceName.innerText = ad.querySelector("label").innerText;
        servicePrice.innerText = ad.querySelector(".price").innerText;
        serviceID.setAttribute("data-id", ad.dataset.id);
        document.querySelector(".addons").appendChild(clone);
    } else {
        const addons = document.querySelectorAll(".selected-addon");
        addons.forEach((addon) => {
            const attr = addon.getAttribute("data-id");
            if (attr == ad) {
                addon.remove();
            }
        });
    }
}

// Calculate total price
function setTotal() {
    const planStr = obj.price.innerHTML;
    const planPrice = parseInt(planStr.replace(/\D/g, ''));  // Extract price from string
    let addonTotal = 0;

    const addonPrices = document.querySelectorAll(".selected-addon .service-price");
    addonPrices.forEach(addon => {
        const addonPrice = parseInt(addon.innerHTML.replace(/\D/g, ''));  // Get addon price
        addonTotal += addonPrice;
    });

    const totalPrice = planPrice + addonTotal;
    totalElement.innerText = `$${totalPrice}`;  // Update total price
}
