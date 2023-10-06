// strict

class Calculator {
    constructor() {
        // Properties
        this.months = [24, 36, 48, 60, 72, 84];
        this.selectedMonth = 24;
        this.estimated = 0;

        // Dom Elements
        this.msrp = document.querySelector("#msrp");
        this.downPayment = document.querySelector("#down-payment");
        this.tradeInValue = document.querySelector("#trade-in-value");
        this.apr = document.querySelector("#apr");
        this.salesTax = document.querySelector("#sales-tax");
        this.searchBtn = document.querySelector('.search-cars')
        
        this.result = document.querySelector(".result");
        this.terms = document.querySelector(".term-listing");
        this.termLength = document.querySelector(".term-length");
        this.loanDetails = document.querySelector(".loan-details-list");
        this.totalEstimated = document.querySelector(".total-estimated ul");

        // Events
        document.addEventListener("DOMContentLoaded", this.initializeApp);
        this.msrp.addEventListener("keyup", this.updateResult);
        this.downPayment.addEventListener("keyup", this.updateResult);
        this.tradeInValue.addEventListener("keyup", this.updateResult);
        this.apr.addEventListener("keyup", this.validatePercent);
        this.salesTax.addEventListener("keyup", this.validatePercent);
        this.msrp.addEventListener("keydown", this.validateInput);
        this.downPayment.addEventListener("keydown", this.validateInput);
        this.tradeInValue.addEventListener("keydown", this.validateInput);
        this.terms.addEventListener("click", this.handleMonthChange);

    }

    // Initialize App On Load of Browser
    initializeApp = () => {
        this.estimated = (this.calculateResult() < 1) ? 0 : this.calculateResult()
        this.searchBtn.setAttribute('data-allow', (+this.msrp.value.trim().replace(/,/g, "") === 0 ) ? 0 : 1)
        this.loadSearchBtn(this.searchBtn)
        this.result.innerText = (this.calculateResult() < 1) ? 0 : Math.round(this.calculateResult()).toLocaleString("en-US");
        this.showTerms();
    };


    // Calculate and Get Latest Result Based on Keyup and Keydown Events
    calculateResult = () => {
        const loanAmount = this.msrp.value.trim().replace(/,/g, "") - this.downPayment.value.trim().replace(/,/g, "") - this.tradeInValue.value.trim().replace(/,/g, "")
        if (
            +this.downPayment.value.trim().replace(/,/g, "") >=
            +this.msrp.value.trim().replace(/,/g, "")
        ) {
            
            return 0;
        }

        return (
            Math.round(
                (loanAmount + ((this.apr.value !== '') ? this.calculateApr() + (this.salesTax.value !== '' ? (((this.salesTax.value /100) * this.calculateApr()) + this.calculateApr()) - this.calculateApr() : 0 )  : 0) + ((this.salesTax.value !== '') ? this.calculateSalesTax() : 0 ) ) /
                this.selectedMonth
            ) || 0
        );

    };

    loadSearchBtn = (item) => {
        console.log(+item.dataset.allow)
        if(+item.dataset.allow === 0){
            item.style.background = '#aaa'
            item.style.cursor = 'not-allowed'
            item.style.pointerEvents = 'none'
        }else{
            item.style.pointerEvents = 'unset'
            item.style.background = '#000'
            item.style.cursor = 'pointer'
        }

        return item.href = `https://development.carzino.com/cars/?radius=200&max_price=${this.msrp.value.trim().replace(/,/g, "")}`
    }

    // Method To Calculate APR
    calculateApr = () => {
        const loanAmount = this.msrp.value.trim().replace(/,/g, "") - this.downPayment.value.trim().replace(/,/g, "") - this.tradeInValue.value.trim().replace(/,/g, "")
        const apr = ((this.apr.value / 1200) * loanAmount) / (1 - (Math.pow((1 + (this.apr.value / 1200)), (-this.selectedMonth))))
        if (
            +this.downPayment.value.trim().replace(/,/g, "") >=
            +this.msrp.value.trim().replace(/,/g, "")
        ) {
            return 0
        }
        return Math.abs((apr * this.selectedMonth) - loanAmount)
    }

    // Method To Calculate Sales Tax
    calculateSalesTax = () => {
       return (this.salesTax.value.trim().replace(/,/g, "") / 100) * this.msrp.value.trim().replace(/,/g, "")
    }

    // Method to cClculate Total Loan Amount
    getTotalEstimated = () => {
        if (
            +this.downPayment.value.trim().replace(/,/g, "") >=
            +this.msrp.value.trim().replace(/,/g, "") ||
            +this.tradeInValue.value.trim().replace(/,/g, "") >=
            +this.msrp.value.trim().replace(/,/g, "")
        ) {
            return 0;
        }

        const loanAmount = this.msrp.value.trim().replace(/,/g, "") - this.downPayment.value.trim().replace(/,/g, "") - this.tradeInValue.value.trim().replace(/,/g, "")

        return ( loanAmount + ((this.apr.value !== '') ? this.calculateApr() + (this.salesTax.value !== '' ? (((this.salesTax.value /100) * this.calculateApr()) + this.calculateApr()) - this.calculateApr() : 0 )  : 0) + ((this.salesTax.value !== '') ? this.calculateSalesTax() : 0 ))
    };

    // Update App on Keyup Event In Percentage Field
    validatePercent = (e) => {
        this.initializeApp()
    }
    
 // Keyup Validation for Text Input
 updateResult = (e) => {
        let num = e.target.value.replace(/,/gi, "");

        if (e.target.value.length === 0) {
            if (e.keyCode === 8 || e.keyCode === 46) {
                e.target.value = 0;
            }
        }

        let newNum = num
            .replace(/[^0-9,]/g, "")
            .split(/(?=(?:\d{3})+$)/)
            .join(",");

        e.target.value = newNum;

        if (e.target.value === "") {
            e.target.value = 0;
        }
        this.initializeApp();
    };

    
    // Keydown Validation for Text Input
    validateInput = (e) => {
        if (+e.target.value === 0) {
            e.target.value = "";
        }
    };


    // Populate UI with Necessary Details
    showTerms = () => {
        this.terms.innerHTML = this.months
            .map((month) => {
                return `<li class='list-item ${this.selectedMonth === month && "active"
                    }' data-month=${month} >${month} mo.</li>`;
            })
            .join("");

        this.termLength.innerText = `for ${this.selectedMonth / 12} years`;

        this.loanDetails.innerHTML = `<li>
        <span>Vehicle Price</span>
        <span>$${this.msrp.value}</span>
    </li>
    <li>
        <span>Down Payment</span>
        <span>-$${this.downPayment.value}</span>
    </li>
    <li>
        <span>Trade In Value</span>
        <span>-$${this.tradeInValue.value}</span>
    </li>
    <li>
        <span>Estimated Sales Tax</span>
        <span>+$${Math.round(this.calculateSalesTax())}</span>
    </li>
    <li>
        <span>Estimated Financing Rate</span>
        <span>+$${(this.apr.value === '' ) ? 0 : Math.round(((this.apr.value !== '') ? this.calculateApr() + (this.salesTax.value !== '' ? (((this.salesTax.value /100) * this.calculateApr()) + this.calculateApr()) - this.calculateApr() : 0 )  : 0)).toLocaleString('en-US')}</span>
    </li>
    <li>
        <span>Dealer Fees</span>
        <span>Not Included</span>
    </li>`;

        this.totalEstimated.innerHTML = `<li>
        <span>Total Vehicle Loan Amount</span>
        <span>$${(this.getTotalEstimated() < 1 ) ? 0 : Math.round(this.getTotalEstimated()).toLocaleString('en-US')}</span>
    </li>
    <li>
        <span>Monthly Payment</span>
        <span>$${(this.calculateResult() < 1) ? 0 : Math.round(this.calculateResult()).toLocaleString("en-US")}</span>
    </li>`;
    };

    // Handle Month Change on Click of Each Month Term
    handleMonthChange = (e) => {
        if (e.target.classList.contains("list-item")) {
            this.selectedMonth = +e.target.dataset.month;
        }

        this.initializeApp();
    };
}

// Instantiate Calculator App
const calc = new Calculator();