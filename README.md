# Iris
An experimental webgl rendering engine.

The motivation of this project is try to build a well-designed rendering framework from scratch, no third-party library.
This rendering framework is target for doing experiments of rendering and computer graphics features like shadowing, lighting and simulations.
If you are searching a WebGL 3D engines for production, Three.js and Babylon.js are more qualified libraries.

I have migrated some previous rendering demos to WebGL by using Iris. [DEMO](https://github.com/soyemi/Iris-sample).

## Core Features
- Shader systems that supports lots of features.
  + shader including processor.
  + multi-compiled shader(uber shader)
  + pipeline state markup (e.g. ZTest/ZWrite/Blend)
- GLTF assets supports
- programmable rendering pipeline.
  + built-in configurable render passes.
  
## Known Issues

- Only WebGL2 API supported
  For fast implementing advanced rendering effects, WebGL2 API offers more convinence. Lots of work is required for compatibility with WEBGL 1.0. Which means that compatibility are not the primary considerations currently, for the earlier versions at least.
