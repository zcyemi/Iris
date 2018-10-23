import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';
import globals from 'rollup-plugin-node-globals';
import process from 'process';


export default{
    input: `src/renderer.ts`,
    output: [
        {file: 'res/renderer.iife.js', name: 'renderer', format: 'iife',sourcemap: false},
        {file: 'res/renderer.es.js',format: 'es'}
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
        commonjs(),
        resolve({
            jsnext:true,
            extensions: ['.ts','.js']
        }),
        globals()
    ]
}