import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';
import globals from 'rollup-plugin-node-globals';
import browsersync from 'rollup-plugin-browsersync';


export default{
    input: `src/index.ts`,
    output: [
        {file: 'dist/iris.iife.js', name: 'iris', format: 'iife',sourcemap: false},
        // {file: 'dist/iris.es.js',format: 'es'}
    ],
    external: [],
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: { module: 'es2015',declaration:false},
            },
            tsconfig: 'tsconfig.json',
            useTsconfigDeclarationDir:true
        }),
        commonjs({
            include: 'node_modules/**'
        }),
        resolve({
            jsnext:true,
            extensions: ['.ts','.js']
        }),
        globals(),
        browsersync({
            server:'./'
        })
    ]
}