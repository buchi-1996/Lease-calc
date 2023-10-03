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

    // Methods
    initializeApp = () => {
        this.result.innerText = this.calculateResult().toLocaleString("en-US");
        this.showTerms();
    };



    calculateResult = () => {
        if (
            +this.downPayment.value.trim().replace(/,/g, "") >=
            +this.msrp.value.trim().replace(/,/g, "")
        ) {
            return 0;
        }
        const loanAmount = this.msrp.value.trim().replace(/,/g, "") - this.downPayment.value.trim().replace(/,/g, "") - this.tradeInValue.value.trim().replace(/,/g, "")

        if(this.apr.value !== ''){
            return Math.round(((this.apr.value / 1200) * loanAmount) / (1 - (Math.pow((1 + (this.apr.value / 1200)), (-this.selectedMonth)))))
        }
         
        if(this.salesTax.value !== ''){
            return Math.round((this.calculateSalesTax() / this.selectedMonth ) + this.result.innerText.trim().replace(/,/g, "") )
        }

        return (
            Math.round(
                (this.msrp.value.trim().replace(/,/g, "") -
                    this.downPayment.value.trim().replace(/,/g, "") -
                    this.tradeInValue.value.trim().replace(/,/g, "")) /
                this.selectedMonth
            ) || 0
        );
        // return ((this.apr.value / 1200) * +this.getTotalEstimated().trim().replace(/,/g, "")) / (1 - (Math.pow((1 + (this.apr.value / 1200)), (-this.selectedMonth)))) || 0

    };

    calculateApr = () => {
        console.log(((+this.apr.value / 1200) * +this.getTotalEstimated().trim().replace(/,/g, "")) / (1 - (Math.pow((1 + (this.apr.value / 1200)), (-this.selectedMonth)))))
        return ((this.apr.value / 1200) * +this.getTotalEstimated().trim().replace(/,/g, "")) / (1 - (Math.pow((1 + (this.apr.value / 1200)), (-this.selectedMonth))))
        
    }


    calculateSalesTax = () => {
       return (this.salesTax.value.trim().replace(/,/g, "") / 100) * this.msrp.value.trim().replace(/,/g, "")
    }

    
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

        return Math.round(
           ( this.msrp.value.trim().replace(/,/g, "") -
            this.downPayment.value.trim().replace(/,/g, "") -
            this.tradeInValue.value.trim().replace(/,/g, "") + this.calculateSalesTax() ) + ((this.salesTax.value === '' && this.apr.value === '') ? 0 : ((this.result.innerText.trim().replace(/,/g, "") * this.selectedMonth) - loanAmount))
        ).toLocaleString("en-US");

        // console.log(this.calculateResult())
        // return (+this.calculateResult() * +this.selectedMonth).toLocaleString("en-US")
    };

    validatePercent = () => {
        console.log(this.apr)
        this.initializeApp()
    }
    

    updateResult = (e) => {
        console.log(this.msrp.value.length);

        if (e.target.value.length === 0) {
            console.log("yes", e.keyCode);
            if (e.keyCode === 8 || e.keyCode === 46) {
                e.target.value = 0;
            }
        }

        // e.target.value.toLocaleString('en-US')
        // console.log(BigInt(+e.target.value.trim().replace(/,/g, '')))
        let num = e.target.value.replace(/,/gi, "");
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

    

    validateInput = (e) => {
        if (+e.target.value === 0) {
            e.target.value = "";
        }
    };

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
        <span>+$${this.calculateSalesTax()}</span>
    </li>
    <li>
        <span>Estimated Financing Rate</span>
        <span>+$${(this.salesTax.value === '' && this.apr.value === '') ? 0 : (this.result.innerText.trim().replace(/,/g, "") * this.selectedMonth) - ((this.msrp.value.trim().replace(/,/g, "") - this.downPayment.value.trim().replace(/,/g, "")) - this.tradeInValue.value.trim().replace(/,/g, ""))}</span>
    </li>
    <li>
        <span>Dealer Fees</span>
        <span>Not Included</span>
    </li>`;

        this.totalEstimated.innerHTML = `<li>
        <span>Total Vehicle Loan Amount</span>
        <span>$${this.getTotalEstimated()}</span>
    </li>
    <li>
        <span>Monthly Payment</span>
        <span>$${this.calculateResult()}</span>
    </li>`;
    };

    handleMonthChange = (e) => {
        if (e.target.classList.contains("list-item")) {
            this.selectedMonth = +e.target.dataset.month;
            console.log(e.target.dataset.month);
        }

        this.initializeApp();
    };
}

const calc = new Calculator();
