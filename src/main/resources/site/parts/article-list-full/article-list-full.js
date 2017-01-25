var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    content: require('/lib/xp/content')
};

// Handle GET request
exports.get = handleGet;

function handleGet(req) {
    var view = resolve('article-list-full.html'); // The view to render

    var model = {};
    model.articles = getArticles();

    return {
        body: libs.thymeleaf.render(view, model)
    };
}

function getArticles() {

    var site = libs.portal.getSite();

    var currentContent = site._path + "/aktuelt";

    // This will get the article contents published as children of current content
    var result = libs.content.getChildren({
        key: currentContent,
        start: 0,
        count: 20,
        contentTypes: ['article']
    });

    return createModel(result);
}

function createModel(result) {

    var articles = [];

    result.hits.forEach(function (hit) {
        articles.push(createArticleModel(hit))
    });

    return articles;
}

function createArticleModel(hit) {
    var model = {};

    model._id = hit._id;
    model.title = hit.data.title;
    model.preface = hit.data.preface;
    model.description = libs.portal.processHtml({
        value: hit.data.description
    });
    model.bodyText = libs.portal.processHtml({
        value: hit.data.bodyText
    });
    model.listImage = hit.data.listImage;

    return model;
}