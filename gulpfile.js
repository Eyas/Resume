var gulp = require("gulp");
var file = require("gulp-file");
var tsc = require("gulp-typescript");
var del = require("del");

gulp.task("clean", function() {
  return del("built");
});

gulp.task("build", function() {
  const project = tsc.createProject("src/tsconfig.json");
  return project
    .src()
    .pipe(project())
    .js.pipe(gulp.dest("built/"));
});

gulp.task("resume-json", function() {
  var r = require("./built/data/EyasResume.js");
  return file("cv.json", JSON.stringify(r.EyasResume, null, 4), {
    src: true
  }).pipe(gulp.dest("resume/"));
});

gulp.task("resume-md", function() {
  var r = require("./built/data/EyasResume.js");
  var t = require("./built/data/EyasResumeTransform.js");
  var x = require("./built/core/transform.js");
  var md = require("./built/markdown/generator.js");
  var str_cv = md.toMarkdown(r.EyasResume);
  var str_resume = md.toMarkdown(x.TransformResume(r.EyasResume, t.Transform));
  return file("cv.md", str_cv, { src: true })
    .pipe(file("resume.md", str_resume))
    .pipe(gulp.dest("resume/"));
});

gulp.task("resume-html", function() {
  var r = require("./built/data/EyasResume.js");

  var ReactDOMServer = require("react-dom/server");
  var CV = require("./built/react-html/cv_render");
  var TC = require("./built/react-html/twocolumn_render");
  require("./built/core/extensions.js");

  var cvr =
    "<!DOCTYPE HTML>\n" +
    ReactDOMServer.renderToStaticMarkup(
      new CV.Static({ resume: r.EyasResume }).render()
    );
  var tcr =
    "<!DOCTYPE HTML>\n" +
    ReactDOMServer.renderToStaticMarkup(
      new TC.Static({ resume: r.EyasResume }).render()
    );

  return file("cv.html", cvr, { src: true })
    .pipe(file("resume.html", tcr))
    .pipe(gulp.dest("resume/"));
});

gulp.task(
  "resume",
  gulp.series(
    "clean",
    "build",
    gulp.parallel("resume-json", "resume-md", "resume-html")
  )
);
