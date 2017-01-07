var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    content: require('/lib/xp/content')
};

// Handle GET request
exports.get = handleGet;

function handleGet(req) {
    var view = resolve('course-list-upcoming.html'); // The view to render
    var model = createModel(); // The model to send to the view

    function createModel() {
        var model = {};

        model.courses = getCourses();

        return model;
    }

    function getCourses() {

        var now = new Date();

        // This will get any article content published on the site
        var result = libs.content.query({
            query: "data.startup > instant('" + now.toISOString() + "')",
            count: 10,
            sort: 'data.startup DESC',
            contentTypes: [app.name + ':course']
        });


        return result.hits;
    }

    return {
        body: libs.thymeleaf.render(view, model)
    };
}