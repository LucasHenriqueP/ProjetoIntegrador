const gulp = require("gulp")

function defaultTask(cb) {
    console.log("Função Default!")
    cb();
}

gulp.task('ola', function (cb) {
    console.log("Funcionou")
    cb();
})

exports.default = defaultTask