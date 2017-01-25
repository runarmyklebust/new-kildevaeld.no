var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    content: require('/lib/xp/content')

};

// Handle GET request
exports.get = handleGet;

function handleGet(req) {
    var view = resolve('course-list-full.html'); // The view to render
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

        var courses = [];

        result.hits.forEach(function (course) {
            var model = {};

            model._id = course._id;
            model.title = course.data.title;
            model.preface = course.data.preface;
            model.description = libs.portal.processHtml({
                value: course.data.description
            });
            model.bodyText = libs.portal.processHtml({
                value: course.data.bodyText
            });
          
            courses.push(model);
        });

        return courses;
    }

    return {
        body: libs.thymeleaf.render(view, model)
    };
}