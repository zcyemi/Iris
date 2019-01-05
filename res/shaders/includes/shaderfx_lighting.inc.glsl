vec3 LightModel_Lambert(vec3 lightdir,vec3 lightColor,float atten,vec3 normal,vec3 albedo){
    float diff = max(.0,dot(lightdir,normal));
    return albedo * lightColor * diff * atten;
}


vec3 Sample_4PointLights(vec3 wpos,vec3 normal){
    vec4 toLightX = lightPosX - vec4(wpos.x);
    vec4 toLightY = lightPosY - vec4(wpos.y);
    vec4 toLightZ = lightPosZ - vec4(wpos.z);

    //dot
    vec4 ndotl = vec4(0.0);
    ndotl += toLightX * normal.x;
    ndotl += toLightY * normal.y;
    ndotl += toLightZ * normal.z;
    ndotl = max(vec4(0.0),ndotl);

    //lensq
    vec4 toLightSq = vec4(0.0);
    toLightSq += toLightX * toLightX;
    toLightSq += toLightY * toLightY;
    toLightSq += toLightZ * toLightZ;
    toLightSq = max(toLightSq,vec4(0.000001));

    ndotl *= sqrt(toLightSq);

    vec4 atten = 1.0/ (1.0 + toLightSq * LIGHT_INTENSITY);
    vec4 diff = ndotl * atten;
    
    vec3 col = vec3(0.0);
    col += diff.x * LIGHT_COLOR0.xyz;
    col += diff.y * LIGHT_COLOR1.xyz;
    col += diff.z * LIGHT_COLOR2.xyz;
    col += diff.w * LIGHT_COLOR3.xyz;

    return col;
}
