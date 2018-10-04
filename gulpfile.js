const gulp = require('gulp');
const child_process = require('child_process');

const browsersync = require('browser-sync');

gulp.task('build',()=>{
    build();
});

gulp.task('watch',()=>{
    gulp.watch('./src/**/*.ts',null,()=>{
        build();
    });
    browsersync.init({
        server: {
            baseDir: './',
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        },
        port: 6644,
        files: ['./dist/*.js', './*.html']
    })
})

function build(){
    child_process.exec('rollup -c rollup.config.ts',(error,stdout,stderr)=>{
        if(stdout != null && stdout != '') console.log(stdout);
        if(stderr != null && stderr != '') console.log(stderr);
    });
}