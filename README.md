# Iris
An experimental webgl rendering engine.

The motivation of this project is try to build a well-designed rendering framework from scratch, no third-party library.
This rendering framework is target for doing experiments of real-time rendering and graphics features like shadowing, lighting and simulations.
If you are searching a WebGL 3D engines for production, Three.js and Babylon.js are more qualified libraries.

I have migrated some rendering [demos](https://zcyemi.github.io/Iris-sample/) to WebGL by using Iris. All source codes can be found at this [repo](https://github.com/zcyemi/Iris-sample).

## Core Features
- Shader systems that supports lots of features.
  + shader including processor.
  + multi-compiled shader(uber shader)
  + pipeline state markup (e.g. ZTest/ZWrite/Blend)
- GLTF assets supports
- programmable rendering pipeline.
  + built-in configurable render passes.
  
## Known Issues
- APIs are not stable.

  Many features still need to be implmented. Function names might not be consistent when refactoring.
  
- Only WebGL2 API supported.

  For fast implementing advanced rendering effects, WebGL2 API offers more convinence. Lots of work is required for compatibility with WEBGL 1.0. Which means that compatibility are not the primary considerations currently, for the earlier versions at least.
