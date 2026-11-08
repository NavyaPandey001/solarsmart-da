function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

export default function decorate(block) {
    // Load Savings Calculator CSS
    loadCSS('/blocks/savings-calculator/savings-calculator.css');

    const rows = [...block.children];
    const content = [];

    // Read content from DA.live block
    rows.forEach((row) => {
        [...row.children].forEach((cell) => {
            const text = cell.textContent.trim();

            if (text) {
                content.push(text);
            }
        });
    });

    // Create calculator container
    const calculator = document.createElement('div');
    calculator.className = 'calculator-container';

    // Heading
    const heading = document.createElement('h2');
    heading.textContent = content[0] || 'Calculate Your Solar Savings';

    // Description
    const description = document.createElement('p');
    description.textContent = content[1] ||
        'Enter your monthly electricity bill to estimate your potential savings.';

    // Input label
    const label = document.createElement('label');
    label.textContent = 'Monthly Electricity Bill (₹)';
    label.htmlFor = 'monthly-electricity-bill';

    // Electricity bill input
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'monthly-electricity-bill';
    input.placeholder = 'Enter your monthly bill';
    input.min = '1';
    input.required = true;

    // Calculate button
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = content[2] || 'Calculate Savings';

    // Result container
    const result = document.createElement('div');
    result.className = 'calculator-result';
    result.setAttribute('aria-live', 'polite');

    // API endpoint: replace this with your actual Beeceptor URL
    const API_URL = 'PASTE_YOUR_BEECEPTOR_CALCULATE_SAVINGS_URL_HERE';

    // Calculate savings
    button.addEventListener('click', async () => {
        const monthlyBill = Number(input.value);

        if (!monthlyBill || monthlyBill <= 0) {
            result.textContent = 'Please enter a valid monthly electricity bill.';
            result.className = 'calculator-result error';
            return;
        }

        if (API_URL.startsWith('PASTE_')) {
            result.textContent = 'Calculator API URL has not been configured yet.';
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
                body: JSON.stringify({
                    monthlyBill,
                }),
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();

            result.textContent = `API Response: ${JSON.stringify(data)}`;
            result.className = 'calculator-result success';
        } catch (error) {
            result.textContent = 'Unable to calculate savings. Please try again.';
            result.className = 'calculator-result error';
            console.error('Savings Calculator API error:', error);
        } finally {
            button.disabled = false;
            button.textContent = content[2] || 'Calculate Savings';
        }
    });

    // Assemble calculator
    calculator.append(
        heading,
        description,
        label,
        input,
        button,
        result
    );

    // Replace original block content
    block.textContent = '';
    block.append(calculator);
}
