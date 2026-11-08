
function loadCSS() {
    if (!document.querySelector('link[href="/blocks/blog-list/blog-list.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/blocks/blog-list/blog-list.css';
        document.head.appendChild(link);
    }
}

const INDEX_URL = '/blog-index.json';
const ARTICLES_PER_PAGE = 3;

function getDateValue(date) {
    if (!date) return 0;

    if (typeof date === 'number') {
        return date;
    }

    const parsed = Date.parse(date);

    return Number.isNaN(parsed) ? 0 : parsed / 1000;
}

function formatDate(date) {
    const timestamp = getDateValue(date);

    if (!timestamp) return '';

    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(timestamp * 1000));
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
}

function createArticleCard(article) {
    const card = createElement('article', 'blog-card');

    const link = createElement('a', 'blog-card-link');
    link.href = article.path || '#';

    if (article.image) {
        const image = createElement('img', 'blog-card-image');
        image.src = article.image;
        image.alt = article.title || 'SolarSmart blog';
        image.loading = 'lazy';
        link.append(image);
    }

    const content = createElement('div', 'blog-card-content');

    content.append(
        createElement('span', 'blog-category', article.category || 'Solar Energy'),
    );

    content.append(
        createElement('h3', 'blog-card-title', article.title || 'Untitled Article'),
    );

    content.append(
        createElement(
            'p',
            'blog-card-description',
            article.description || '',
        ),
    );

    const meta = createElement('div', 'blog-card-meta');

    meta.append(
        createElement('span', '', formatDate(article.date)),
    );

    if (article.readingTime) {
        meta.append(
            createElement('span', '', article.readingTime),
        );
    }

    content.append(meta);
    link.append(content);
    card.append(link);

    return card;
}

export default async function decorate(block) {
    loadCSS();

    block.innerHTML = '';

    const container = createElement('div', 'blog-list-container');

    const heading = createElement('h2', 'blog-list-heading', 'Explore Our Solar Blogs');

    const description = createElement(
        'p',
        'blog-list-description',
        'Discover tips, guides and insights about solar energy.',
    );

    const controls = createElement('div', 'blog-controls');

    const searchInput = createElement('input', 'blog-search');
    searchInput.type = 'search';
    searchInput.placeholder = 'Search articles...';
    searchInput.setAttribute('aria-label', 'Search blog articles');

    const categorySelect = createElement('select', 'blog-category-filter');
    categorySelect.setAttribute('aria-label', 'Filter by category');

    const sortSelect = createElement('select', 'blog-sort');
    sortSelect.setAttribute('aria-label', 'Sort articles');

    const status = createElement('p', 'blog-status', 'Loading articles...');

    const grid = createElement('div', 'blog-grid');

    const pagination = createElement('div', 'blog-pagination');

    controls.append(searchInput, categorySelect, sortSelect);

    container.append(
        heading,
        description,
        controls,
        status,
        grid,
        pagination,
    );

    block.append(container);

    let articles = [];
    let currentPage = 1;

    categorySelect.innerHTML = `
    <option value="all">All Categories</option>
  `;

    sortSelect.innerHTML = `
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  `;

    function getFilteredArticles() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const category = categorySelect.value;
        const sortOrder = sortSelect.value;

        let filtered = articles.filter((article) => {
            const matchesSearch =
                (article.title || '').toLowerCase().includes(searchTerm)
                || (article.description || '').toLowerCase().includes(searchTerm);

            const matchesCategory =
                category === 'all'
                || (article.category || '').toLowerCase() === category.toLowerCase();

            return matchesSearch && matchesCategory;
        });

        filtered.sort((a, b) => {
            const difference = getDateValue(b.date) - getDateValue(a.date);

            return sortOrder === 'newest' ? difference : -difference;
        });

        return filtered;
    }

    function renderPagination(totalPages) {
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        const previous = createElement('button', 'blog-page-button', 'Previous');
        previous.type = 'button';
        previous.disabled = currentPage === 1;

        previous.addEventListener('click', () => {
            currentPage -= 1;
            renderArticles();
        });

        pagination.append(previous);

        for (let page = 1; page <= totalPages; page += 1) {
            const button = createElement(
                'button',
                `blog-page-button ${page === currentPage ? 'active' : ''}`,
                String(page),
            );

            button.type = 'button';
            button.setAttribute('aria-label', `Go to page ${page}`);

            if (page === currentPage) {
                button.setAttribute('aria-current', 'page');
            }

            button.addEventListener('click', () => {
                currentPage = page;
                renderArticles();
            });

            pagination.append(button);
        }

        const next = createElement('button', 'blog-page-button', 'Next');
        next.type = 'button';
        next.disabled = currentPage === totalPages;

        next.addEventListener('click', () => {
            currentPage += 1;
            renderArticles();
        });

        pagination.append(next);
    }

    function renderArticles() {
        const filtered = getFilteredArticles();

        const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);

        if (totalPages === 0) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const start = (currentPage - 1) * ARTICLES_PER_PAGE;

        const visibleArticles = filtered.slice(
            start,
            start + ARTICLES_PER_PAGE,
        );

        grid.innerHTML = '';

        if (visibleArticles.length === 0) {
            grid.append(
                createElement(
                    'p',
                    'blog-no-results',
                    'No articles found. Try another search or category.',
                ),
            );
        } else {
            visibleArticles.forEach((article) => {
                grid.append(createArticleCard(article));
            });
        }

        status.textContent =
            `Showing ${visibleArticles.length} of ${filtered.length} articles`;

        renderPagination(totalPages);
    }

    searchInput.addEventListener('input', () => {
        currentPage = 1;
        renderArticles();
    });

    categorySelect.addEventListener('change', () => {
        currentPage = 1;
        renderArticles();
    });

    sortSelect.addEventListener('change', () => {
        currentPage = 1;
        renderArticles();
    });

    try {
        const response = await fetch(INDEX_URL);

        if (!response.ok) {
            throw new Error(`Index request failed: ${response.status}`);
        }

        const data = await response.json();

        articles = Array.isArray(data)
            ? data
            : Array.isArray(data.data)
                ? data.data
                : [];

        const categories = [
            ...new Set(
                articles
                    .map((article) => article.category)
                    .filter(Boolean),
            ),
        ].sort();

        categories.forEach((category) => {
            const option = createElement('option', '', category);
            option.value = category;
            categorySelect.append(option);
        });

        if (articles.length === 0) {
            status.textContent = 'No blog articles are available yet.';
            return;
        }

        renderArticles();
    } catch (error) {
        console.error('SolarSmart Blog List Error:', error);

        status.textContent =
            'Unable to load articles. Please try again later.';
    }
}

