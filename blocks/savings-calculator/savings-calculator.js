
function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

export default function decorate(block) {
    loadCSS('/blocks/savings-calculator/savings-calculator.css');

    const rows = [...block.children];
    const content = [];

    rows.forEach((row) => {
        [...row.children].forEach((cell) => {
            const text = cell.textContent.trim();
            if (text) content.push(text);
        });
    });

    const calculator = document.createElement('div');
    calculator.className = 'calculator-container';

    const heading = document.createElement('h2');
    heading.textContent = content[0] || 'Calculate Your Solar Savings';

    const description = document.createElement('p');
    description.textContent = content[1]
        || 'Enter your monthly electricity bill to estimate your potential savings.';

    const label = document.createElement('label');
    label.textContent = 'Monthly Electricity Bill (₹)';
    label.htmlFor = 'monthly-electricity-bill';

    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'monthly-electricity-bill';
    input.placeholder = 'Enter your monthly bill';
    input.min = '1';
    input.required = true;

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = content[2] || 'Calculate Savings';

    const result = document.createElement('div');
    result.className = 'calculator-result';
    result.setAttribute('aria-live', 'polite');

    const API_URL =
        'https://solarsmart-api.free.beeceptor.com/calculate-savings';

    button.addEventListener('click', async () => {
        const monthlyBill = Number(input.value);

        if (!monthlyBill || monthlyBill <= 0) {
            result.textContent = 'Please enter a valid monthly electricity bill.';
            result.className = 'calculator-result error';
            return;
        }

        button.disabled = true;
        button.textContent = 'Calculating...';

        result.textContent = 'Please wait while we calculate your savings.';
        result.className = 'calculator-result loading';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ monthlyBill }),
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();

            result.replaceChildren();

            const message = document.createElement('p');
            message.textContent = data.message || 'Your estimated solar savings:';

            const monthly = document.createElement('p');
            monthly.textContent =
                `Estimated Monthly Savings: ₹${Number(data.estimatedMonthlySavings).toLocaleString('en-IN')}`;

            const annual = document.createElement('p');
            annual.textContent =
                `Estimated Annual Savings: ₹${Number(data.annualSavings).toLocaleString('en-IN')}`;

            const system = document.createElement('p');
            system.textContent =
                `Recommended System Size: ${data.systemSizeKw} kW`;

            result.append(message, monthly, annual, system);
            result.className = 'calculator-result success';
        } catch (error) {
            result.textContent =
                'Unable to calculate savings. Please try again later.';
            result.className = 'calculator-result error';

            console.error('Savings Calculator API error:', error);
        } finally {
            button.disabled = false;
            button.textContent = content[2] || 'Calculate Savings';
        }
    });

    calculator.append(
        heading,
        description,
        label,
        input,
        button,
        result,
    );

    block.replaceChildren(calculator);
}
