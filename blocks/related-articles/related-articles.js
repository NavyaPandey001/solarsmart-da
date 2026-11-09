function loadCSS() {
    const href = '/blocks/related-articles/related-articles.css';

    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.append(link);
    }
}

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

function getCategory(article) {
    return String(article.category || article.blogCategory || '').trim().toLowerCase();
}

function getImage(article) {
    return article.image || article.imageUrl || article['og:image'] || '';
}

function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'related-article-card';

    const imageUrl = getImage(article);

    if (imageUrl) {
        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = getTitle(article);
        image.loading = 'lazy';
        card.append(image);
    }

    const content = document.createElement('div');
    content.className = 'related-article-content';

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
    heading.className = 'related-articles-heading';
    heading.textContent = 'Related Articles';

    const list = document.createElement('div');
    list.className = 'related-articles-list';

    block.replaceChildren(heading, list);

    try {
        const response = await fetch('/blog-index.json');

        if (!response.ok) {
            throw new Error(`Blog index request failed: ${response.status}`);
        }

        const data = await response.json();
        const articles = getArticles(data);

        const currentArticle = articles.find(
            (article) => getPath(article).replace(/\/$/, '') === currentPath,
        );

        if (!currentArticle) {
            list.textContent = 'Unable to identify this article in the blog index.';
            return;
        }

        const category = getCategory(currentArticle);

        if (!category) {
            list.textContent = 'Related articles are not available for this category.';
            return;
        }

        const related = articles
            .filter((article) => {
                const articlePath = getPath(article).replace(/\/$/, '');
                return articlePath !== currentPath && getCategory(article) === category;
            })
            .slice(0, 3);

        if (!related.length) {
            list.textContent = 'No related articles are available yet.';
            return;
        }

        related.forEach((article) => {
            list.append(createArticleCard(article));
        });
    } catch (error) {
        console.error('Related Articles error:', error);
        list.textContent = 'Unable to load related articles. Please try again later.';
    }
}