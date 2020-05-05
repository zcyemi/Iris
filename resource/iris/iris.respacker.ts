module.exports = [
    {
        srcDir: 'resource/iris',
        bundleName: 'iris',
        input:[{
            pattern: 'shaders/**',
            path:''
        }],
        output:'dist/iris.resbundle'
    }
]