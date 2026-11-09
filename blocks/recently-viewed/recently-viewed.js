function loadCSS() {
    const href = '/blocks/recently-viewed/recently-viewed.css';

    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.append(link);
    }
}

const STORAGE_KEY = 'solarsmart-recently-viewed';
const MAX_STORED_ARTICLES = 10;

function getArticles(data) {
    return Array.isArray(data) ? data : data.data || [];
}

function getPath(article) {
    return article.path || article.url || article.link || '';
}

function getTitle(article) {
    return article.title || article['og:title'] || article.name || 'Read article';
}

function getDescription(article) {
    return article.description || article.excerpt || '';
}

function getImage(article) {
    return article.image || article.imageUrl || article['og:image'] || '';
}

function getStoredPaths() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(stored) ? stored : [];
    } catch (error) {
        console.warn('Could not read recently viewed articles:', error);
        return [];
    }
}

function saveCurrentArticle(currentPath) {
    try {
        const previousPaths = getStoredPaths();

        const updatedPaths = [
            currentPath,
            ...previousPaths.filter((path) => path !== currentPath),
        ].slice(0, MAX_STORED_ARTICLES);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPaths));
    } catch (error) {
        console.warn('Could not save recently viewed article:', error);
    }
}

function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'recently-viewed-card';

    const imageUrl = getImage(article);

    if (imageUrl) {
        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = getTitle(article);
        image.loading = 'lazy';
        card.append(image);
    }

    const content = document.createElement('div');
    content.className = 'recently-viewed-content';

    const title = document.createElement('h3');
    const link = document.createElement('a');
    link.href = getPath(article);
    link.textContent = getTitle(article);
    title.append(link);

    content.append(title);

    const descriptionText = getDescription(article);

    if (descriptionText) {
        const description = document.createElement('p');
        description.textContent = descriptionText;
        content.append(description);
    }

    card.append(content);
    return card;
}

export default async function decorate(block) {
    loadCSS();

    const currentPath = window.location.pathname.replace(/\/$/, '');

    const heading = document.createElement('h2');
    heading.className = 'recently-viewed-heading';
    heading.textContent = 'Recently Viewed Blogs';

    const list = document.createElement('div');
    list.className = 'recently-viewed-list';

    block.replaceChildren(heading, list);

    if (!currentPath.startsWith('/blogs/')) {
        list.textContent = 'Recently viewed articles will appear here.';
        return;
    }

    // Save this article as the most recently viewed.
    saveCurrentArticle(currentPath);

    try {
        const response = await fetch('/blog-index.json');

        if (!response.ok) {
            throw new Error(`Blog index request failed: ${response.status}`);
        }

        const data = await response.json();
        const articles = getArticles(data);

        const articleByPath = new Map(
            articles.map((article) => [
                getPath(article).replace(/\/$/, ''),
                article,
            ]),
        );

        // Do not show the article the visitor is currently reading.
        const previousArticles = getStoredPaths()
            .filter((path) => path !== currentPath)
            .map((path) => articleByPath.get(path))
            .filter(Boolean)
            .slice(0, 3);

        if (!previousArticles.length) {
            list.textContent = 'Your previously viewed articles will appear here.';
            return;
        }

        previousArticles.forEach((article) => {
            list.append(createArticleCard(article));
        });
    } catch (error) {
        console.error('Recently Viewed Blogs error:', error);
        list.textContent = 'Unable to load recently viewed blogs.';
    }
}