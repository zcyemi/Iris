import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';
import globals from 'rollup-plugin-node-globals';
import autoExternal from 'rollup-plugin-auto-external';


export default{
    input: 'src/sample/irissample.ts',
    output:{
        file: 'dist/irissample.esm.js',
        format: 'esm',
    },
    external: [],
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: { module: 'es2015',declaration:false},
            },
            tsconfig: 'tsconfig.json',
            useTsconfigDeclarationDir:true
        }),
        // autoExternal(),
        commonjs({
            include: 'node_modules/**'
        }),
        resolve({
            jsnext:true,
            extensions: ['.ts','.js']
        }),
        globals(),
    ]
}