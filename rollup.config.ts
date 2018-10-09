import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';
import globals from 'rollup-plugin-node-globals';
import process from 'process';


export default{
    input: `src/index.ts`,
    output: [
        {file: 'dist/sample.js', name: 'sample', format: 'iife',sourcemap: false}
    ],
    external: [],
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: { module: 'es2015'}
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