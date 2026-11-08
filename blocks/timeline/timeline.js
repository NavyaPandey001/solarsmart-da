
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

    // Get all rows from the DA.live block
    const rows = [...block.children];

    // Create main timeline container
    const timeline = document.createElement('div');
    timeline.className = 'timeline-container';

    // Create steps wrapper
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'timeline-steps';

    // Skip the first row because it contains the block name
    rows.slice(1).forEach((row, index) => {
        const cells = [...row.children];

        const stepTitle = cells[0]?.textContent.trim() || '';
        const stepDescription = cells[1]?.textContent.trim() || '';

        if (!stepTitle && !stepDescription) return;

        // Extract step number and title
        const match = stepTitle.match(/^(\d+)\s*[–-]\s*(.*)$/);

        const number = match
            ? match[1]
            : String(index + 1).padStart(2, '0');

        const headingText = match
            ? match[2]
            : stepTitle;

        // Create timeline step
        const step = document.createElement('div');
        step.className = 'timeline-step';

        // Timeline number
        const numberElement = document.createElement('div');
        numberElement.className = 'timeline-number';
        numberElement.textContent = number;

        // Timeline content
        const content = document.createElement('div');
        content.className = 'timeline-content';

        const heading = document.createElement('h3');
        heading.className = 'timeline-step-title';
        heading.textContent = headingText;

        const description = document.createElement('p');
        description.className = 'timeline-description';
        description.textContent = stepDescription;

        content.append(heading, description);
        step.append(numberElement, content);

        stepsContainer.appendChild(step);
    });

    timeline.appendChild(stepsContainer);

    // Replace original table with timeline
    block.replaceChildren(timeline);
}
