function loadCSS() {
    if (!document.querySelector('link[href="/blocks/timeline/timeline.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/blocks/timeline/timeline.css';
        document.head.appendChild(link);
    }
}

export default function decorate(block) {
    loadCSS();

    const rows = [...block.children];
    const content = [];

    // Read text from all rows and cells
    rows.slice(1).forEach((row) => {
        [...row.children].forEach((cell) => {
            const text = cell.textContent.trim();
            if (text) content.push(text);
        });
    });

    // Create timeline container
    const timeline = document.createElement('div');
    timeline.className = 'timeline-container';

    // First content item is the title
    const title = document.createElement('h2');
    title.className = 'timeline-title';
    title.textContent = content[0] || 'Your Solar Journey';

    timeline.appendChild(title);

    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'timeline-steps';

    // Read step headings and descriptions
    for (let i = 1; i < content.length; i += 2) {
        const step = document.createElement('div');
        step.className = 'timeline-step';

        const number = document.createElement('div');
        number.className = 'timeline-number';

        const heading = document.createElement('h3');
        heading.className = 'timeline-step-title';

        const description = document.createElement('p');
        description.className = 'timeline-description';

        const stepText = content[i];
        const match = stepText.match(/^(\d+)\s*[–-]\s*(.*)$/);

        if (match) {
            number.textContent = match[1];
            heading.textContent = match[2];
        } else {
            number.textContent = String(Math.ceil(i / 2)).padStart(2, '0');
            heading.textContent = stepText;
        }

        description.textContent = content[i + 1] || '';

        step.append(number, heading, description);
        stepsContainer.appendChild(step);
    }

    timeline.appendChild(stepsContainer);

    block.textContent = '';
    block.appendChild(timeline);
}
